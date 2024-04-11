# scrapy crawl collectFrom_observador -o ../../Data/observador_2024-03-18.json 
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

def get_or_else_index(lst, index, default_value):
    try:
        return lst[index]
    except IndexError:
        return default_value

PAGES_TO_READ = 1

class ObservadorNewsCollector(scrapy.Spider):

	name = "collectFrom_observador"
	start_urls = ["https://observador.pt/ultimas/?se=&d=&t%5B%5D=post"] # url
	custom_settings = {
		'ROBOTSTXT_OBEY': False,
  		'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
	}

	# constants
	PAGESTOREAD = PAGES_TO_READ # this must be in sync with common/utils
	NEWS_PER_PAGE = 10

	currentPage = 1
	def parse(self, response):
		news = response.xpath("//div[@class='results']")

		news_link = [link.strip() for link in news.xpath(".//a[@class='obs-accent-color']/@href").getall()]
		news_title = list( filter(lambda x: x != "" , [title.strip() for title in news.xpath(".//a[@class='obs-accent-color']/text()").getall()])) # remove empty titles
		news_date = [date.strip() for date in news.xpath(".//time[@class='timeago']/text()").getall()]
		news_img = [date.strip() for date in news.xpath(".//img[@class='img_16x9']/@src").getall()]
	  
		data = []
		for x in range(len(news_title)):
			link = get_or_else_index(news_link, x, "")
			title = get_or_else_index(news_title, x, "")
			date = get_or_else_index(news_date, x, "")
			img = get_or_else_index(news_img, x, "")		
   
			data.append({"new_id":str(uuid.uuid4()), "new_link": link, "new_title": title, "new_desc": "", "new_date": date, "new_img": img, "new_source": "observador", "new_isTrue": randomVeracityValue(), "new_isFalse": randomVeracityValue(), "new_isUnclear": randomVeracityValue(), "new_noOpinion": randomVeracityValue(), "new_votedEmails": []})
		
		yield {"data": data}
			
		# go to next page
		if(self.currentPage >= self.PAGESTOREAD):
			print("All News Extracted!")
			return

		else:
			self.currentPage += 1
			next_page = f"https://observador.pt/ultimas/page/{self.currentPage}/" # (next)
			print(next_page)
			yield response.follow(next_page, callback=self.parse)

