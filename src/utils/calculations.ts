import dayjs from "dayjs";
import { ProjectTime } from "../types";

export const calculateTotalHours = (projectTimes: ProjectTime[]) => {
  return projectTimes.reduce((acc, time) => {
    const { start, end } = time;
    const duration = dayjs(end).diff(dayjs(start), "hour");
    return acc + duration;
  }, 0);
};
