const ora = require("ora");

const scraperObject = {
  url: "https://www.bbc.co.uk/sounds/brand/b03yblbx",
  async scraper(browser) {
    let page = await browser.newPage();
    let spinner = ora(`navigating to ${this.url}`).start();
    // replaced by spinner
    // console.log(`navigating to ${this.url}`) ;

    // navigate to the url
    await page.goto(this.url);

    // wait for required DOM to be rendered
    await page.waitForSelector(".sc-c-list__items");
    spinner.succeed();

    // getting all desired urls
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
        await console.log("HERE");
        dataObj["title"] = await newPage.title();
        dataObj["tracks"] = await newPage.evaluate(() => {
          let collection = document.querySelectorAll(
            ".sc-c-basic-tile__artist"
          );
          return collection.length;
        });
        /* dataObj["text"] = await newPage.$$eval(
          "p.sc-c-basic-tile__artist",
          (text) => text.innerText
        ); */

        if (dataObj) {
          resolve(dataObj);
        } else {
          reject("Failed");
        }
        await newPage.close();
      });

    let result = [];
    // result.push(await pagePromise(urls[0]));

    for (let link in urls) {
      let currentPageData = await pagePromise(urls[link]);
      result.push(currentPageData);
    }

    await page.close();
    spinner.succeed().stop();

    console.table(result);
  },
};

module.exports = scraperObject;
