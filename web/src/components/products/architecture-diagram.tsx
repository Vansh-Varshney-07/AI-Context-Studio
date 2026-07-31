'use client';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { Monitor, Globe, Store, Database, Users, Cloud, Cpu, HardDrive, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const products = [
  {
    id: 'desktop',
    name: 'Desktop App',
    icon: Monitor,
    color: 'bg-blue-500',
    description: 'Native Tauri app for local-first AI asset creation',
    features: [
      'System prompts',
      'Instruction files',
      'Memories',
      'MCP config',
      'Workflows',
      'Export anywhere',
    ],
  },
  {
    id: 'hub',
    name: 'Online Hub',
    icon: Globe,
    color: 'bg-purple-500',
    comingSoon: true,
    description: 'Cloud sync, team workspaces, shared collections',
    features: [
      'Cross-device sync',
      'Team workspaces',
      'Shared collections',
      'Version history',
      'Access controls',
    ],
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: Store,
    color: 'bg-green-500',
    description: 'Community catalog of skills, personas, templates, prompts',
    features: ['Skills', 'Personas', 'Templates', 'Prompt packs', 'Workflows', 'MCP servers'],
  },
  {
    id: 'registry',
    name: 'Registry',
    icon: Database,
    color: 'bg-orange-500',
    description: 'Open spec for packaging, versioning, dependencies',
    features: [
      'Manifest schema',
      'Semantic versioning',
      'Dependency graph',
      'Compatibility matrix',
      'Checksums',
    ],
  },
  {
    id: 'community',
    name: 'Community',
    icon: Users,
    color: 'bg-pink-500',
    description: 'Contributors, creators, and users building together',
    features: ['Contributors', 'Creators', 'Discussions', 'Showcases', 'Events', 'Governance'],
  },
  {
    id: 'cloud',
    name: 'Future Cloud',
    icon: Cloud,
    color: 'bg-indigo-500',
    comingSoon: true,
    description: 'Managed hosting, SSO, audit logs, compliance',
    features: ['Managed hosting', 'SSO/SAML', 'Audit logs', 'Compliance', 'SLA', 'Support'],
  },
];

export function ArchitectureDiagram() {
  return (
    <section
      id="architecture"
      className="section bg-[var(--color-bg-secondary)]"
      aria-labelledby="architecture-heading"
    >
      <div className="container-app">
        <ScrollReveal className="mb-16 text-center">
          <h2
            id="architecture-heading"
            className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
          >
            How It All Connects
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-text-secondary)]">
            Each product serves a distinct purpose but communicates through open protocols. No
            vendor lock-in — every component can be used independently.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product, _index) => (
            <ScrollReveal key={product.id}>
              <div
                className={cn(
                  'card group relative flex h-full flex-col p-6',
                  'border-2 transition-colors duration-300',
                  'hover:border-[var(--color-accent)] hover:shadow-xl'
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      product.color
                    )}
                  >
                    <product.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    {product.name}
                  </h3>
                  {product.comingSoon && (
                    <span className="rounded-full bg-[var(--color-warning-bg)] px-2 py-0.5 text-xs text-[var(--color-warning)]">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="mb-4 text-sm text-[var(--color-text-muted)]">{product.description}</p>
                <ul className="mb-6 flex-1 space-y-1.5">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Cpu,
              title: 'Local-First Processing',
              desc: 'All AI operations run on your machine. No data sent to cloud unless you explicitly configure it.',
            },
            {
              icon: HardDrive,
              title: 'Open Protocols',
              desc: 'Marketplace, Registry, and Hub communicate via open standards. Swap any component.',
            },
            {
              icon: Lock,
              title: 'You Own Your Data',
              desc: 'Assets stored locally as .acs packages. Export to any format. No proprietary lock-in.',
            },
          ].map((item, _index) => (
            <ScrollReveal key={item.title}>
              <div className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
                  {item.title}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
