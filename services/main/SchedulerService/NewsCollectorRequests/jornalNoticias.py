import requests
import json
import datetime

#https://gmg-posts-api.global.ssl.fastly.net/1/posts?apikey=k25m0hEKYbk1xQp6&apitoken=jnrcnjwljorqgsbu&per_page=12&page=1&filter[isoLanguage]=pt&include=dossiers,labels,authors&sort=-publishedAt


TIME_NOW = datetime.datetime.now()
CURRENT_DATE = f"{TIME_NOW.year}_{TIME_NOW.month}_{TIME_NOW.day}"

FILE_NAME = f"jornalNoticias_{CURRENT_DATE}"
EXT = "json"

API_TOKEN = "jnrcnjwljorqgsbu"
API_KEY = "k25m0hEKYbk1xQp6"
PER_PAGE = 12
PAGE = 1

response = requests.get(f"https://gmg-posts-api.global.ssl.fastly.net/1/posts?apikey={API_KEY}&apitoken={API_TOKEN}&per_page={PER_PAGE}&page={PAGE}&filter[isoLanguage]=pt&sort=-publishedAt")

data = response.json()

with open(f"../../Data/{FILE_NAME}.{EXT}", "w", encoding="utf-8") as f:
    f.write("{ \"data\": [ \n")
    for index, x in enumerate(data["data"]):
        print(index)
        new_metadata = x['l10n'][0]
        print(x)
        print(f"Handling new ({new_metadata['title']})")
        
        dataset = {
            "new_publicId":x["publicId"], # use this to get more detailed info about new
            "new_link": f"https://www.jn.pt/{x['publicId']}/{new_metadata['slug']}/"
            "new_title":new_metadata["title"],
            "new_desc":new_metadata["description"],
            "new_img":f"https://asset.skoiy.com/jnrcnjwljorqgsbu/{new_metadata['image']}?w=410&q=90&crop=5877,3918,62,0",
            "created_at": x["createdAt"],
            "updated_at": x["updatedAt"],
            "new_date": new_metadata['publishedAt']
        }
        
        print("\t",dataset, "\n")	
        separator = "," if index < PER_PAGE -1 else ""
        f.write(json.dumps(dataset, ensure_ascii=False) + f"{separator}\n")
    f.write("]}")