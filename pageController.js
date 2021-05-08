const pageScraper = require("./pageScraper");
const fs = require("fs");
const ora = require("ora");
const { removeReadMore, cleanShowTitle } = require("./helper");
require("dotenv").config({ path: "/Users/sit/Documents/Dev/i-scraper/.env", debug: process.env.DEBUG });

async function scrapeAll(browserInstance) {
  let browser;

  try {
    browser = await browserInstance;
    let scrapedData = await pageScraper.scraper(browser);
    await browser.close();

    let spinner = ora("saving files").start();

    for (let entry of scrapedData) {
      if (!entry.alreadyScraped) {
        // save each show with proper title and the collected result as txt file
        let showResult = `${cleanShowTitle(entry.showTitle)}\n`;
        showResult += `${entry.releaseDate}\n`;
        showResult += `${removeReadMore(entry.synopsis)}\n\n`;
        showResult += `youtube-dl ${entry.showLink}\n\n`;
        for (let i = 0, k = entry.artists.length; i < k; i++) {
          const artistAndTack = `${i + 1}. ${entry.artists[i]} – ${
            entry.trackTitles[i]
          } \n`;
          showResult += artistAndTack;
        }
        fs.writeFileSync(`${entry.path}.txt`, showResult, "utf-8", (err) => {
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
