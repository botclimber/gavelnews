import scrapy

class JornalNoticiasCollector(scrapy.Spider):

	name = "collectFrom_jornalNoticias"
	start_urls = [] # url
	custom_settings = {
		'ROBOTSTXT_OBEY': False,
	}

    # constants

    # create requirements.txt
    # push branch
		
	def parse(self, response):
        pass

        '''
		productsProcessed = self.bunchOfCurrentProducts + 24
		print( productsProcessed, " products handled! \n")

		products = response.xpath("//div[@class='ct-inner-tile-wrap col-inner-tile-wrap row no-gutters justify-content-center align-content-start']")
		
		prod_names = products.xpath("//a[@class='pwc-tile--description col-tile--description']/text()").getall()[-24:]
		prod_details = products.xpath("//a[@class='pwc-tile--description col-tile--description']/@href").getall()[-24:]
		prod_brands = products.xpath("//p[@class='pwc-tile--brand col-tile--brand']/text()").getall()[-24:]
		prod_prices = products.xpath("//span[@class='ct-price-formatted']/text()").getall()[-24:]
		prod_qtys = products.xpath("//p[@class='pwc-tile--quantity col-tile--quantity']/text()").getall()[-24:]
	
		yield {"bunchOf24Products": {"prod_names": prod_names, "prod_details_link": prod_details, "prod_brands": prod_brands, "prod_prices": prod_prices, "prod_qtys": prod_qtys}}
		
		# go to next page
		self.totalProducts -= 24
		if(self.totalProducts <= 0):
			print("All Products Extracted!")
			return

		else:
			self.bunchOfCurrentProducts += 24
			next_page = f"https://www.continente.pt/mercearia/?start={self.bunchOfCurrentProducts}&srule=FOOD_Mercearia" # (next)
			print(next_page)
			yield response.follow(next_page, callback=self.parse)
        '''