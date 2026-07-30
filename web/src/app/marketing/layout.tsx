import { Header, Footer } from "@/components/layout";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="flex-1 flex flex-col">
        {children}
      </section>
      <Footer />
    </main>
  );
}