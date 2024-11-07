import { format } from 'date-fns';
export const dateFormat = (date: Date) => format(date, 'yyyy-MM-dd');
