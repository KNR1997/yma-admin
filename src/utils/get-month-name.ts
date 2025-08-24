export const getMonthName = (monthNumber: number, locale: string = 'en-US') => {
  if (!monthNumber || monthNumber < 1 || monthNumber > 12) return '';
  return new Date(2000, monthNumber - 1, 1).toLocaleString(locale, {
    month: 'long',
  });
};
