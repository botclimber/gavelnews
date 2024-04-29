import * as schedule from 'node-schedule';
import { getPreviousDate, formatDate, saveToFile } from "../../../CommonStuff/src/functions/functions";
import { NewsManipulator } from '../controllers/News/NewsManipulator';
import { pathBackupData, pathMainData, Week, dateFormat } from "../../../CommonStuff/src/consts/consts";
import { jsonData, loadData, updateJsonData } from '../utils/JsonDataHandler';
import { ChatClass } from '../controllers/Chat/ChatClass';
import { allUsers } from '../../../CommonStuff/src/controllers/UsersUtils';

const ONE_DAY_BEFORE = formatDate(getPreviousDate(1), dateFormat);
const TWO_DAYS_BEFORE = formatDate(getPreviousDate(2), dateFormat);

const EUROPE_LISBON_TZ = "Europe/Lisbon";
const daysOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

const ruleChangeDay = new schedule.RecurrenceRule();
ruleChangeDay.dayOfWeek = daysOfWeek;
ruleChangeDay.hour = process.env.HOUR || 0;
ruleChangeDay.minute = process.env.MIN || 5;
ruleChangeDay.tz = EUROPE_LISBON_TZ;

const rulePersistData = new schedule.RecurrenceRule();
rulePersistData.dayOfWeek = daysOfWeek;
rulePersistData.minute = process.env.SAVE_INTERVAL || 30;
rulePersistData.tz = EUROPE_LISBON_TZ;

export async function persistNewsData(path: string): Promise<void> {
    console.log("Saving data to file: Start ...");
    if (jsonData.data.data.length > 0) {
        await saveToFile(JSON.stringify(jsonData.data), path);
    } else {
        console.log("\tNothing to be saved!");
    }
    console.log("Saving data to file: finish.");
}

export async function persistUsersData(): Promise<void> {
    console.log("Persisting users data");
    await allUsers.saveUsers();
}

export async function saveDataAndRestartChat(chatService: ChatClass): Promise<void> {
    console.log("Saving and restarting Chat rooms");
    await chatService.closeDay();
}

export async function persistSensitiveData(): Promise<void> {
    console.log(`Scheduler persist data set for (${rulePersistData.hour}h, ${rulePersistData.minute}min, ${EUROPE_LISBON_TZ} tz)`);

    schedule.scheduleJob(rulePersistData, async () => {
        try {
            await persistNewsData(`${pathMainData}/allData.json`);
            await persistUsersData();
        } catch (error) {
            console.error("Error occurred while persisting sensitive data:", error);
        }
    });
}

export async function changeDay(chatService: ChatClass): Promise<void> {
    console.log(`Scheduler close day set for (${ruleChangeDay.hour}h, ${ruleChangeDay.minute}min, ${EUROPE_LISBON_TZ} tz)`);

    schedule.scheduleJob(ruleChangeDay, async () => {
        try {

            await persistNewsData(`${pathBackupData}/allData.json`);
            await persistUsersData();
            await saveDataAndRestartChat(chatService);

            updateJsonData(new NewsManipulator(loadData(pathMainData, getPreviousDate(1))));
            console.log(`Loading recent Data into memory, with the size of ${jsonData.dataSize().toFixed(2)} `);
            
        } catch (error) {
            console.error("Error occurred while changing day:", error);
        }
    });
}
