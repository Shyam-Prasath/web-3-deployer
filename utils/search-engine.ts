import { getUserWebpages, getWebpageContent } from "./db/actions";

interface IndexedWebsite {
  domain: string;
  url: string;
  content: string;
}

let indexedWebsites: IndexedWebsite[] = [];

export async function indexWebsites() {
  const webpages = await getUserWebpages(null); // Pass null to get all webpages
  indexedWebsites = await Promise.all(
    webpages.map(async (webpage) => {
      const content = await getWebpageContent(webpage.webpages.id);
      return {
        domain: webpage.webpages.domain,
        url: webpage.webpages.name
          ? `https://dweb.link/ipfs/${webpage.webpages.cid}`
          : webpage.deployments?.deploymentUrl || "",
        content: content,
      };
    })
  );
}

export async function searchWebsites(query: string): Promise<IndexedWebsite[]> {
  const normalizedQuery = query.toLowerCase();
  return indexedWebsites.filter((website) => {
    return (
      website.domain.toLowerCase().includes(normalizedQuery) ||
      website.content.toLowerCase().includes(normalizedQuery)
    );
  });
}
