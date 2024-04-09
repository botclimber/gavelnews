# gavelnews
2021
2024 (updated)

# Setup
0. if not existing create Data/ folder inside ./services/ dir, chats/ folder inside ./services/Data/ dir and users/ folder inside ./service/Data/
1. npm install
3. gulp build
4. gulp compile
5. go to /services/WebScraperService:
    - create virtual env:
        - python -m venv .packages
    - start it:
        - source .packages/bin/activate
    - install dependencies:
        - pip install -r requirements.txt
7. pm2 start system.config.js

> [!IMPORTANT]  
> Data/ folder must exist inside ./services/ path (in some cases it may be necessary the manual creation of it once)

> [!WARNING]  
> chmod +x run.sh (this may be necessary)

TODO:
- [x] ``` waitForAllData() ``` change interval time from 100 to 1 or a bit higher, this is supposed to not run longer;
- [x] implement lazyload on scroll event;
- [x] create endpoints for filtering and sorting;
- [x] search function should request from server instead of looking on the client existing data;
- [x] backoffice page and service to check platform utilization;
- [x] implement chat backend validations (username limit chars, block script/html injection and reserved username keywors).
- [ ] implement localStorage cleaner regarding votes
