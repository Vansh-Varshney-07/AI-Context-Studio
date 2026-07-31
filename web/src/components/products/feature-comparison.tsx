'use client';

import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/common/scroll-reveal';

const products = [
  { id: 'desktop', name: 'Desktop App' },
  { id: 'hub', name: 'Online Hub' },
  { id: 'marketplace', name: 'Marketplace' },
  { id: 'registry', name: 'Registry' },
  { id: 'community', name: 'Community' },
  { id: 'cloud', name: 'Future Cloud' },
];

const features = [
  {
    category: 'Core Functionality',
    items: [
      {
        name: 'Local-first execution',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: true,
        cloud: true,
      },
      {
        name: 'Offline capable',
        desktop: true,
        hub: false,
        marketplace: false,
        registry: false,
        community: false,
        cloud: false,
      },
      {
        name: 'System prompt management',
        desktop: true,
        hub: true,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Instruction files (AGENTS.md)',
        desktop: true,
        hub: true,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Prompt library & templates',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: true,
        cloud: true,
      },
      {
        name: 'Persona management',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: true,
        cloud: true,
      },
      {
        name: 'Skill development & testing',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: true,
        cloud: true,
      },
      {
        name: 'Memory & context persistence',
        desktop: true,
        hub: true,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Workflow automation',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'MCP server management',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: false,
        cloud: true,
      },
    ],
  },
  {
    category: 'Collaboration & Sync',
    items: [
      {
        name: 'Cross-device sync',
        desktop: false,
        hub: true,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Team workspaces',
        desktop: false,
        hub: true,
        marketplace: false,
        registry: false,
        community: true,
        cloud: true,
      },
      {
        name: 'Shared collections',
        desktop: false,
        hub: true,
        marketplace: true,
        registry: false,
        community: true,
        cloud: true,
      },
      {
        name: 'Version history',
        desktop: false,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Access controls & RBAC',
        desktop: false,
        hub: true,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Real-time collaboration',
        desktop: false,
        hub: true,
        marketplace: false,
        registry: false,
        community: true,
        cloud: true,
      },
    ],
  },
  {
    category: 'Marketplace & Distribution',
    items: [
      {
        name: 'Browse community assets',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: true,
        cloud: true,
      },
      {
        name: 'One-click install',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Publish & monetize',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: false,
        community: true,
        cloud: true,
      },
      {
        name: 'Asset validation & linting',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Dependency resolution',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Compatibility matrix',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Ratings & reviews',
        desktop: false,
        hub: true,
        marketplace: true,
        registry: false,
        community: true,
        cloud: true,
      },
    ],
  },
  {
    category: 'Registry & Standards',
    items: [
      {
        name: 'Manifest schema (.acs)',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Semantic versioning',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Dependency graph',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Schema validation',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Checksum verification',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
    ],
  },
  {
    category: 'Enterprise & Compliance',
    items: [
      {
        name: 'SSO/SAML/OIDC',
        desktop: false,
        hub: true,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Audit logs',
        desktop: false,
        hub: true,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Compliance reporting',
        desktop: false,
        hub: false,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'SLA & dedicated support',
        desktop: false,
        hub: false,
        marketplace: false,
        registry: false,
        community: false,
        cloud: true,
      },
      {
        name: 'Private registry hosting',
        desktop: true,
        hub: true,
        marketplace: false,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Air-gapped deployment',
        desktop: true,
        hub: false,
        marketplace: false,
        registry: true,
        community: false,
        cloud: false,
      },
    ],
  },
  {
    category: 'Developer Experience',
    items: [
      {
        name: 'CLI tooling',
        desktop: true,
        hub: false,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'VS Code extension',
        desktop: true,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'API & webhooks',
        desktop: false,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'SDK for custom integrations',
        desktop: false,
        hub: true,
        marketplace: true,
        registry: true,
        community: false,
        cloud: true,
      },
      {
        name: 'Local development server',
        desktop: true,
        hub: true,
        marketplace: false,
        registry: true,
        community: false,
        cloud: true,
      },
    ],
  },
];

function FeatureCell({ value }: { value: boolean }) {
  if (value)
    return <Check className="mx-auto h-5 w-5 text-[var(--color-success)]" aria-hidden="true" />;
  return <X className="mx-auto h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />;
}

export function FeatureComparison() {
  return (
    <section id="comparison" className="section" aria-labelledby="comparison-heading">
      <div className="container-app">
        <ScrollReveal className="mb-12 text-center">
          <h2
            id="comparison-heading"
            className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
          >
            Feature Comparison
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Each product focuses on what it does best. Use them together or independently — no
            forced bundles.
          </p>
        </ScrollReveal>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]" role="table">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="sticky left-0 z-10 bg-[var(--color-bg-primary)] px-4 py-3 text-left font-semibold text-[var(--color-text-primary)]">
                  Feature
                </th>
                {products.map((p) => (
                  <th
                    key={p.id}
                    className="bg-[var(--color-bg-primary)] px-4 py-3 text-center font-semibold text-[var(--color-text-primary)]"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((section, _sectionIndex) => (
                <React.Fragment key={section.category}>
                  <tr className="bg-[var(--color-bg-secondary)]">
                    <td
                      colSpan={products.length + 1}
                      className="px-4 py-2 text-sm font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase"
                    >
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, itemIndex) => (
                    <tr
                      key={item.name}
                      className={cn(
                        'border-b border-[var(--color-border-subtle)]',
                        itemIndex % 2 === 0 && 'bg-[var(--color-bg-primary)]'
                      )}
                    >
                      <td className="sticky left-0 z-10 bg-[var(--color-bg-primary)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                        {item.name}
                      </td>
                      <FeatureCell value={item.desktop} />
                      <FeatureCell value={item.hub} />
                      <FeatureCell value={item.marketplace} />
                      <FeatureCell value={item.registry} />
                      <FeatureCell value={item.community} />
                      <FeatureCell value={item.cloud} />
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <Check className="h-4 w-4 text-[var(--color-success)]" /> Available
          </span>
          <span className="flex items-center gap-1">
            <X className="h-4 w-4 text-[var(--color-text-muted)]" /> Not applicable
          </span>
          <span className="flex items-center gap-1">
            <Minus className="h-4 w-4 text-[var(--color-text-muted)]" /> Planned
          </span>
        </div>
      </div>
    </section>
  );
}
