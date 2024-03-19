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

rule.dayOfWeek = [week.monday, week.tuesday, week.wednesday, week.thursday, week.friday, week.saturday, week.sunday];
rule.hour = 22;
rule.minute = 17;

schedule.scheduleJob(rule, async function(){
  // await for scrap of all platforms
  await job.triggerFullScrap()
  console.log("job finished.")
  
  // transform scraped data and generate an unified file with all extracted/downdload data
});