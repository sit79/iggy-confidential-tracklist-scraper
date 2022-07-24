const pageScraper = require("./pageScraper");
const fs = require("fs");
const ora = require("ora");
const { removeReadMore } = require("./helper");

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
        spinner.warn(`Show \"${entry.showTitle}\" has already been scraped and saved.`).stop()
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
        spinner.succeed(`Show \"${entry.showTitle}\" saved.`).stop();
      }
    }
  } catch (error) {
    console.error("Could not resolve the browser instance => ", error);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
