const scraperObject = {
  url: "https://www.bbc.co.uk/sounds/brand/b03yblbx",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}…`);
    // Navigate to the selected page
    await page.goto(this.url);
    let urls = await page.$$eval("li > article", (links) => {
      links = links.map((el) => el.querySelector("a").href);
      return links;
    });
    console.log(urls);
    await page.close();
  },
};

module.exports = scraperObject;
