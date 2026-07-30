import Link from "next/link";
import { Github, Twitter, MessageCircle, Rss } from "lucide-react";
import { footerSections, socialLinks } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="container-app py-16 lg:py-24">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="AI Context Studio Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[var(--color-text-primary)]">AI Context Studio</span>
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-xs">
              Local-first AI prompt engineering studio. Build, customize, and export AI instruction assets for any coding assistant.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition-colors"
                  aria-label={social.label}
                >
                  {social.component === "Github" && <Github className="h-5 w-5" />}
                  {social.component === "Twitter" && <Twitter className="h-5 w-5" />}
                  {social.component === "MessageCircle" && <MessageCircle className="h-5 w-5" />}
                  {social.component === "Rss" && <Rss className="h-5 w-5" />}
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} AI Context Studio. MIT Licensed.
          </p>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--color-text-primary)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-text-primary)] transition-colors">
              Terms
            </Link>
            <Link href="/license" className="hover:text-[var(--color-text-primary)] transition-colors">
              License
            </Link>
            <Link href="/security" className="hover:text-[var(--color-text-primary)] transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}