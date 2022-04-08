const scraperObject = {
        //url: 'https://www.continental.com/en/press/press-releases/',
	url: 'http://books.toscrape.com',	

	async scraper(browser){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		// Navigate to the selected page
		await page.goto(this.url);
		
		let scrapedData = []; // where data will be stored
		let max = 2 // max pages to be scrapped (at pagination level)
		
		// Wait for the required DOM to be rendered
		async function scrapeCurrentPage(){
			await page.waitForSelector('.page_inner');
			
			// Get the links/urls 
			let urls = await page.$$eval('section ol > li', links => {
				// Make sure the book to be scraped is in stock
				links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
				// Extract the links from the data
				links = links.map(el => el.querySelector('h3 > a').href)
				return links;
			});
			
			console.log(urls) // debugging mode info | in this case is showing data/urls extracted
			scrapedData.push(urls) // saving managed data 
			
			/*********************** Check for pagination **************************/
			let nextButtonExist = false;
			console.log(max)
			try{
				const nextButton = await page.$eval('.next > a', a => a.textContent);
				nextButtonExist = true;
			}
			catch(err){
				nextButtonExist = false;
			}
			if(nextButtonExist && max > 0){
				max-- 
				await page.click('.next > a');	
				return scrapeCurrentPage(); // Call this function recursively
			}
			await page.close();
			/***********************************************************************/

			return {'info':'number of pages crawled, data length, etc ...'} 
			
		}

		let data = await scrapeCurrentPage();
		// console.log("TRACE 27: ", data, "ScrapedData: ", scrapedData)
		return {"metadata": data, "content": scrapedData};
	}
}

module.exports = scraperObject;
