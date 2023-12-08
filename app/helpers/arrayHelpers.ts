export const findUniqueStringsInArrays = (...arrays: string[][]): string[] => {
  // Create a map to count the occurrences of each string
  const stringCounts = new Map<string, number>();

  // Iterate through each array and count string occurrences
  arrays.forEach((array) => {
    const uniqueStrings = new Set(array);
    uniqueStrings.forEach((str) => {
      stringCounts.set(str, (stringCounts.get(str) || 0) + 1);
    });
  });

  // Filter strings that are not present in all arrays
  const uniqueStrings = Array.from(stringCounts.keys()).filter(
    (str) => stringCounts.get(str) !== arrays.length
  );

  return uniqueStrings;
};

export const isArrayofStrings = (value: any): value is string[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => typeof item === "string");
};

export const isArrayofNumbers = (value: any): value is number[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => typeof item === "number");
};
