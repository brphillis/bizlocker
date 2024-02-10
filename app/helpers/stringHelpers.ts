export const includesWords = (
  testWord: string,
  includesWords: string[],
): boolean => {
  let bool = false;

  for (const word of includesWords) {
    if (testWord.includes(word)) {
      bool = true;
    }
  }

  return bool;
};

export const removeSpecialCharacters = (str: string): string => {
  // Define a regular expression to match special characters
  const regex: RegExp = /[!@#$%^&*()_+=[\]{};':"|,.<>/?]+/g;

  // Replace all occurrences of special characters with an empty string
  return str.replace(regex, "");
};

export const capitalizeAndSpace = (inputString: string): string => {
  return inputString
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (match) => match.toUpperCase());
};

export const capitalizeFirst = (str: string): string => {
  if (str.length === 0) {
    return str;
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const resOfWord = str.slice(1);

  return firstLetter + resOfWord;
};

export const capitalizeFirstLetterOfWordInString = (
  inputString: string,
  targetWord: string,
): string => {
  const lowerTarget = targetWord.toLowerCase();
  const index = inputString.toLowerCase().indexOf(lowerTarget);

  if (index !== -1) {
    return (
      inputString.substring(0, index) +
      inputString
        .substring(index, index + targetWord.length)
        .replace(
          new RegExp(`\\b${lowerTarget}\\b`, "i"),
          (match) => match.charAt(0).toUpperCase() + match.slice(1),
        ) +
      inputString.substring(index + targetWord.length)
    );
  } else {
    return inputString;
  }
};

export const capitalizeWords = (input?: string): string => {
  if (input) {
    const words = input.split(" ");

    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    );

    const result = capitalizedWords.join(" ");

    return result;
  } else return "";
};

export const returnCorrectGender = (genderName: string): string => {
  const normalizedGender = genderName.toLowerCase();

  switch (normalizedGender) {
    case "male":
    case "men":
    case "mens":
    case "man":
    case "boys":
    case "boy":
      return "MALE";

    case "female":
    case "women":
    case "woman":
    case "womans":
    case "girls":
    case "girl":
      return "FEMALE";

    case "kids":
    case "child":
    case "children":
    case "kid":
      return "KIDS";

    default:
      return "UNISEX";
  }
};

export const extractGuidFromUrl = (url: string): string | null => {
  const uuidRegex =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  const match = url.match(uuidRegex);

  return match ? match[0] : null;
};

export const filterWordsFromString = (sentence: string): string => {
  // Use a regular expression to match words (letters only)
  const wordRegex = /\b[A-Za-z]+\b/g;

  // Match all words in the sentence
  const words = sentence.match(wordRegex);

  // If there are matched words, join them to form the filtered sentence
  if (words) {
    return words.join(" ");
  } else {
    // If no words are found, return an empty string or handle it as needed
    return "";
  }
};

export const extractBucketName = (s3Url: string): string | null => {
  const parts = s3Url.split("/");
  const hostPart = parts[2];
  console.log("PARTS", parts);
  console.log("HOSTPART", hostPart);

  if (hostPart) {
    const subParts = hostPart.split(".")[0].split("-");
    return subParts.join("-");
  }
  return null;
};
