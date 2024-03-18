# scrapy crawl collectFrom_observador -o ../../Data/observador_2024_3_18.json 
# replace date in filename with current

import scrapy

class ObservadorNewsCollector(scrapy.Spider):

	name = "collectFrom_observador"
	start_urls = ["https://observador.pt/ultimas/page/1/"] # url
	custom_settings = {
		'ROBOTSTXT_OBEY': False,
  		'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
	}

	# constants
	NEWSPERPAGE = 10
	PAGESTOREAD = 1

	currentPage = 1
	def parse(self, response):
		print(response)
		print( f"current page: {self.currentPage}")

		news = response.xpath("//div[@class='mod mod-posttype-post   ']")
		print(f"news: {news}")

		news_link = [link.strip() for link in news.xpath("//a[@class='obs-accent-color']/@href").getall()]
		news_title = [title.strip() for title in news.xpath("//a[@class='obs-accent-color']/text()").getall()]
		news_date = [date.strip() for date in news.xpath("//time[@class='timeago']/text()").getall()]
		news_img = [img.strip() for img in news.xpath("//img[@class='img_16x9']/@src").getall()]
		
		yield {f"data": {"news_title": news_title, "news_date": news_date, "news_link": news_link, "news_img": news_img}}
			
		# go to next page
		if(self.currentPage >= self.PAGESTOREAD):
			print("All News Extracted!")
			return

		else:
			self.currentPage += 1
			next_page = f"https://observador.pt/ultimas/page/{self.currentPage}/" # (next)
			print(next_page)
			yield response.follow(next_page, callback=self.parse)

