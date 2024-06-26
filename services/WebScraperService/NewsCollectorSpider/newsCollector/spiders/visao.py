# scrapy crawl collectFrom_visao -o ../../Data/visao_2024-04-2.json 
# replace date in filename with current

# !IMPORTANT : observador adds empty spaces on purpose to prevent scrapying

import scrapy
import uuid
from collections import OrderedDict

def get_or_else_index(lst, index, default_value):
    try:
        return lst[index]
    except IndexError:
        return default_value

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
		news_title = [title.strip() for title in news.xpath(".//a[@class='article-block-title']/h4/span/text()").getall()] # remove empty titles
		news_desc = [desc.strip() if desc.strip() else "" for desc in news.xpath(".//div[@class='article-block-content ']/p[@class='article-block-excerpt']/text()").getall()]
		#news_date = [date.strip() for date in news.xpath(".//time[@class='timeago']/text()").getall()]
		news_img = [img.strip() for img in news.xpath(".//div[@class='article-block-media ']/a/img/@data-src").getall()]
		news_type = [img.strip() for img in news.xpath(".//div[@class='article-block-section']/a/text()").getall()]        
        
		data = []
		for x in range(len(news_title)):
			link = get_or_else_index(news_link, x, "")
			title = get_or_else_index(news_title, x, "")
			desc = get_or_else_index(news_desc, x, "")
			nType = get_or_else_index(news_type, x, "")
			img = get_or_else_index(news_img, x, "")
      
			data.append({"new_id":str(uuid.uuid4()), "new_link": link, "new_title": title, "new_desc": desc, "new_type": nType, "new_date": "", "new_img": img, "new_source": "visao"})
		
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

