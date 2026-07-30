import { type Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { RoadmapClient } from "@/components/sections/roadmap-client";

export const metadata: Metadata = generateMetadata({
  title: "Roadmap",
  description: "Track AI Context Studio's development roadmap. View completed features, in-progress work, planned improvements, and future vision. Filter by status and category.",
});

export default function RoadmapPage() {
  return <RoadmapClient />;
}