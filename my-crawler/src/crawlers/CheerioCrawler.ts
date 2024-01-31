import { RequestQueue, CheerioCrawler } from "crawlee";

async function $CheerioCrawler(
  requestQ: RequestQueue,
  maxRequestsPerCrawl?: number
): Promise<CheerioCrawler> {
  const crawler = new CheerioCrawler({
    maxRequestsPerCrawl,
    requestQueue: requestQ,

    async requestHandler({ $, request, enqueueLinks }) {
      const title = $("title").text();
      const { loadedUrl } = request;
      console.log(`Page title of ${loadedUrl}:=> ${title}`);

      await enqueueLinks({
        strategy: "same-domain",
        globs: ["http?(s)://apify.com/*/*"],
        transformRequestFunction(req) {
          if (req.url.endsWith(".pdf")) return false;
          return req;
        },
      });
    },
  });

  return crawler;
}

export default $CheerioCrawler;
