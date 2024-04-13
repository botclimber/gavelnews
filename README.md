# gavelnews
2021
2024 (updated)

# Setup
0. if not existing create Data/ folder inside ./services/ dir, chats/ folder inside ./services/Data/ dir and users/allUsers.json file with ([] empty array) inside ./service/Data/
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
7. create system.config.js file from template and apply suitable configuration depending on your OS        
8. pm2 start system.config.js

> [!IMPORTANT]  
> Data/ folder must exist inside ./services/ path (in some cases it may be necessary the manual creation of it once)

> [!WARNING]  
> chmod +x run.sh (this may be necessary)

> [!IMPORTANT]  
> Schedulers
> Scraper and News day change must run between 00:00 - 00:30

TODO:
- [x] ``` waitForAllData() ``` change interval time from 100 to 1 or a bit higher, this is supposed to not run longer;
- [x] implement lazyload on scroll event;
- [x] create endpoints for filtering and sorting;
- [x] search function should request from server instead of looking on the client existing data;
- [x] backoffice page and service to check platform utilization;
- [x] implement chat backend validations (username limit chars, block script/html injection and reserved username keywors);
- [x] implement google auth for people that want to vote;
- [x] implement (ip + useragent) identifier for guests;
- [x] guests are allowed to text in the chat and are indentified as guests;
- [x] send only necessary information as response, rename new_votedIps to new_votedEmails and remove it when sending the news data.
- [ ] display only allowed dates in the date picker
- [ ] align on background color
- [ ] adapt previous dates page design
- [ ] logo
- [ ] button colors
- [ ] menu and footer colors
- [ ] filter by category
- [ ] search input box smaller
- [ ] about page ? 
- [ ] contact page ?
- [ ] welcome page for first users ?
- [ ] google auth refresh token