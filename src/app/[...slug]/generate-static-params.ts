import { MODULES_ORDERED } from "@/constants/modules.registry";

export function generateStaticParams() {
  return MODULES_ORDERED.map((module) => ({
    slug: module.id,
  }));
}