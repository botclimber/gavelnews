# Scheduler Service (PY)

Service that scraps the internet for a bunch of defined websites and collect news. Those news are then transformed/Processed and saved into a file (in .json format).

We may decide later but for now idea would be to run this nightly.

Idea would be to have a unique and fresh file for the latest collection of news and a folder (backup) to store past collected news.
Data proposed structure, example:
- data/
    - backup/
        - dailyNews_2024_02_09.json
        - dailyNews_2024_02_10.json
    - dailyNews_2024_02_11.json
