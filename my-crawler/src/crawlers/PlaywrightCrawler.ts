import { PlaywrightCrawler, PlaywrightCrawlerOptions, Dataset } from "crawlee";

type reqHandler = PlaywrightCrawlerOptions["requestHandler"];

const CrawlerOptions: PlaywrightCrawlerOptions = {
  maxRequestsPerCrawl: 50,
};

const Handler: reqHandler = async ({
  page,
  request,
  log,
  pushData,
  enqueueLinks,
}) => {
  console.log(`Processing:=> ${request.url}`);

  if (request.label === "DETAIL") {
    const url__part = request.url.split("/").slice(-1); //  ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
    const manufacturer__url__part = url__part[0].split("-")[0]; // ['sennheiser']
    const product__title = await page.locator(".product-meta h1").textContent();
    const SKU = await page
      .locator("span.product-meta__sku-number")
      .textContent();
    const product__pric__element = page
      .locator("span.price")
      .filter({
        hasText: "$",
      })
      .first();

    const current__price__string = await product__pric__element.textContent();
    const raw__price = current__price__string?.split("$")[1];
    const price = Number(raw__price?.replace(",", ""));
    const in__stock__element = page
      .locator("span.product-form__inventory")
      .filter({
        hasText: "In Stock",
      })
      .first();
    const in__stock = (await in__stock__element.count()) > 0;

    // Print out results
    const results = {
      URL: request.url,
      TITLE: product__title,
      MANUFACTURER: manufacturer__url__part,
      SKU,
      PRICE: price,
      INSTOCK: in__stock,
    };
    await Dataset.pushData(results);
    console.log(results);
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
