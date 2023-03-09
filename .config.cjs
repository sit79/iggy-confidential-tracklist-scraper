require("dotenv").config({
    path : "/Users/stefan.tolksdorf/Dev/other/iggy-confidential-tracklist-scraper/.env",
    debug : process.env.DEBUG
});

const FILEPATH = process.env.FILEPATH;
const SCRAPE_URL = process.env.SCRAPE_URL;

export { FILEPATH, SCRAPE_URL };
