#!/usr/bin/env node
import { browserObject } from "./browser";
import { scraperController } from "./pageController";

// start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();
// pass the browser instance to the scraper controller
scraperController(browserInstance);
