const CronJob = require("cron").CronJob;
const browserObject = require("./browser");
const scraperController = require("./pageController");

const job = new CronJob({
  cronTime: process.env.CRONTIME,
  onTick: async function () {
    console.clear();
    // start the browser and create a browser instance
    let browserInstance = await browserObject.startBrowser();
    // pass the browser instance to the scraper controller
    await scraperController(browserInstance);
  },
  start: true,
  runOnInit: false,
});

job.start();
