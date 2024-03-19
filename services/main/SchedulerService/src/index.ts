import * as schedule from "node-schedule";
import * as job from "./controllers/functions";

const week = {
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
    "sunday": 7
};

const rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [week.monday, week.wednesday, week.saturday];
rule.hour = 21;
rule.minute = 30;

schedule.scheduleJob(rule, async function(){
  // await for scrap of all platforms
  // transform scraped data and generate an unified file with all extracted/downdload data
});