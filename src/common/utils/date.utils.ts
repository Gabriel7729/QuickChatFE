import { format } from "date-fns";

export const formatDate = (date: Date, dateFormat: string = "PP"): string => {
  return format(date, dateFormat);
};
