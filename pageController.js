const pageScraper = require("./pageScraper");
const path = require("path");
const fs = require("fs");
const ora = require("ora");
require("dotenv").config({ path: "/home/sit/Dev/i-scraper/.env", debug: process.env.DEBUG });

async function scrapeAll(browserInstance) {
  let browser;

  try {
    browser = await browserInstance;
    let scrapedData = await pageScraper.scraper(browser);
    await browser.close();

    let spinner = ora("saving files").start();

    for (let entry of scrapedData) {
      // create path to save the file(s) & check if file exists already
      const pathToShow = "/" + path.join(process.env.FILEPATH, entry["fileName"]);
      let fileExists = fs.existsSync(`${pathToShow}.txt`);

      if (!fileExists) {
        // save each show with proper title and the collected result as txt file
        let showResult = `youtube-dl ${entry.showLink} --no-part \n`;
        for (let i = 0, k = entry["artists"].length; i < k; i++) {
          const artistAndTack = `${i + 1}. ${entry["artists"][i]} – ${
            entry["trackTitles"][i]
          } \n`;
          showResult += artistAndTack;
        }
        fs.writeFileSync(`${pathToShow}.txt`, showResult, "utf-8", (err) => {
          if (err) return console.error(err);
        });
      }
    }
    spinner.succeed().stop();
  } catch (error) {
    console.error("Could not resolve the browser instance => ", error);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
