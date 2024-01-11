export const validateISO8601 = (str: string | null): boolean => {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

  if (!str || !iso8601Regex.test(str)) {
    return false;
  } else return true;
};

export const createISO8601DateNow = (): string => {
  const now = new Date();
  const isoString = now.toISOString();
  return isoString;
};

export const convertToISO8601Date = (date: Date | string): string => {
  if (!(date instanceof Date)) {
    const convertedDate = new Date(date).toISOString();

    if (!validateISO8601(convertedDate)) {
      throw new Error("Invalid date object");
    }

    return convertedDate;
  }

  return date.toISOString();
};
