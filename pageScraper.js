import ora from 'ora';
import path from 'path';
import fs from 'fs';
import { createDate } from './helper.js';
import { FILEPATH, SCRAPE_URL } from "./.config.cjs";

// const FILEPATH = process.env.FILEPATH;
// const SCRAPE_URL = process.env.SCRAPE_URL;

console.log(SCRAPE_URL);

const scraperObject = {
  url: SCRAPE_URL,
  async scraper(browser) {
    let page = await browser.newPage();
    let spinner = ora(`navigating to ${this.url}`).start();

    // navigate to the url
    await page.goto(this.url);

    // wait for required DOM to be rendered
    await page.waitForSelector(".sc-c-list__items");

    spinner.succeed();
    spinner = ora("retrieving urls").start();

    // page.$$eval returns an array of all matching elements
    let urls = await page.$$eval("li > article", (links) => {
      links = links.map((el) => el.querySelector("a").href);
      return links;
    });

    spinner.succeed();
    spinner = ora("retrieving individual page data \n").start();

    let pagePromise = (link) =>
      new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        const navigationPromise = newPage.waitForNavigation({
          waitUntil: "domcontentloaded",
        });
        await newPage.goto(link);
        await navigationPromise;

        // save link location
        dataObj["showLink"] = link;
        // fetch show title
        dataObj["showTitle"] = await newPage.$eval(
          ".sc-c-marquee__title-1",
          (span) => span.textContent
        );
        // fetch show release date
        dataObj["releaseDate"] = await newPage.$eval(
          ".sc-c-episode__metadata__data",
          (div) => div.textContent
        );
        // create filename & path
        dataObj["fileName"] = createDate(dataObj.releaseDate) + " – " + dataObj.showTitle;
        dataObj["path"] = "/" + path.join(FILEPATH, dataObj["fileName"]);
        dataObj["published"] = "/" + path.join(FILEPATH, "published", dataObj["fileName"]);

          // check if file with that name already exists
        dataObj["alreadyScraped"] = fs.existsSync(`${dataObj["published"]}.txt`) || fs.existsSync(`${dataObj["path"]}.txt`)

        if (!dataObj.alreadyScraped) {
          // fetch short description
          dataObj["synopsis"] = await newPage.$eval(
            ".sc-c-synopsis",
            (div) => div.textContent
          );

          // fetch all artists
          dataObj["artists"] = await newPage.evaluate(() => {
            let artistNodeCollection = document.querySelectorAll(
              ".sc-c-basic-tile__artist"
            );
            return Array.from(artistNodeCollection).map(
                (item) => item.innerText
            );
          });

          // fetch all track titles
          dataObj["trackTitles"] = await newPage.evaluate(() => {
            let titleNodeCollection = document.querySelectorAll(
              ".sc-c-basic-tile__title"
            );
              return Array.from(titleNodeCollection).map(
                (item) => item.innerText
            );
          });
        }

        if (dataObj) {
          resolve(dataObj);
        } else {
          reject("Failed");
        }
        await newPage.close();
      });

    let result = [];

    // for loop to retrieve data on available shows
    for (let link in urls) {
      let currentPageData = await pagePromise(urls[link]);
      result.push(currentPageData);
    }

    await page.close();
    spinner.succeed();

    return result;
  },
};

export default scraperObject;