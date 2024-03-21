import * as dateAndTime from "date-and-time";

export function getYesterdayDate(): Date { return dateAndTime.addDays(new Date(new Date()), -1)}