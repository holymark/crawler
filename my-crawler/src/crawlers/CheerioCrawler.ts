import { RequestQueue, CheerioCrawler } from "crawlee";

async function $CheerioCrawler(
  requestQ: RequestQueue
): Promise<CheerioCrawler> {
  const crawler = new CheerioCrawler({
    requestQueue: requestQ,
    async requestHandler({ $, request }) {
      const title = $("title").text();
      const { loadedUrl } = request;
      console.log(`Page title of ${loadedUrl}:=> ${title}`);
    },
  });

  return crawler;
}

export default $CheerioCrawler;
