# https://www.publico.pt/api/list/ultimas?page=2
import sys

sys.path.append('../CommonUtils')
from utils import randomVeracityValue, strDefaultValue, getSubtractedDate, PAGES_TO_READ

import requests
import json
from datetime import timedelta, date

CURRENT_DATE = getSubtractedDate(1)

FILE_NAME = f"publico_{CURRENT_DATE}"
EXT = "json"

PAGESTOREAD = PAGES_TO_READ
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
                "new_id": str(x.get("id", strDefaultValue)), # use this to get more detailed info about new
                "new_link": x.get("url", strDefaultValue),
                "new_title":x.get("titulo", strDefaultValue),
                "new_desc": x.get("descricao", strDefaultValue),
                "new_img": x.get("multimediaPrincipal", strDefaultValue),
                "new_type": x.get("rubrica", strDefaultValue),
                "new_date": x.get("data", strDefaultValue),
                "new_source": "publico",
                "new_isTrue": randomVeracityValue(),
                "new_isFalse": randomVeracityValue(),
                "new_isUnclear": randomVeracityValue(),
                "new_noOpinion": randomVeracityValue(),
                "new_votedEmails": []
            }
            
            print("\t",dataset, "\n")	
            separator = "," if total_read_data < (NEWS_PER_PAGE * PAGESTOREAD) -1 else ""
            f.write(json.dumps(dataset, ensure_ascii=False) + f"{separator}\n")
            
            total_read_data += 1
        
        current_page += 1
    f.write("]}")