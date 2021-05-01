const ora = require("ora");
const path = require("path");
const fs = require("fs");

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
        dataObj["showTitle"] = await newPage.title();
        // fetch show release date
        dataObj["releaseDate"] = await newPage.$eval(
          ".sc-c-episode__metadata__data",
          (div) => div.textContent
        );
        dataObj["fileName"] = dataObj.releaseDate.split(" ").slice(2).reverse().join("-") + " – " + dataObj.showTitle;

        // check if file already exists
        const pathToShow = "/" + path.join(process.env.FILEPATH, dataObj["fileName"]);
        let fileExists = fs.existsSync(`${pathToShow}.txt`);

        if (!fileExists) {
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
    /* let currentPageData = await pagePromise(urls[0]);
    result.push(currentPageData); */

    // for loop to retrieve data on ALL shows
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
