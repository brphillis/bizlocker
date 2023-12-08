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
      hour12: !includeHoursSecondsMinutes, // Toggle am/pm notation based on the parameter
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = dateToFormat.toLocaleString(undefined, options);

    return formattedDate;
  }
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
