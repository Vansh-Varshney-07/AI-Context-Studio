import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getReleases, getLatestRelease, getReleaseByVersion, getPlatformDownloads, getAllPlatformDownloads, getSystemRequirements, getSourceCodeInfo } from "@/actions/downloads";
import type { Platform } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "latest") {
    const release = await getLatestRelease();
    return NextResponse.json(release);
  }

  if (action === "platform") {
    const platform = searchParams.get("platform");
    if (!platform) {
      return NextResponse.json({ error: "Platform required" }, { status: 400 });
    }
    const downloads = await getPlatformDownloads(platform as Platform);
    return NextResponse.json(downloads);
  }

  if (action === "all-platforms") {
    const downloads = await getAllPlatformDownloads();
    return NextResponse.json(downloads);
  }

  if (action === "requirements") {
    const requirements = await getSystemRequirements();
    return NextResponse.json(requirements);
  }

  if (action === "source") {
    const source = await getSourceCodeInfo();
    return NextResponse.json(source);
  }

  const version = searchParams.get("version");
  if (version) {
    const release = await getReleaseByVersion(version);
    if (!release) {
      return NextResponse.json({ error: "Release not found" }, { status: 404 });
    }
    return NextResponse.json(release);
  }

  const releases = await getReleases();
  return NextResponse.json(releases);
}