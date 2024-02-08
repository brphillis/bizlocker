export const swapContentArrayElements = <T>(
  array: (T | object | string)[],
  index1: number,
  index2: number,
): (T | string | object)[] => {
  // Create a new array to avoid modifying the original array in place
  const newArray = [...array];

  // Check if index1 is within the bounds of the array
  if (index1 >= 0 && index1 < newArray.length) {
    // Swap the elements at index1 and index2
    const temp: T | string | object = newArray[index1];
    newArray[index1] = index2 < newArray.length ? newArray[index2] : "";
    newArray[index2] = temp;
  } else if (index1 >= 0 && index2 < newArray.length) {
    // If index1 is out of bounds, create index1 as an empty string
    newArray[index1] = "";
    // Swap the elements at index1 and index2
    const temp: T | string | object = newArray[index1];
    newArray[index1] = newArray[index2];
    newArray[index2] = temp;
  }

  // Return the new array with swapped elements
  return newArray;
};

export const findUniqueStringsInArrays = (
  ...arrays: (string[] | undefined)[]
): string[] => {
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
    (str) => stringCounts.get(str) !== arrays.length,
  );

  return uniqueStrings;
};

export const isArrayofStrings = (value: unknown): value is string[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => typeof item === "string");
};

export const isArrayofNumbers = (value: unknown): value is number[] => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => typeof item === "number");
};

export const sanitizeArray = <T>(arr: (T | null | undefined)[]): T[] => {
  // Use filter to remove null and undefined values
  const sanitizedArray: T[] = arr.filter(
    (item): item is T => item !== null && item !== undefined,
  );
  return sanitizedArray;
};
