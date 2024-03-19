# https://www.publico.pt/api/list/ultimas?page=2

import requests
import json
import datetime

TIME_NOW = datetime.datetime.now()
CURRENT_DATE = f"{TIME_NOW.year}_{TIME_NOW.month}_{TIME_NOW.day}"

FILE_NAME = f"publico_{CURRENT_DATE}"
EXT = "json"

PAGESTOREAD = 2
NEWS_PER_PAGE = 10

with open(f"../../Data/{FILE_NAME}.{EXT}", "w", encoding="utf-8") as f:
    
    current_page = 1
    total_read_data = 0
    
    f.write("{ \"data\": [ \n")
    
    while current_page <= PAGESTOREAD:
        response = requests.get(f"https://www.publico.pt/api/list/ultimas?page={current_page}")
        data = response.json()
        print(f"Available data has size of {len(data)}")
        
        for x in data:
            dataset = {
                "new_id":x["id"], # use this to get more detailed info about new
                "new_link": x["url"],
                "new_title":x["titulo"],
                "new_desc": x["descricao"],
                "new_img": x["multimediaPrincipal"],
                "new_type": x["rubrica"],
                "new_date": x['data']
            }
            
            print("\t",dataset, "\n")	
            separator = "," if total_read_data < (NEWS_PER_PAGE * PAGESTOREAD) -1 else ""
            f.write(json.dumps(dataset, ensure_ascii=False) + f"{separator}\n")
            
            total_read_data += 1
        
        current_page += 1
    f.write("]}")