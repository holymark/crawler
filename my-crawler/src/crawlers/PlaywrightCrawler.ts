import { PlaywrightCrawler, PlaywrightCrawlerOptions, Dataset } from "crawlee";
import {router} from "./routes";

type reqHandler = PlaywrightCrawlerOptions["requestHandler"];

const CrawlerOptions: PlaywrightCrawlerOptions = {
  maxRequestsPerCrawl: 50,
};


async function $PlaywrightCrawler(
  maxRequestsPerCrawl?: number
): Promise<PlaywrightCrawler> {
  const Crawler = new PlaywrightCrawler({
    requestHandler: router,
    maxRequestsPerCrawl:
      CrawlerOptions.maxRequestsPerCrawl || maxRequestsPerCrawl,
  });

  return Crawler;
}

export default $PlaywrightCrawler;
