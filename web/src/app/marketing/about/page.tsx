import { type Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { generateMetadata } from '@/lib/metadata';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CTA } from '@/components/sections/cta';
import {
  Target,
  Heart,
  Shield,
  Code,
  Users,
  Globe,
  BookOpen,
  Zap,
  Lightbulb,
  Award,
  Rocket,
  GitBranch,
  Star,
  ExternalLink,
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Local-First',
    description:
      'Your data never leaves your machine. No cloud sync, no telemetry, no accounts required. Complete privacy by default.',
    color: 'accent',
  },
  {
    icon: Heart,
    title: 'Open Source',
    description:
      'MIT licensed. Transparent development. Community-driven. Anyone can audit, contribute, or fork the project.',
    color: 'error',
  },
  {
    icon: Shield,
    title: 'Security by Design',
    description:
      'Encrypted credential storage, sandboxed MCP servers, code-signed releases, and regular security audits.',
    color: 'violet',
  },
  {
    icon: Code,
    title: 'Developer Experience',
    description:
      'Built by developers, for developers. Keyboard-first, extensible, scriptable, and integrates with your existing workflow.',
    color: 'cyan',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'No vendor lock-in. Assets are portable across Cursor, Claude Code, Windsurf, VS Code, and future editors.',
    color: 'success',
  },
  {
    icon: Globe,
    title: 'Offline-Capable',
    description:
      'Full functionality without internet. Work on planes, in secure environments, or anywhere without connectivity.',
    color: 'warning',
  },
];

const history = [
  {
    year: '2024',
    title: 'v1.0 Release',
    description: 'Desktop app, marketplace, registry, and docs launch. 12K+ developers onboarded.',
  },
  {
    year: '2023',
    title: 'MCP Support Added',
    description: 'Model Context Protocol integration for database, filesystem, and custom servers.',
  },
  {
    year: '2023',
    title: 'Marketplace Beta',
    description: 'Community asset sharing with 3,400+ skills, personas, templates, and workflows.',
  },
  {
    year: '2022',
    title: 'Core Engine v0.5',
    description: 'Prompt engine, instruction files, personas, and export targets stabilized.',
  },
  {
    year: '2022',
    title: 'Project Started',
    description: 'Initial prototype: local-first prompt management for AI coding assistants.',
  },
];

const team = [
  { name: 'Sarah Chen', role: 'Founder & Core Maintainer', github: 'sarahchen', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'Desktop Platform Lead', github: 'marcusj', avatar: 'MJ' },
  { name: 'Priya Patel', role: 'Marketplace & Registry', github: 'priyapatel', avatar: 'PP' },
  { name: 'Alex Rivera', role: 'Security & Infrastructure', github: 'alexr', avatar: 'AR' },
  { name: 'Jordan Kim', role: 'Developer Experience', github: 'jordankim', avatar: 'JK' },
  { name: 'Taylor Moore', role: 'Community & Docs', github: 'taylorm', avatar: 'TM' },
];

export const metadata: Metadata = generateMetadata({
  title: 'About',
  description:
    "Learn about AI Context Studio's mission, vision, and philosophy. Why local-first, why open source, why AI Context Studio. Meet the team behind the project.",
});

export function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">
        <section className="section" aria-labelledby="about-heading">
          <div className="container-app">
            <div className="animate-slide-up mb-16 text-center">
              <h2
                id="about-heading"
                className="mb-4 text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl"
              >
                About AI Context Studio
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-[var(--color-text-secondary)]">
                We're building the infrastructure layer for AI-assisted development — local-first,
                open source, and designed to work with every coding assistant.
              </p>
            </div>

            <div className="mb-16 grid gap-8 lg:grid-cols-2">
              <Card
                className="card-hover animate-slide-up h-full p-8"
                style={{ animationDelay: '0.1s' }}
              >
                <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[var(--color-text-primary)]">
                  <Target className="h-6 w-6 text-[var(--color-accent)]" />
                  Our Mission
                </h3>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  To give every developer complete control over their AI coding experience — from
                  the prompts that guide the model to the memories that provide context, all running
                  locally on their own machine.
                </p>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  We believe the best AI tools amplify human creativity without compromising
                  privacy, locking you into a platform, or requiring an internet connection.
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  AI Context Studio is the studio where you compose, manage, and export the
                  instruction assets that make AI coding assistants truly useful for your specific
                  workflow.
                </p>
              </Card>

              <Card
                className="card-hover animate-slide-up h-full p-8"
                style={{ animationDelay: '0.2s' }}
              >
                <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[var(--color-text-primary)]">
                  <Lightbulb className="h-6 w-6 text-[var(--color-warning)]" />
                  Our Vision
                </h3>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  A world where developers don't choose between privacy and productivity. Where AI
                  assistance is as portable as your code — moving seamlessly between editors, teams,
                  and projects.
                </p>
                <p className="mb-4 text-[var(--color-text-secondary)]">
                  We envision an ecosystem of interoperable AI assets: skills that work in Cursor,
                  personas that work in Claude Code, workflows that work in Windsurf — all defined
                  once, exported everywhere.
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  The registry specification we're building will become the universal format for AI
                  instruction assets, like npm packages for prompts.
                </p>
              </Card>
            </div>

            <div className="animate-slide-up mb-16" style={{ animationDelay: '0.3s' }}>
              <h3 className="mb-8 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                Our Values
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {values.map((value, index) => (
                  <Card
                    key={value.title}
                    className="card-hover animate-slide-up p-6 text-center"
                    style={{ animationDelay: `${0.3 + index * 0.08}s` }}
                  >
                    <div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-${value.color}-light)] text-[var(--color-${value.color})]`}
                    >
                      <value.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h4 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
                      {value.title}
                    </h4>
                    <p className="text-[var(--color-text-secondary)]">{value.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="animate-slide-up mb-16" style={{ animationDelay: '0.4s' }}>
              <h3 className="mb-8 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                History & Milestones
              </h3>
              <div className="relative mx-auto max-w-2xl">
                <div
                  className="absolute top-0 bottom-0 left-8 w-px bg-[var(--color-border)]"
                  aria-hidden="true"
                />
                <div className="space-y-10">
                  {history.map((item, index) => (
                    <div key={item.year} className="relative flex">
                      <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg-primary)]">
                        <span className="font-mono text-sm font-bold text-[var(--color-accent)]">
                          {item.year}
                        </span>
                      </div>
                      <div className="ml-6 flex-1 pt-2">
                        <h4 className="text-xl font-semibold text-[var(--color-text-primary)]">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-[var(--color-text-secondary)]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-slide-up mb-16" style={{ animationDelay: '0.5s' }}>
              <h3 className="mb-8 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                The Team
              </h3>
              <p className="mx-auto mb-10 max-w-2xl text-center text-[var(--color-text-secondary)]">
                A distributed team of developers passionate about developer tools, AI, and open
                source. We build in public and welcome contributors.
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {team.map((member, index) => (
                  <Card
                    key={member.name}
                    className="card-hover animate-slide-up p-6 text-center"
                    style={{ animationDelay: `${0.5 + index * 0.08}s` }}
                  >
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-2xl font-bold text-[var(--color-accent)]">
                      {member.avatar}
                    </div>
                    <h4 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      {member.name}
                    </h4>
                    <p className="mb-3 text-[var(--color-text-secondary)]">{member.role}</p>
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline"
                    >
                      <GitBranch className="h-4 w-4" />@{member.github}
                    </a>
                  </Card>
                ))}
              </div>
            </div>

            <div className="animate-slide-up text-center" style={{ animationDelay: '0.6s' }}>
              <h3 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">Join Us</h3>
              <p className="mx-auto mb-6 max-w-xl text-[var(--color-text-secondary)]">
                Whether you're a developer, designer, writer, or just enthusiastic about AI tooling
                — there's a place for you in the community.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="https://github.com/ai-context-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Button size="lg">Contribute on GitHub</Button>
                  <ExternalLink className="h-5 w-5" />
                </a>
                <a
                  href="https://discord.gg/ai-context-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Button size="lg" variant="outline">
                    Join Discord
                  </Button>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
        <CTA />
      </section>
      <Footer />
    </main>
  );
}

export default AboutPage;
