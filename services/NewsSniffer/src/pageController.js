const bookScraper = require('./scrappers/bookScraper');
const contiScraper = require('./scrappers/contiScraper');
const fs = require('fs');

/*
const scrap = [bookScraper, contiScraper]
as an idea to loop throught all websites and scrap all of them

*/

async function scrapeAll(browserInstance){
	let browser;
	try{
		browser = await browserInstance;
		let scrapedData = {}
		scrapedData = await contiScraper.scraper(browser);	
		await browser.close();
		fs.writeFile("data/data.json", JSON.stringify(scrapedData), 'utf8', function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The data has been scraped and saved successfully! View it at './data/data.json'");
		});
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance)
