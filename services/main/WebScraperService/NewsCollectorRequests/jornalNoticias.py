import sys

sys.path.append('../CommonUtils')
from utils import randomVeracityValue, strDefaultValue , PAGES_TO_READ, getSubtractedDate

import requests
import json

#https://gmg-posts-api.global.ssl.fastly.net/1/posts?apikey=k25m0hEKYbk1xQp6&apitoken=jnrcnjwljorqgsbu&per_page=12&page=1&filter[isoLanguage]=pt&include=dossiers,labels,authors&sort=-publishedAt

CURRENT_DATE = getSubtractedDate(1)

FILE_NAME = f"jornalNoticias_{CURRENT_DATE}"
EXT = "json"

API_TOKEN = "jnrcnjwljorqgsbu"
API_KEY = "k25m0hEKYbk1xQp6"
PER_PAGE = 10

PAGESTOREAD = PAGES_TO_READ

with open(f"../../Data/{FILE_NAME}.{EXT}", "w", encoding="utf-8") as f:
    
    current_page = 1
    total_read_data = 0
    
    f.write("{ \"data\": [ \n")
    
    while current_page <= PAGESTOREAD:
        response = requests.get(f"https://gmg-posts-api.global.ssl.fastly.net/1/posts?apikey={API_KEY}&apitoken={API_TOKEN}&per_page={PER_PAGE}&page={current_page}&filter[isoLanguage]=pt&sort=-publishedAt")

        data = response.json()  
        print(f"Available data has size of {len(data['data'])}")
    
        for index, x in enumerate(data["data"]):
            print(index)
            new_metadata = x['l10n'][0]
            print(x)
            print(f"Handling new ({new_metadata['title']})")
            
            dataset = {
                "new_id": str(x.get("publicId", strDefaultValue)), # use this to get more detailed info about new
                "new_link": f"https://www.jn.pt/{x.get('publicId', strDefaultValue)}/{new_metadata.get('slug', strDefaultValue)}/",
                "new_title":new_metadata.get("title", strDefaultValue),
                "new_desc":new_metadata.get("description", strDefaultValue),
                "new_img":f"https://asset.skoiy.com/jnrcnjwljorqgsbu/{new_metadata.get('image', strDefaultValue)}?w=410&q=90&crop=5877,3918,62,0",
                "created_at": x.get("createdAt", strDefaultValue),
                "updated_at": x.get("updatedAt", strDefaultValue),
                "new_date": new_metadata.get('publishedAt', strDefaultValue),
                "new_source": "jornal noticias",
                "new_isTrue": randomVeracityValue(),
                "new_isFalse": randomVeracityValue(),
                "new_isUnclear": randomVeracityValue(),
                "new_noOpinion": randomVeracityValue(),
                "new_votedIps": []
            }
            
            print("\t",dataset, "\n")	
            
            separator = "," if index < (PER_PAGE * PAGESTOREAD) -1 else ""
            f.write(json.dumps(dataset, ensure_ascii=False) + f"{separator}\n")
            
            total_read_data += 1
        
        current_page += 1     
    f.write("]}")