import { createPlaywrightRouter, Dataset } from "crawlee";

export const router = createPlaywrightRouter();

/*888888888888888888888888888888888888888*/
router.addHandler("DETAIL", async ({ request, page, log }) => {
  log.debug(`Extracting data: ${request.url}`);

  // get the url splitted parts
  const url__part = request.url.split("/").slice(-1); //  ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
  const manufacturer__url__part = url__part[0].split("-")[0]; // ['sennheiser']

  // get product title
  const product__title = await page.locator(".product-meta h1").textContent();

  // get the sku info
  const SKU = await page.locator("span.product-meta__sku-number").textContent();

  // get the price element
  const product__price__element = page.locator("span.price").filter({
    hasText: `$`,
  });

  // get the price info
  const current__price__string = await product__price__element.textContent();
  const raw__price = current__price__string?.split("$")[1];
  const price = Number(raw__price?.replace(",", ""));

  // check if it's in stock

  const in__stock__element = page
    .locator("span.product-form__inventory")
    .filter({
      hasText: `In stock`,
    });

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

  // save the data
  console.log(results);
  log.debug(`Saving data: ${request.url}`);
  await Dataset.pushData(results);
});

/*888888888888888888888888888888888888888*/
router.addHandler("CATEGORY", async ({ page, enqueueLinks, request, log }) => {
  log.debug(`Enqueueing pagination for: ${request.url}`);

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
});

/*888888888888888888888888888888888888888*/
router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
  log.debug(`Enqueueing categories from page: ${request.url}`);

  await page.waitForSelector(".collection-block-item");
  await enqueueLinks({
    selector: ".collection-block-item",
    label: "CATEGORY",
  });
});
