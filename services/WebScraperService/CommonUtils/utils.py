import random
from datetime import timedelta, date

def getSubtractedDate(daysBehind):
    return date.today() - timedelta(days=daysBehind)

# default values in case of missing key
strDefaultValue = ""
objDefaultValue = {}

# amount of data to be extracted
PER_PAGE_LIMIT = 10
PAGES_TO_READ = 1 # currently use in  [publico, jornal noticias, observador, cnn]
# news_until_date = ??? # currently use only in the express_e_sicNoticias.py script