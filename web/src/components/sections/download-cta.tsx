import { getGitHubReleases } from "@/actions/github";
import { DownloadCTAClient } from "./download-cta-client";

export async function DownloadCTA() {
  const releases = await getGitHubReleases(5);
  return <DownloadCTAClient initialReleases={releases} />;
}