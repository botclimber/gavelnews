import scrapy
'''
class JornalNoticiasCollector(scrapy.Spider):

	name = "collectFrom_jornalNoticias"
	start_urls = ["https://www.jn.pt/ultimas/p/1/"] # url
	custom_settings = {
		'ROBOTSTXT_OBEY': False,
  		'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
	}

	# constants
	NEWSPERPAGE = 12
	PAGESTOREAD = 1

	currentPage = 1
	def parse(self, response):
		print(response)
		print( f"current page: {self.currentPage}")

		news = response.xpath("//div[@class='sk-wrapper']")
		print(f"news: {news}")

		news_link = news.xpath("//a[@class='clean-link']/@href").getall()
		news_title = news.xpath("//h2[@class='title']/text()").getall()
		news_desc = news.xpath("//p[@class='desc']/text()").getall()
		news_img = news.xpath("//img[@class='embed-responsive-item blur-up lazyloaded']/@src").getall()
		
		yield {f"bunchOf{self.NEWSPERPAGE}News": {"news_title": news_title, "news_desc": news_desc, "news_link": news_link, "news_img": news_img}}
			
		# go to next page
		if(self.currentPage >= self.PAGESTOREAD):
			print("All News Extracted!")
			return

		else:
			self.currentPage += 1
			next_page = f"https://www.jn.pt/ultimas/p/{self.currentPage}/" # (next)
			print(next_page)
			yield response.follow(next_page, callback=self.parse)
'''
