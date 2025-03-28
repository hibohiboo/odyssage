import { format } from 'date-fns';
export const dateFormat = (date: Date) => format(date, 'yyyy-MM-dd');
export const utcStringToJstDatetime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};
