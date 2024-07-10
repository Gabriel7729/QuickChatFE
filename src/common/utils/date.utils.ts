import { format, isToday, isYesterday } from "date-fns";

export const formatDate = (date: Date, dateFormat: string = "PP"): string => {
  return format(date, dateFormat);
};

export const getDateLabel = (timeSpan: Date): string => {
  const date = timeSpan;
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "MMMM d, yyyy");
};