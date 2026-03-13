import { format } from 'date-fns';

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'dd MMM yyyy');
};

export const formatFullDateTime = (date: string | Date) => {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a');
};
