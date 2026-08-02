import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "License",
  description: "AI Context Studio License. MIT License for the core platform and open source components.",
});

const currentYear = new Date().getFullYear();

export default function LicensePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 container-app py-16 px-4">
        <article className="max-w-3xl space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">License</h1>
            <p className="text-[var(--color-text-secondary)] text-lg">
              AI Context Studio is open source software licensed under the MIT License.
            </p>
          </header>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">MIT License</h2>
            <pre className="bg-[var(--color-bg-tertiary)] rounded-lg p-6 overflow-x-auto text-sm font-mono leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-wrap">{`Copyright (c) ${currentYear} AI Context Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}</pre>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">What This Means</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">✓ Permitted</h3>
                <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                  <li>Commercial use</li>
                  <li>Modification</li>
                  <li>Distribution</li>
                  <li>Private use</li>
                  <li>Sublicensing</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">✗ Not Permitted</h3>
                <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                  <li>Hold liable</li>
                  <li>Trademark use (without permission)</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <h3 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">! Required</h3>
                <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                  <li>Include copyright notice</li>
                  <li>Include license notice</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Third-Party Licenses</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              AI Context Studio incorporates the following open source dependencies. Each retains its own license.
            </p>
            <div className="space-y-4">
              {[
                { name: "Next.js", license: "MIT", url: "https://github.com/vercel/next.js/blob/canary/LICENSE" },
                { name: "React", license: "MIT", url: "https://github.com/facebook/react/blob/main/LICENSE" },
                { name: "Tailwind CSS", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE" },
                { name: "Prisma", license: "Apache-2.0", url: "https://github.com/prisma/prisma/blob/main/LICENSE" },
                { name: "Better Auth", license: "MIT", url: "https://github.com/better-auth/better-auth/blob/main/LICENSE" },
                { name: "Zod", license: "MIT", url: "https://github.com/colinhacks/zod/blob/master/LICENSE" },
                { name: "Lucide React", license: "ISC", url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE" },
                { name: "Radix UI", license: "MIT", url: "https://github.com/radix-ui/primitives/blob/main/LICENSE" },
                { name: "Class Variance Authority", license: "MIT", url: "https://github.com/joe-bell/cva/blob/main/LICENSE" },
                { name: "clsx", license: "MIT", url: "https://github.com/lukeed/clsx/blob/main/LICENSE" },
                { name: "Framer Motion", license: "MIT", url: "https://github.com/framer/motion/blob/main/LICENSE" },
                { name: "Date-fns", license: "MIT", url: "https://github.com/date-fns/date-fns/blob/main/LICENSE" },
              ].map((dep, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  <a href={dep.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]">
                    {dep.name}
                  </a>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
                    {dep.license}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Marketplace Assets</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Community-contributed assets in the marketplace are licensed by their respective authors.
              The default license for new submissions is MIT, but authors may choose other licenses.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Always check the asset's license field before use. We do not warrant the licensing status
              of third-party submissions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Trademarks</h2>
            <p className="text-[var(--color-text-secondary)]">
              "AI Context Studio" and the logo are trademarks. The MIT license does not grant permission
              to use these marks. Contact <a href="mailto:legal@aicontext.studio" className="text-[var(--color-accent)] hover:underline">legal@aicontext.studio</a> for trademark usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Source Code</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">
              Full source code available at:
            </p>
            <p className="text-[var(--color-text-secondary)]">
              <a href="https://github.com/Vansh-Varshney-07/AI-Context-Studio" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline font-mono">
                github.com/Vansh-Varshney-07/AI-Context-Studio
              </a>
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </main>
  );
}