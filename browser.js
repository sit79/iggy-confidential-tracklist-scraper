const puppeteer = require("puppeteer");
const ora = require("ora");

async function startBrowser() {
  let browser, spinner;
  try {
    spinner = ora("opening the browser").start();
    // opening the browser
    browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (error) {
    console.error("Could not create a browser instance => : ", error);
  }
  spinner.succeed();
  return browser;
}

module.exports = {
  startBrowser,
};
