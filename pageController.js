import pageScraper from "./pageScraper.js";
import removeReadMore from "./helper.js";
import * as fs from "fs";
import * as ora from "ora";

async function scrapeAll(browserInstance) {
  let browser;

  try {
    browser = await browserInstance;
    let scrapedData = await pageScraper.scraper(browser);
    await browser.close();
    let spinner = ora();

    for (let entry of scrapedData) {
      spinner.start();
      if (entry.alreadyScraped) {
        spinner.succeed(`\"${entry.showTitle}\"`).stop()
      } else {
        // save each show with proper title and the collected result as txt file
        let showResult = `${entry.showTitle}\n`;
        showResult += `${entry.releaseDate}\n`;
        showResult += `${removeReadMore(entry.synopsis)}\n\n`;
        showResult += `yt-dlp ${entry.showLink}\n\n`;
        for (let i = 0, k = entry.artists.length; i < k; i++) {
          const artistAndTack = `${i + 1}. ${entry.artists[i]} – ${
              entry.trackTitles[i]
          } \n`;
          showResult += artistAndTack;
        }
        fs.writeFileSync(`${entry.path}.txt`, showResult, {encoding: "utf-8" });
        spinner.warn(`\"${entry.showTitle}\" ready to be fetched.`).stop();
      }
    }
  } catch (error) {
    console.error("Could not resolve the browser instance => ", error);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
