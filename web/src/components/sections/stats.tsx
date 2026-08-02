import { getSiteStats } from "@/actions/stats";
import { StatsClient } from "./stats-client";

export async function StatsSection() {
  const stats = await getSiteStats();

  const statsData = [
    {
      label: "Assets Published",
      value: stats.marketplace.assetCount,
      suffix: "+",
      description: "Skills, personas, templates & more",
      icon: "Package",
    },
    {
      label: "Total Downloads",
      value: stats.marketplace.totalDownloads,
      suffix: "+",
      description: "Cross-platform installations",
      icon: "Download",
    },
    {
      label: "Community Members",
      value: stats.community.userCount,
      suffix: "+",
      description: "Developers worldwide",
      icon: "Users",
    },
    {
      label: "GitHub Stars",
      value: stats.github.stars,
      suffix: "+",
      description: "Open source appreciation",
      icon: "Star",
    },
  ];

  return (
    <section
      id="stats-section"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-16 lg:py-24"
      aria-labelledby="stats-heading"
    >
      <div className="container-app">
        <h2 id="stats-heading" className="sr-only">
          Key Statistics
        </h2>
        <StatsClient initialStats={statsData} />
      </div>
    </section>
  );
}