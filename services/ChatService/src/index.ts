import { Week } from '../../CommonStuff/src/consts/consts';
import { ChatClass } from './controllers/ChatClass';
import * as schedule from "node-schedule";

// TODO:
// - save in memory last 50 or 100 messages
// - prevent/filter suspicious messages with links or script/html injection
// - prevent spam
// - prevent really long usernames
// - [Implemented] create a chat for each New

const PORT = 8002;
const chatService = new ChatClass(PORT);

const ruleForCloseDay = new schedule.RecurrenceRule();
const daysOfWeek = [Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.SUNDAY];

ruleForCloseDay.dayOfWeek = daysOfWeek;
ruleForCloseDay.hour = 11;
ruleForCloseDay.minute = 30;

schedule.scheduleJob(ruleForCloseDay, function () {
    try {
        chatService.closeDay()

    } catch (error) {
        console.log(error)
    }
});

console.log(`WebSocket server running on port ${PORT}`);