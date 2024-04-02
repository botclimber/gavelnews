# scrapy crawl collectFrom_visao -o ../../Data/visao_2024-04-2.json 
# replace date in filename with current

# !IMPORTANT : observador adds empty spaces on purpose to prevent scrapying

import scrapy
import uuid
from collections import OrderedDict

import random

# TODO: find a way of also getting this from the common/utils folder
# used for test purposes
def randomVeracityValue():
    return random.randint(1, 250)

PAGES_TO_READ = 1

class VisaoNewsCollector(scrapy.Spider):

	name = "collectFrom_visao"
	start_urls = ["https://visao.pt/ultimas/?page=1"] # url
	custom_settings = {
		'ROBOTSTXT_OBEY': False,
  		'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
	}

	# constants
	PAGESTOREAD = PAGES_TO_READ # this must be in sync with common/utils
	NEWS_PER_PAGE = 21

	currentPage = 1
	def parse(self, response):
		news = response.xpath("//div[@class='row item-list ']")

		news_link = [link.strip() for link in news.xpath(".//a[@class='article-block-title']/@href").getall()]
		news_title = list( filter(lambda x: x != "" , [title.strip() for title in news.xpath(".//a[@class='article-block-title']/h4/span/text()").getall()])) # remove empty titles
		news_desc = list( filter(lambda x: x != "" , [title.strip() for title in news.xpath(".//p[@class='article-block-excerpt']/text()").getall()]))
		#news_date = [date.strip() for date in news.xpath(".//time[@class='timeago']/text()").getall()]
		news_img = [img.strip() for img in news.xpath(".//div[@class='article-block-media ']/a/img/@data-src").getall()]
		news_type = [img.strip() for img in news.xpath(".//div[@class='article-block-section']/a/text()").getall()]        
        
		data = []
		for x in range(len(news_title)):
			data.append({"new_id":str(uuid.uuid4()), "new_link": news_link[x], "new_title": news_title[x], "new_desc": news_desc[x], "new_type": news_type[x], "new_date": "", "new_img": news_img[x], "new_source": "visao", "new_isTrue": randomVeracityValue(), "new_isFalse": randomVeracityValue(), "new_isUnclear": randomVeracityValue(), "new_noOpinion": randomVeracityValue(), "new_votedIps": []})
		
		yield {"data": data}
			
		# go to next page
		if(self.currentPage >= self.PAGESTOREAD):
			print("All News Extracted!")
			return

		else:
			self.currentPage += 1
			next_page = f"https://visao.pt/ultimas/?page={self.currentPage}" # (next)
			print(next_page)
			yield response.follow(next_page, callback=self.parse)

