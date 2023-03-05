#!/usr/bin/env node
import { browserObject } from "./browser.js";
import { scraperController } from "./pageController.js";

import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
console.log(process.env)

// start the browser and create a browser instance
// let browserInstance = browserObject.startBrowser();
// pass the browser instance to the scraper controller
// scraperController(browserInstance);
