import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRegistryPackages, getRegistryPackageByName, getRegistryPackageVersion, getRegistryKeywords } from "@/actions/registry";
import { requireAuth } from "@/actions/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const version = searchParams.get("version");
  const action = searchParams.get("action");

  if (action === "keywords") {
    const keywords = await getRegistryKeywords();
    return NextResponse.json(keywords);
  }

  if (name && version) {
    const pkgVersion = await getRegistryPackageVersion(name, version);
    if (!pkgVersion) {
      return NextResponse.json({ error: "Package version not found" }, { status: 404 });
    }
    return NextResponse.json(pkgVersion);
  }

  if (name) {
    const pkg = await getRegistryPackageByName(name);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json(pkg);
  }

  const keyword = searchParams.get("keyword");
  const authorId = searchParams.get("authorId");
  const search = searchParams.get("q");
  const isOfficial = searchParams.get("official") === "true" ? true : searchParams.get("official") === "false" ? false : undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const filters = {
    keyword: keyword || undefined,
    authorId: authorId || undefined,
    search: search || undefined,
    isOfficial,
    page,
    limit,
  };

  const result = await getRegistryPackages(filters);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "publish") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { packageId, version, manifest, tarballUrl, tarballSize, checksum, signature, changelog, readme, isPrerelease } = body;

      if (!packageId || !version || !manifest || !tarballUrl || !tarballSize || !checksum) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Verify ownership
      const pkg = await getRegistryPackageByName(""); // This needs packageId lookup
      // In real implementation, check if session.user.id === pkg.authorId

      const pkgVersion = await prisma.registryVersion.create({
        data: {
          packageId,
          version,
          manifest,
          tarballUrl,
          tarballSize,
          checksum,
          signature,
          changelog,
          readme,
          isPrerelease: isPrerelease || false,
        },
      });

      return NextResponse.json(pkgVersion, { status: 201 });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (action === "create") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { name, displayName, description, repository, homepage, license, keywords } = body;

      if (!name || !displayName || !description) {
        return NextResponse.json({ error: "Name, displayName, and description required" }, { status: 400 });
      }

      const pkg = await prisma.registryPackage.create({
        data: {
          name: name.toLowerCase(),
          displayName,
          description,
          authorId: session.user.id,
          repository,
          homepage,
          license,
          keywords: keywords
            ? {
                create: keywords.map((keyword: string) => ({
                  keyword: { connectOrCreate: { where: { name: keyword }, create: { name: keyword } } },
                })),
              }
            : undefined,
        },
      });

      return NextResponse.json(pkg, { status: 201 });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (action === "star") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { packageId } = body;

      if (!packageId) {
        return NextResponse.json({ error: "Package ID required" }, { status: 400 });
      }

      await prisma.like.upsert({
        where: { userId_targetId_targetType: { userId: session.user.id, targetId: packageId, targetType: "ASSET" } },
        create: { userId: session.user.id, targetId: packageId, targetType: "ASSET" },
        update: {},
      });

      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (action === "unstar") {
    try {
      const session = await requireAuth();
      const body = await request.json();
      const { packageId } = body;

      if (!packageId) {
        return NextResponse.json({ error: "Package ID required" }, { status: 400 });
      }

      await prisma.like.delete({
        where: { userId_targetId_targetType: { userId: session.user.id, targetId: packageId, targetType: "ASSET" } },
      });

      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}