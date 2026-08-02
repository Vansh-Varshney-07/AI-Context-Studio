import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/actions/user";
import { MyAssetsClient } from "@/components/dashboard/my-assets-client";

export const metadata: Metadata = {
  title: "My Assets | AI Context Studio",
  description: "Your generated AI instruction files",
};

export default async function MyAssetsPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login?callbackUrl=/dashboard/my-assets");

  const username = profile.username || profile.name || "User";

  return (
    <div className="container-app py-8 lg:py-12">
      <MyAssetsClient userName={username} />
    </div>
  );
}
