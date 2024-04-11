import * as schedule from 'node-schedule';
import { getPreviousDate, formatDate, saveToFile } from "../../../CommonStuff/src/functions/functions"
import { NewsManipulator } from '../controllers/News/NewsManipulator';
import { pathBackupData, pathMainData, Week, dateFormat } from "../../../CommonStuff/src/consts/consts"
import { jsonData, loadData, updateJsonData } from '../utils/JsonDataHandler'
import { ChatClass } from '../controllers/Chat/ChatClass';
import { allUsers } from '../../../CommonStuff/src/controllers/UsersUtils';

/**
 * CRON JOB
 */

export function setupScheduler(chatService: ChatClass) {
    const ruleForSaveLoadData = new schedule.RecurrenceRule();

    const daysOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

    ruleForSaveLoadData.dayOfWeek = daysOfWeek;
    ruleForSaveLoadData.hour = process.env.HOUR || 2;
    ruleForSaveLoadData.minute = process.env.MIN || 30;
    ruleForSaveLoadData.tz = "Europe/Lisbon";

    console.log(`Scheduler set for (${ruleForSaveLoadData.hour}h, ${ruleForSaveLoadData.minute}min, ${ruleForSaveLoadData.tz} tz)`)

    schedule.scheduleJob(ruleForSaveLoadData, async function () {

        try{
            const twoDaysBefore = formatDate(getPreviousDate(2), dateFormat)

            // save manipulated data to file
            console.log("Saving data to file: Start ...")

            if (jsonData.data.data.length > 0) await saveToFile(JSON.stringify(jsonData.data), `${pathBackupData}/${twoDaysBefore}/allData_${twoDaysBefore}.json`);

            else console.log("\tNothing to be saved!")

            console.log("Saving data to file: finish.")

            // load newly generated data 
            updateJsonData(new NewsManipulator(loadData(pathMainData, getPreviousDate(1))))

            console.log(`Loading recent Data into memory, with the size of ${jsonData.dataSize().toFixed(2)} `)

            console.log("Saving and restarting Chat rooms")
            chatService.closeDay();

            console.log("persiting users data")
            await allUsers.saveUsers();

        }catch(error){
            console.log(error)
        }
    });
}