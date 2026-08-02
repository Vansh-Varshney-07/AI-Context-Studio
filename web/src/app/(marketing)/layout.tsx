import { Header, Footer } from '@/components/layout';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 flex-col">{children}</section>
      <Footer />
    </main>
  );
}
