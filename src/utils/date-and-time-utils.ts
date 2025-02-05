/* eslint-disable @typescript-eslint/no-namespace */
import { DateTime } from "luxon";

namespace DateAndTimeUtils {
  export const formatToDisplayDate = (date?: Date) => (date && DateTime.fromJSDate(date).toFormat("dd.MM.yyyy")) || "";

  export const formatToDisplayDateTime = (date?: Date | string) => {
    if (!date || typeof date === "string") {
      return date || "";
    }

    return DateTime.fromJSDate(date).toFormat("dd.MM.yyyy HH:mm");
  };

  export const startOfDay = (date: Date) => DateTime.fromJSDate(date).startOf("day").toJSDate();

  export const endOfDay = (date: Date) => DateTime.fromJSDate(date).endOf("day").toJSDate();

  export const addDays = (date: Date, days: number) => DateTime.fromJSDate(date).plus({ days: days }).toJSDate();

  export const formatDoubleToHoursAndMinutes = (value?: number) => {
    if (!value) {
      return "";
    }

    if (value < 0) {
      return `-${Math.floor(Math.abs(value))}h ${Math.round((Math.abs(value) % 1) * 60)}m`;
    }

    return `${Math.floor(value)}h ${Math.round((value % 1) * 60)}m`;
  };
}

export default DateAndTimeUtils;
