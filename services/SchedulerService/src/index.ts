import * as schedule from "node-schedule";
import * as job from "./controllers/functions";
import { Week } from "../../CommonStuff/src/consts/consts"

const rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

rule.hour = process.env.HOUR || 2;
rule.minute = process.env.MIN || 20;

console.log(rule.hour)

schedule.scheduleJob(rule, async function () {

  try {
    //await for backup
    await job.backupCurrentFiles()

  }catch(error){
    console.log(`An error ocurred: ${error}`)
  }

  try{
    // await for scrap of all platforms
    await job.triggerFullScrap()

    // transform scraped data and generate an unified file with all extracted/downdload data
    await job.transformExtractedData()

  } catch (error) {
    console.log(`An error ocurred: ${error}`)
  }
});