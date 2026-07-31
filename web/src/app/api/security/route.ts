import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSecurityAdvisories, getSecurityAdvisoryById, getSecurityAdvisoryByCVE, getAuditReports, getAuditReportById, getSecurityPolicy } from "@/actions/security";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");
  const cve = searchParams.get("cve");

  if (action === "policy") {
    const policy = await getSecurityPolicy();
    return NextResponse.json(policy);
  }

  if (action === "audit-reports") {
    if (id) {
      const report = await getAuditReportById(id);
      if (!report) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
      return NextResponse.json(report);
    }
    const reports = await getAuditReports();
    return NextResponse.json(reports);
  }

  if (cve) {
    const advisory = await getSecurityAdvisoryByCVE(cve);
    if (!advisory) {
      return NextResponse.json({ error: "Advisory not found" }, { status: 404 });
    }
    return NextResponse.json(advisory);
  }

  if (id) {
    const advisory = await getSecurityAdvisoryById(id);
    if (!advisory) {
      return NextResponse.json({ error: "Advisory not found" }, { status: 404 });
    }
    return NextResponse.json(advisory);
  }

  const severity = searchParams.get("severity") as any;
  const status = searchParams.get("status") as any;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const result = await getSecurityAdvisories({ severity, status, page, limit });
  return NextResponse.json(result);
}