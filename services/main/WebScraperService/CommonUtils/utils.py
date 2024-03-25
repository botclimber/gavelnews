import random
from datetime import timedelta, date

# used for test purposes
def randomVeracityValue():
    return random.randint(1, 250)

def getSubtractedDate(daysBehind):
    return date.today() - timedelta(days=daysBehind)

# default values in case of missing key
strDefaultValue = ""
objDefaultValue = {}

# amount of data to be extracted
PER_PAGE_LIMIT = 10
PAGES_TO_READ = 1 # currently use in  [publico, jornal noticias, observador, cnn]
# news_until_date = ??? # currently use only in the express_e_sicNoticias.py script