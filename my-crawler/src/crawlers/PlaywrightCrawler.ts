import { PlaywrightCrawler, PlaywrightCrawlerOptions } from "crawlee";

type reqHandler = PlaywrightCrawlerOptions["requestHandler"];

const CrawlerOptions: PlaywrightCrawlerOptions = {
  maxRequestsPerCrawl: 10,
};

const Handler: reqHandler = async ({
  page,
  request,
  log,
  pushData,
  enqueueLinks,
}) => {
  const title = await page.title();
  const { loadedUrl } = request;
  log.info(`Page Title of ${loadedUrl}:=> ${title}`);

  await pushData({ PageTitle: title, url: loadedUrl });

  // extract and enque links
  await enqueueLinks();
};

async function $PlaywrightCrawler() :Promise<PlaywrightCrawler>{
  const Crawler = new PlaywrightCrawler({
    requestHandler: Handler,
    maxRequestsPerCrawl: CrawlerOptions.maxRequestsPerCrawl,
  });

  return Crawler;
}

export default $PlaywrightCrawler;
