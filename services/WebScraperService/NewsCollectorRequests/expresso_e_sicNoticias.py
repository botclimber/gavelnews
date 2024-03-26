# https://expresso.pt/api/gs/expresso/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CSTREAM%2CNEWSLETTER&limit=10&until=2024-03-18T12
# https://sicnoticias.pt/api/gs/sicnot/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CVIDEO%2CPLAYLIST%2CGALLERY%2CSTREAM%2CEVENT&limit=12&until=2024-03-19T11%3A29%3A45.498Z
# Both websites use same API

import sys

sys.path.append('../CommonUtils')
from utils import randomVeracityValue, strDefaultValue, objDefaultValue, getSubtractedDate, PER_PAGE_LIMIT

import requests
import json

CURRENT_DATE = getSubtractedDate(1)

def generateFile(filename, ext, pagestoread, news_per_page_limit, base_url, url, source):
    with open(f"../../Data/{filename}.{ext}", "w", encoding="utf-8") as f:
    
        current_page = 1
        total_read_data = 0
        
        f.write("{ \"data\": [ \n")
        
        while current_page <= pagestoread:
            response = requests.get(url)
            data = response.json()
            print(f"Available data has size of {len(data['contents'])}")
            print(url)
            
            for x in data["contents"]:
                dataset = {
                    "new_id": x.get("code", strDefaultValue),
                    "new_link": f"{base_url}{x.get('link', strDefaultValue)}",
                    "new_title":x.get("title", strDefaultValue),
                    "new_desc": x.get("lead", strDefaultValue),
                    "new_img": x.get("picture", objDefaultValue).get("urlOriginal", strDefaultValue),
                    "new_type": x.get("mainCategory", objDefaultValue).get("name", strDefaultValue),
                    "new_date": x.get("publishedData", strDefaultValue),
                    "new_source": source,
                    "new_isTrue": randomVeracityValue(),
                    "new_isFalse": randomVeracityValue(),
                    "new_isUnclear": randomVeracityValue(),
                    "new_noOpinion": randomVeracityValue(),
                    "new_votedIps": []
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
expresso_pagestoread = 1
expresso_newsPerPageLimit = PER_PAGE_LIMIT
expresso_newsUntil = f"{CURRENT_DATE}T12"
source = "expresso"

expresso_url = f"https://expresso.pt/api/gs/expresso/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CSTREAM%2CNEWSLETTER&limit={expresso_newsPerPageLimit}&until={expresso_newsUntil}"
express_base_url = "https://expresso.pt"

generateFile(expresso_filename, expresso_ext, expresso_pagestoread, expresso_newsPerPageLimit, express_base_url, expresso_url, source)

# sic noticias
sic_filename = f"sicNoticias_{CURRENT_DATE}"
sic_ext = "json"
sic_pagestoread = 1
sic_newsPerPageLimit = PER_PAGE_LIMIT
sic_newsUntil = f"{CURRENT_DATE}T12"
source = "sic noticias"

sic_url = f"https://sicnoticias.pt/api/gs/expresso/v1/molecule/feed?categories=%2F&category=%2F&contentTypes=ARTICLE%2CSTREAM%2CNEWSLETTER&limit={sic_newsPerPageLimit}&until={sic_newsUntil}"
sic_base_url = "https://sicnoticias.pt"

generateFile(sic_filename, sic_ext, sic_pagestoread, sic_newsPerPageLimit, sic_base_url, sic_url, source)