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
