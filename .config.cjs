require("dotenv").config({
    path : "/Users/stefan.tolksdorf/Dev/other/iggy-confidential-tracklist-scraper/.env",
    debug : process.env.DEBUG
});

module.exports = { FILEPATH: process.env.FILEPATH, SCRAPE_URL: process.env.SCRAPE_URL };
