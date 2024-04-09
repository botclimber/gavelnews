import { Week } from '../../CommonStuff/src/consts/consts';
import { ChatClass } from './controllers/ChatClass';
import * as schedule from "node-schedule";

const PORT = 8002;
const chatService = new ChatClass(PORT);

const ruleForCloseDay = new schedule.RecurrenceRule();
const daysOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

ruleForCloseDay.dayOfWeek = daysOfWeek;
ruleForCloseDay.hour = process.env.HOUR || 2;
ruleForCloseDay.minute = process.env.MIN || 30;
ruleForCloseDay.tz = "Europe/Lisbon";

console.log(`Scheduler set for (${ruleForCloseDay.hour}h, ${ruleForCloseDay.minute}min, ${ruleForCloseDay.tz} tz)`)


schedule.scheduleJob(ruleForCloseDay, function () {
    try {
        chatService.closeDay()

    } catch (error) {
        console.log(error)
    }
});

console.log(`WebSocket server running on port ${PORT}`);