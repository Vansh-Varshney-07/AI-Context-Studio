"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface SecurityAdvisoryFilters {
  severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  status?: "DRAFT" | "PUBLISHED" | "WITHDRAWN";
  page?: number;
  limit?: number;
}

export interface PaginatedAdvisories {
  advisories: SecurityAdvisoryWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface SecurityAdvisoryWithRelations {
  id: string;
  cveId: string | null;
  ghsaId: string | null;
  title: string;
  description: string;
  severity: string;
  cvssScore: number | null;
  cvssVector: string | null;
  affectedVersions: string[];
  patchedVersions: string[];
  status: string;
  publishedAt: Date | null;
  withdrawnAt: Date | null;
  references: unknown | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSecurityAdvisories(filters: SecurityAdvisoryFilters = {}): Promise<PaginatedAdvisories> {
  const { severity, status = "PUBLISHED", page = 1, limit = 20 } = filters;

  const where: Prisma.SecurityAdvisoryWhereInput = { status };
  if (severity) where.severity = severity;

  const [advisories, totalCount] = await Promise.all([
    prisma.securityAdvisory.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.securityAdvisory.count({ where }),
  ]);

  return { advisories, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
}

export async function getSecurityAdvisoryById(id: string) {
  return prisma.securityAdvisory.findUnique({ where: { id } });
}

export async function getSecurityAdvisoryByCVE(cveId: string) {
  return prisma.securityAdvisory.findUnique({ where: { cveId } });
}

export async function getAuditReports() {
  return prisma.auditReport.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getAuditReportById(id: string) {
  return prisma.auditReport.findUnique({ where: { id } });
}

export async function getSecurityPolicy() {
  return {
    policy: `
# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly:

**Email:** security@ai-context-studio.dev

**PGP Key:** Available at \`/security.txt\` (RFC 9116)

### What to include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### Response timeline:
- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 5 business days
- **Fix timeline:** 
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

We will coordinate with you on disclosure timing. Public disclosure will occur after a fix is released.

## Security Measures

- **Code signing:** All releases are signed with EV certificates
- **Checksums:** SHA256 checksums provided for all downloads
- **Notarization:** macOS builds notarized by Apple
- **Reproducible builds:** Goal for v1.1+
- **Dependency scanning:** Automated in CI/CD
- **SBOM:** Software Bill of Materials per release

## Threat Model

See \`/docs/security/threat-model\` for our full threat model documentation.
    `,
    disclosure: `
# Responsible Disclosure

We follow Coordinated Vulnerability Disclosure (CVD) best practices.

## Contact
- **Email:** security@ai-context-studio.dev
- **PGP:** Key available in \`security.txt\`

## Scope
- AI Context Studio desktop application
- Web platform (ai-context-studio.dev)
- Registry server and API
- CLI tools

## Out of Scope
- Third-party services
- Social engineering attacks
- Physical attacks
- DoS attacks on infrastructure

## Recognition
Security researchers who report valid vulnerabilities will be acknowledged in our Security Hall of Fame (with permission).
    `,
  };
}