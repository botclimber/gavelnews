# https://expresso.pt/api/gs/expresso/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CSTREAM%2CNEWSLETTER&limit=10&until=2024-03-18T12
# https://sicnoticias.pt/api/gs/sicnot/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CVIDEO%2CPLAYLIST%2CGALLERY%2CSTREAM%2CEVENT&limit=12&until=2024-03-19T11%3A29%3A45.498Z
# Both websites use same API

import requests
import json
from datetime import timedelta, date

CURRENT_DATE = date.today() - timedelta(days=1)

def generateFile(filename, ext, pagestoread, news_per_page_limit, url):
    with open(f"../../Data/{filename}.{ext}", "w", encoding="utf-8") as f:
    
        current_page = 1
        total_read_data = 0
        
        f.write("{ \"data\": [ \n")
        
        while current_page <= pagestoread:
            response = requests.get(url)
            data = response.json()
            print(f"Available data has size of {len(data['contents'])}")
            
            for x in data["contents"]:
                dataset = {
                    "new_id":x["code"], # use this to get more detailed info about new
                    "new_link": f"https://expresso.pt{x['link']}",
                    "new_title":x["title"],
                    "new_desc": x["lead"],
                    "new_img": x["picture"]["urlOriginal"],
                    "new_type": x["mainCategory"]["name"],
                    "new_date": x['publishedDate']
                }
                
                print("\t",dataset, "\n")	
                
                separator = "," if total_read_data < (news_per_page_limit * pagestoread) -1 else ""
                f.write(json.dumps(dataset, ensure_ascii=False) + f"{separator}\n")
                
                total_read_data += 1
            
            current_page += 1
        f.write("]}")
    
# expresso
expresso_filename = f"expresso_{CURRENT_DATE}"
expresso_ext = "json"
expresso_pagestoread = 2
expresso_newsPerPageLimit = 5
expresso_newsUntil = f"{CURRENT_DATE}T12"

expresso_url = f"https://expresso.pt/api/gs/expresso/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CSTREAM%2CNEWSLETTER&limit={expresso_newsPerPageLimit}&until={expresso_newsUntil}"

generateFile(expresso_filename, expresso_ext, expresso_pagestoread, expresso_newsPerPageLimit, expresso_url)

# sic noticias
sic_filename = f"sicNoticias_{CURRENT_DATE}"
sic_ext = "json"
sic_pagestoread = 2
sic_newsPerPageLimit = 5
sic_newsUntil = f"{CURRENT_DATE}T12"

sic_url = f"https://sicnoticias.pt/api/gs/expresso/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CSTREAM%2CNEWSLETTER&limit={sic_newsPerPageLimit}&until={sic_newsUntil}"

generateFile(sic_filename, sic_ext, sic_pagestoread, sic_newsPerPageLimit, sic_url)