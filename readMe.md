# Webscraper

Retrieves all titles from Iggy Pop's current playlists on the [BBC](https://www.bbc.co.uk/sounds/brand/b03yblbx). Based
on [Bello Gbadebo's](https://github.com/Gbahdeyboh) tutorial [_How To Scrape a Website Using Node.js and
Puppeteer_](https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer?utm_campaign=how-to-scrape-a-website-using-node-&-pup)
.

### Requirements

Node 8+

### Setup

1. Clone the repository.
2. Run `npm i`
3. Create file .env containing:

    `FILEPATH="<PATH_TO_SAVE_YOUR_SCRAPED_TRACKLISTS>"`

    `SCRAPE_URL="https://www.bbc.co.uk/sounds/brand/b03yblbx"`
4. Create file .config.js containing:

    `require("dotenv").config({ path : "<PATH_TO_YOUR_.ENV_FILE>", debug : process.env.DEBUG });`

    `module.exports = { FILEPATH: process.env.FILEPATH, SCRAPE_URL: process.env.SCRAPE_URL };`

### Running on Ubuntu

In case you're running this on Ubuntu and the puppeteer brower doesn't launch, this might help:

`$ wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb`

`$ sudo apt install ./google-chrome-stable_current_amd64.deb`

Thanks
to [Codegrepper.com](https://www.codegrepper.com/code-examples/shell/error+failed+to+launch+the+browser+process+puppeteer)
.
