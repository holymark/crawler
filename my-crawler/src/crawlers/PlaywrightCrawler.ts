import { PlaywrightCrawler, PlaywrightCrawlerOptions } from "crawlee";

type reqHandler = PlaywrightCrawlerOptions["requestHandler"];

const CrawlerOptions: PlaywrightCrawlerOptions = {
  // maxRequestsPerCrawl: 10,
};

const Handler: reqHandler = async ({
  page,
  request,
  log,
  pushData,
  enqueueLinks,
}) => {
  log.info(`Processing:=> ${request.url}`);
  if (request.label === "DETAIL") {
    // do nothing yet
  } else if (request.label === "CATEGORY") {
    await page.waitForSelector(".product-item > a");

    await enqueueLinks({
      selector: ".product-item > a",
      label: "DETAIL", // <= note the different label
    });

    // Now we need to find the "Next" button and enqueue the next page of results (if it exists)
    const $next__button = await page.$("a.pagination__next");
    if ($next__button) {
      await enqueueLinks({
        selector: "a.pagination__next",
        label: "CATEGORY", // <= note the same label
      });
    }
  } else {
    // This means we're on the start page, with no label.
    // On this page, we just want to enqueue all the category pages.

    await page.waitForSelector(".collection-block-item");
    await enqueueLinks({
      selector: ".collection-block-item",
      label: "CATEGORY",
    });
  }
  //   const categoryTexts = page.$$eval(".collection-block-item", (elements) => {
  //     return elements.map((elem) => elem.textContent);
  //   });

  //   (await categoryTexts).forEach((catText, index) => {
  //     log.info(`CATEGORY_${index + 1}: ${catText}`);
  //   });
};

async function $PlaywrightCrawler(
  maxRequestsPerCrawl?: number
): Promise<PlaywrightCrawler> {
  const Crawler = new PlaywrightCrawler({
    requestHandler: Handler,
    maxRequestsPerCrawl:
      CrawlerOptions.maxRequestsPerCrawl || maxRequestsPerCrawl,
  });

  return Crawler;
}

export default $PlaywrightCrawler;
