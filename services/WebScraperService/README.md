# Scheduler Service (PY)

Service that scraps the internet for a bunch of defined websites and collect news. Those news are then transformed/Processed and saved into a file (in .json format).

We may decide later but for now idea would be to run this nightly.

Idea would be to have a unique and fresh file for the latest collection of news and a folder (backup) to store past collected news.
Data proposed structure, example:
- data/
    - backup/
        - 2024_02_09/
            - (WEBSITE NAME 1)DailyNews_2024_02_09.json
            - (WEBSITE NAME 2)DailyNews_2024_02_09.json
            - (WEBSITE NAME 3)DailyNews_2024_02_09.json
        - 2024_02_10/
            - (WEBSITE NAME 1)DailyNews_2024_02_10.json
            - (WEBSITE NAME 2)DailyNews_2024_02_10.json
            - (WEBSITE NAME 3)DailyNews_2024_02_10.json
        - (WEBSITE NAME 1)_2024_02_11.json
        - (WEBSITE NAME 2)_2024_02_11.json
        - (WEBSITE NAME 3)_2024_02_11.json

# Target Websites:
- jornal noticias | method: request (python3 jornalNoticias.py)
- diario de noticias ?
- correio da manha (use spider) (in progress ...) 
- observador | method: spider (scrapy crawl collectFrom_observador -o ../../Data/observador_(date).json)
- cnn portugal | method: spider (scrapy crawl collectFrom_cnnPortugal -o ../../Data/cnnPortugal_(date).json )
- expresso and sic noticias method: request (python3 expresso_e_sicNoticias.py)
- publico method: request (python3 publico.py)
- visao
