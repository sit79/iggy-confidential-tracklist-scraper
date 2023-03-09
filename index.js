#!/usr/bin/env node

import browserObject from "./browser.js";
import scraperController from "./pageController.js";


// start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();
// pass the browser instance to the scraper controller
scraperController(browserInstance);