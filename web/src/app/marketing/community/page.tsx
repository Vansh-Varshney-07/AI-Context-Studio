import { type Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";
import { communityStats, featuredCreators, recentContributors } from "@/data/community";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/sections/cta";
import { Users, Star, Code, MessageCircle, Heart, Github, Twitter, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = generateMetadata({
  title: "Community",
  description: "Join 247+ contributors shaping the future of AI tooling. Explore featured creators, recent contributors, and learn how to contribute to AI Context Studio.",
});

export function CommunityPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 flex flex-col">
        <section className="section bg-[var(--color-bg-secondary)]" aria-labelledby="community-heading">
          <div className="container-app">
            <div className="text-center mb-16 animate-slide-up">
              <h2 id="community-heading" className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
                Community — Built Together
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
                Open source thrives on collaboration. Join developers worldwide building the future of AI prompt engineering.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Badge variant="accent"><Users className="h-3 w-3 mr-1" /> 247+ Contributors</Badge>
                <Badge variant="violet"><Star className="h-3 w-3 mr-1" /> 4.2K Stars</Badge>
                <Badge variant="cyan"><Code className="h-3 w-3 mr-1" /> 3.4K+ Commits</Badge>
                <Badge variant="success"><MessageCircle className="h-3 w-3 mr-1" /> Active Discord</Badge>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {communityStats.map((stat, index) => (
                <div key={stat.label} className="text-center p-6 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <div className="text-4xl lg:text-5xl font-bold text-[var(--color-accent)] mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-[var(--color-text-primary)]">{stat.label}</div>
                  <div className="text-sm text-[var(--color-text-muted)] mt-1">{stat.description}</div>
                </div>
              ))}
            </div>

            <div className="mb-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Featured Creators</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredCreators.map((creator, index) => (
                  <Card key={creator.name} className="card-hover p-6 flex flex-col animate-slide-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] text-2xl font-bold">
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--color-text-primary)]">{creator.name}</h4>
                        <p className="text-sm text-[var(--color-text-muted)]">{creator.bio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-4">
                      <span className="flex items-center gap-1"><Code className="h-4 w-4" /> {creator.assets} Assets</span>
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-current text-[var(--color-warning)]" /> {creator.stars} Stars</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <a href={creator.github} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm font-medium text-[var(--color-accent)] hover:underline flex items-center justify-center gap-1">
                        <Github className="h-4 w-4" /> GitHub
                      </a>
                      <a href={creator.twitter} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center gap-1">
                        <Twitter className="h-4 w-4" /> Twitter
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Recent Contributors</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {recentContributors.map((contributor, index) => (
                  <div key={contributor.username} className="p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl animate-slide-up" style={{ animationDelay: `${0.6 + index * 0.05}s` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-violet-light)] text-[var(--color-violet)] text-lg font-bold">
                        {contributor.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)]">{contributor.username}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{contributor.role} · {contributor.contributions} contributions</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 animate-slide-up" style={{ animationDelay: "0.8s" }}>
              <Card className="card-hover p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-light)] text-[var(--color-accent)] mx-auto mb-4">
                  <Github className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Contribute on GitHub</h4>
                <p className="text-[var(--color-text-secondary)] mb-6">Found a bug? Have a feature request? Want to improve documentation? All contributions welcome.</p>
                <a href="https://github.com/ai-context-studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <Button size="lg">View Contributing Guide</Button>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Card>
              <Card className="card-hover p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-violet-light)] text-[var(--color-violet)] mx-auto mb-4">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Join the Discussion</h4>
                <p className="text-[var(--color-text-secondary)] mb-6">Connect with other developers, share your assets, get help, and shape the roadmap.</p>
                <a href="https://discord.gg/ai-context-studio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <Button size="lg" variant="outline">Join Discord</Button>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Card>
            </div>
          </div>
        </section>
        <CTA />
      </section>
      <Footer />
    </main>
  );
}

export default CommunityPage;