# scrapy crawl collectFrom_cnnPortugal -o ../../Data/cnnPortugal_2024-03-18.json 
# replace date in filename with current

import scrapy
import uuid

class CnnPortugalNewsCollector(scrapy.Spider):

	name = "collectFrom_cnnPortugal"
	start_urls = ["https://cnnportugal.iol.pt/ultimas?pagina=1"] # url
	custom_settings = {
		'ROBOTSTXT_OBEY': False,
  		'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
	}

	# constants
	NEWSPERPAGE = 15
	PAGESTOREAD = 1

	currentPage = 1
	def parse(self, response):
		print(response)
		print( f"current page: {self.currentPage}")

		news = response.xpath("//div[@class='grid_list']//div[@class='item']")
		print(f"news: {news} | {len(news)}")

		news_link = [link.strip() for link in news.xpath(".//a/@href").getall()[:self.NEWSPERPAGE]]
		news_title = [title.strip() for title in news.xpath(".//h2[@class='item-title']/text()").getall()[:self.NEWSPERPAGE]]
		news_date = [date.strip() for date in news.xpath(".//div[@class='item-date']/text()").getall()[:self.NEWSPERPAGE]]
		news_img = [img.strip() for img in news.xpath(".//div[@class='picture16x9 b-lazy']/@data-src").getall()[:self.NEWSPERPAGE]]

		data = []
		for x in range(len(news_title)):
			print(f"index is {x}")
			data.append({"new_id":str(uuid.uuid4()), "new_link": news_link[x], "new_title": news_title[x], "new_desc": "", "new_date": news_date[x], "new_img": news_img[x], "new_source": "cnnPortugal", "new_isTrue": 0, "new_isFalse": 0, "new_isUnclear": 0, "new_noOpinion": 0, "new_votedIps": []})
		
		yield {"data": data}
			
		# go to next page
		if(self.currentPage >= self.PAGESTOREAD):
			print("All News Extracted!")
			return

		else:
			self.currentPage += 1
			next_page = f"https://cnnportugal.iol.pt/ultimas?pagina={self.currentPage}" # (next)
			print(next_page)
			yield response.follow(next_page, callback=self.parse)

