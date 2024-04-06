import * as schedule from 'node-schedule';
import { getPreviousDate, formatDate, saveToFile } from "../../../CommonStuff/src/functions/functions"
import { NewsManipulator } from '../controllers/NewsManipulator';
import { pathBackupData, pathMainData, Week, dateFormat } from "../../../CommonStuff/src/consts/consts"
import { jsonData, loadData, updateJsonData } from '../utils/JsonDataHandler'

/**
 * CRON JOB
 */
const ruleForSaveLoadData = new schedule.RecurrenceRule();

const daysOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

ruleForSaveLoadData.dayOfWeek = daysOfWeek;
ruleForSaveLoadData.hour = process.env.HOUR || 2;
ruleForSaveLoadData.minute = process.env.MIN || 30;

schedule.scheduleJob(ruleForSaveLoadData, async function () {
    try {
        const twoDaysBefore = formatDate(getPreviousDate(2), dateFormat)

        // save manipulated data to file
        console.log("Saving data to file: Start ...")

        if (jsonData.data.data.length > 0) await saveToFile(JSON.stringify(jsonData.data), `${pathBackupData}/${twoDaysBefore}/allData_${twoDaysBefore}.json`);

        else console.log("\tNothing to be saved!")

        console.log("Saving data to file: finish.")

    } catch (error) {
        console.log(`An error ocurred while SAVING: ${error}`)
    }

    try {
        // load newly generated data 
        updateJsonData(new NewsManipulator(loadData(pathMainData, getPreviousDate(1))))

        console.log(`Loading recent Data into memory, with the size of ${jsonData.dataSize().toFixed(2)} `)

    } catch (error) {
        console.log(`An error ocurred while LOADING: ${error}`)
    }
});