import dayjs from "dayjs";
import { ProjectTime } from "../types";

export const calculateTotalHours = (projectTimes: ProjectTime[]) => {
  return projectTimes.reduce((acc, time) => {
    const { start, end } = time;
    const numberOfFullDays = dayjs(end).diff(dayjs(start), "days") + 1;
    return acc + (numberOfFullDays * 8);
  }, 0);
};
