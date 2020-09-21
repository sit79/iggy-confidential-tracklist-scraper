const ora = require("ora");

const scraperObject = {
  url: "https://www.bbc.co.uk/sounds/brand/b03yblbx",
  async scraper(browser) {
    let page = await browser.newPage();
    let spinner = ora(`navigating to ${this.url}`).start();
    // console.log(`navigating to ${this.url}`);
    // navigate to the url
    await page.goto(this.url);
    spinner.succeed();
    spinner = ora("retrieving urls").start();
    let urls = await page.$$eval("li > article", (links) => {
      links = links.map((el) => el.querySelector("a").href);
      return links;
    });
    spinner.succeed().stop();
    console.log(urls);
    await page.close();
  },
};

module.exports = scraperObject;
