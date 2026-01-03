import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString, formatStr = 'dd MMM yyyy') => {
  if (!dateString) return '-';

  const date = parseISO(dateString);
  if (!isValid(date)) return 'Invalid Date';

  return format(date, formatStr);
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'dd MMM yyyy • h:mm a');
};