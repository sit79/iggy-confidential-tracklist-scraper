const browserObject = require("./browser");
const scraperController = require("./pageController");

console.clear();
// start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();
// pass the browser instance to the scraper controller
scraperController(browserInstance);
