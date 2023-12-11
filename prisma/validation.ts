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
