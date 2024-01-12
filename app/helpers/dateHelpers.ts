export const isValidDate = (dateString: string): boolean => {
  const dateObject = new Date(dateString);
  return !isNaN(dateObject.getTime()) && dateObject instanceof Date;
};

export const formatDate = (
  date?: Date | string,
  includeHoursSecondsMinutes?: boolean,
) => {
  if (date) {
    const dateToFormat = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: !includeHoursSecondsMinutes,
      hour: includeHoursSecondsMinutes ? "2-digit" : undefined,
      minute: includeHoursSecondsMinutes ? "2-digit" : undefined,
      second: includeHoursSecondsMinutes ? "2-digit" : undefined,
    };

    const formattedDate = dateToFormat.toLocaleString(undefined, options);

    return formattedDate;
  }
};

export const formatDateForFormField = (
  dateString?: string | null,
): string | undefined => {
  return dateString
    ? new Date(dateString).toISOString().split("T")[0]
    : undefined;
};

export const createNowISODate = (): string => {
  const now = new Date();
  const isoDate = now.toISOString();
  return isoDate;
};

export const createYesterdayISODate = (): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isoDate = yesterday.toISOString().split("T")[0];
  return isoDate;
};

export const isMostRecentDate = (
  testDate: string,
  stringDates: string[] | (string | null)[],
) => {
  const validDates = stringDates?.filter((date) => date !== null);

  const mostRecentDateString = validDates?.reduce((maxDate, currentDate) => {
    if (currentDate && maxDate) {
      return currentDate > maxDate ? currentDate : maxDate;
    } else return null;
  }, validDates[0]);

  if (testDate === mostRecentDateString) {
    return true;
  } else return false;
};
