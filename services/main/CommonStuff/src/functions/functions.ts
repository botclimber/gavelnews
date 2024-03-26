import * as dateAndTime from "date-and-time";

export function getPreviousDate(days: number): Date { return dateAndTime.addDays(new Date(new Date()), -(days))}