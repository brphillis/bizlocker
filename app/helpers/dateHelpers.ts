export const formatDate = (date?: Date, HoursSecondsMinutes?: boolean) => {
  if (date && date !== null) {
    const dateToFormat = new Date(date);

    if (HoursSecondsMinutes) {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formattedDate = dateToFormat.toLocaleString(undefined, options);

      return formattedDate;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const formattedDate = dateToFormat.toLocaleString(undefined, options);

      return formattedDate;
    }
  }
};
