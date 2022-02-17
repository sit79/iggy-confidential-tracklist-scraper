const ora = require("ora");
const path = require("path");
const fs = require("fs");
const { createDate } = require("./helper");

const scraperObject = {
  url: "https://www.bbc.co.uk/sounds/brand/b03yblbx",
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
    spinner = ora("retrieving individual page data").start();

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
        dataObj["path"] = "/" + path.join(process.env.FILEPATH, dataObj["fileName"]);
        dataObj["published"] = "/" + path.join(process.env.FILEPATH, "published", dataObj["fileName"]);

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
            let artistArray = Array.from(artistNodeCollection).map(
              (item) => item.innerText
            );
            return artistArray;
          });

          // fetch all track titles
          dataObj["trackTitles"] = await newPage.evaluate(() => {
            let titleNodeCollection = document.querySelectorAll(
              ".sc-c-basic-tile__title"
            );
            let titleArray = Array.from(titleNodeCollection).map(
              (item) => item.innerText
            );
            return titleArray;
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

    // scraping info only for ONLY THE MOST RECENT show
/*     let currentPageData = await pagePromise(urls[0]);
    result.push(currentPageData); */

    // for loop to retrieve data on ALL AVAILABLE shows
    for (let link in urls) {
      let currentPageData = await pagePromise(urls[link]);
      result.push(currentPageData);
    }

    await page.close();
    spinner.succeed();

    return result;
  },
};

module.exports = scraperObject;
