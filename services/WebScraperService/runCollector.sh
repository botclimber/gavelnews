# Get yesterday's date in the format YYYY-MM-DD
yesterday=$(python3 -c "from dateutil.relativedelta import relativedelta; from datetime import datetime; print((datetime.now() - relativedelta(days=1)).strftime('%Y-%m-%d'))")

echo "Collecting all news from sources ..."
echo "Target date: $yesterday"
cd ../WebScraperService/NewsCollectorSpider
scrapy crawl collectFrom_observador -o ../../Data/observador_$yesterday.json; \
scrapy crawl collectFrom_cnnPortugal -o ../../Data/cnnPortugal_$yesterday.json; \
scrapy crawl collectFrom_visao -o ../../Data/visao_$yesterday.json; \
cd ../NewsCollectorRequests
python3 expresso_e_sicNoticias.py
python3 jornalNoticias.py
python3 publico.py

echo "Extraction Complete."