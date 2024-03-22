import requests
import json
from datetime import timedelta, date

#https://gmg-posts-api.global.ssl.fastly.net/1/posts?apikey=k25m0hEKYbk1xQp6&apitoken=jnrcnjwljorqgsbu&per_page=12&page=1&filter[isoLanguage]=pt&include=dossiers,labels,authors&sort=-publishedAt

CURRENT_DATE = date.today() - timedelta(days=1)

FILE_NAME = f"jornalNoticias_{CURRENT_DATE}"
EXT = "json"

API_TOKEN = "jnrcnjwljorqgsbu"
API_KEY = "k25m0hEKYbk1xQp6"
PER_PAGE = 12
PAGESTOREAD = 1

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
                "new_id": str(x["publicId"]), # use this to get more detailed info about new
                "new_link": f"https://www.jn.pt/{x['publicId']}/{new_metadata['slug']}/",
                "new_title":new_metadata["title"],
                "new_desc":new_metadata["description"],
                "new_img":f"https://asset.skoiy.com/jnrcnjwljorqgsbu/{new_metadata['image']}?w=410&q=90&crop=5877,3918,62,0",
                "created_at": x["createdAt"],
                "updated_at": x["updatedAt"],
                "new_date": new_metadata['publishedAt'],
                "new_source": "jornal noticias",
                "new_isTrue": 0,
                "new_isFalse": 0,
                "new_isUnclear": 0,
                "new_noOpinion": 0,
                "new_votedIps": []
            }
            
            print("\t",dataset, "\n")	
            
            separator = "," if index < (PER_PAGE * PAGESTOREAD) -1 else ""
            f.write(json.dumps(dataset, ensure_ascii=False) + f"{separator}\n")
            
            total_read_data += 1
        
        current_page += 1     
    f.write("]}")