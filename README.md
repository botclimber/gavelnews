# gavelnews
2021
2024 (updated)

# Setup
0. if not existing create Data/ folder inside ./services/ folder
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

> [!WARNING]  
> chmod +x run.sh (this may be necessary)
