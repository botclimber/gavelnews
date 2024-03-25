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
rule.hour = 14;
rule.minute = 20;

schedule.scheduleJob(rule, async function () {

  try {
    // await for scrap of all platforms
    await job.triggerFullScrap()

    // transform scraped data and generate an unified file with all extracted/downdload data
    await job.transformExtractedData()

  } catch (error) {
    console.log(`An error ocurred: ${error}`)
  }
});