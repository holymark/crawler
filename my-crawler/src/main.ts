import { RequestQueue } from "crawlee";
import $PlaywrightCrawler from "./crawlers/PlaywrightCrawler.js";
import $CheerioCrawler from "./crawlers/CheerioCrawler.js";

// queue instance
const requestQ = await RequestQueue.open();

// adding to queue
await requestQ.addRequest({ url: "https://nextjs.org" });

const links = ["https://chat.openai.com/", "https://crawlee.dev/"];

const Crawlers = {
  // PlaywrightCrawler Implementation
  $PlaywrightCrawler: $PlaywrightCrawler, //().then((pc) => pc.run(links)),

  // CheerioCrawler Implementaion
  $CheerioCrawler: $CheerioCrawler, //(requestQ).then((cc) => cc.run()),
};

Crawlers.$CheerioCrawler(requestQ).then((cc) => cc.run());
