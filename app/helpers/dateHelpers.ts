export const isValidDate = (dateString: string): boolean => {
  const dateObject = new Date(dateString);
  return !isNaN(dateObject.getTime()) && dateObject instanceof Date;
};

export const formatDate = (
  date?: Date,
  includeHoursSecondsMinutes?: boolean
) => {
  if (date && date !== null) {
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
  dateString?: string | null
): string | undefined => {
  return dateString
    ? new Date(dateString).toISOString().split("T")[0]
    : undefined;
};

export const createISODate = (): string => {
  const now = new Date();
  const isoDate = now.toISOString();
  return isoDate;
};

export const getYesterdayDate = (): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isoDate = yesterday.toISOString().split("T")[0]; // Extract only the date part

  return isoDate;
};
