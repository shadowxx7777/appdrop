export type AppRelease = {
  tagName: string;
  version: string;
  downloadUrl: string;
  downloadCount: number;
  publishedAt: string | null;
  releaseUrl: string;
  notes: string;
};

type GitHubReleaseAsset = {
  name: string;
  browser_download_url: string;
  download_count: number;
  state?: string;
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  assets: GitHubReleaseAsset[];
};

const RELEASES_API_URL = "https://api.github.com/repos/shadowxx7777/appdrop/releases?per_page=100";
const CACHE_TTL_MS = 60_000;
let releasesCache: { expiresAt: number; promise: Promise<GitHubRelease[]> } | null = null;

async function listPublicReleases(): Promise<GitHubRelease[]> {
  if (releasesCache && releasesCache.expiresAt > Date.now()) {
    return releasesCache.promise;
  }

  const promise = fetch(RELEASES_API_URL, {
    headers: { Accept: "application/vnd.github+json" },
  }).then(async (response) => {
    if (!response.ok) throw new Error(`GitHub Releases API returned ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected GitHub Releases response");
    return data as GitHubRelease[];
  });

  const cacheEntry = { expiresAt: Date.now() + CACHE_TTL_MS, promise };
  releasesCache = cacheEntry;
  void promise.catch(() => {
    if (releasesCache === cacheEntry) releasesCache = null;
  });
  return promise;
}

export async function getLatestAppRelease(
  tagPrefix: string,
  assetName: string,
): Promise<AppRelease | null> {
  const releases = await listPublicReleases();
  const newestFirst = releases
    .filter((release) =>
      !release.draft &&
      !release.prerelease &&
      release.tag_name.startsWith(tagPrefix),
    )
    .sort((left, right) => {
      const leftDate = Date.parse(left.published_at ?? left.created_at) || 0;
      const rightDate = Date.parse(right.published_at ?? right.created_at) || 0;
      return rightDate - leftDate;
    });

  for (const release of newestFirst) {
    const asset = release.assets.find(
      (candidate) =>
        candidate.state !== "starter" &&
        candidate.name.toLowerCase() === assetName.toLowerCase(),
    );
    if (!asset) continue;

    const version = release.tag_name.slice(tagPrefix.length) || release.name || "—";
    return {
      tagName: release.tag_name,
      version,
      downloadUrl: asset.browser_download_url,
      downloadCount: Math.max(0, Number(asset.download_count) || 0),
      publishedAt: release.published_at,
      releaseUrl: release.html_url,
      notes: release.body ?? "",
    };
  }

  return null;
}

export function formatDownloadCount(count: number): string {
  return new Intl.NumberFormat("ar").format(count);
}

export function formatReleaseDate(value: string | null): string {
  if (!value) return "غير محدد";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "غير محدد";
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
