import { RequestQueue, log } from "crawlee";
import $PlaywrightCrawler from "./crawlers/PlaywrightCrawler.js";
import $CheerioCrawler from "./crawlers/CheerioCrawler.js";

log.setLevel(log.LEVELS.DEBUG);
log.debug("Setting up crawler.");

/**
 * we want to get this data from https://warehouse-theme-metal.myshopify.com/collections
 * URL
   Manufacturer
   SKU
   Title
   Current price
   Stock available

   The Crawling Strategy:
    1. Visit the store page containing the list of categories (our start URL).
    2. Enqueue all links to all categories.
    3. Enqueue all product pages from the current page.
    4. Enqueue links to next pages of results.
    5. Open the next page in queue.
       (a). When it's a results list page, go to 2.
       (b). When it's a product page, scrape the data.
    6. Repeat until all results pages and all products have been processed.
 */
// queue instance
// const requestQ = await RequestQueue.open();

// adding to queue
// await requestQ.addRequest({ url: "https://nextjs.org" });

const links = ["https://warehouse-theme-metal.myshopify.com/collections"];

const Crawlers = {
  // PlaywrightCrawler Implementation
  $PlaywrightCrawler: $PlaywrightCrawler, //().then((pc) => pc.run(links)),

  // CheerioCrawler Implementaion
  $CheerioCrawler: $CheerioCrawler, //(requestQ).then((cc) => cc.run()),
};

Crawlers.$PlaywrightCrawler().then((pc) => pc.run(links));
