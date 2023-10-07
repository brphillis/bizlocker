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
