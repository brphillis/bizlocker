export const capitalizeFirst = (str: string): string => {
  if (str.length === 0) {
    return str;
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const resOfWord = str.slice(1);

  return firstLetter + resOfWord;
};

export const limitString = (
  inputString: string,
  maxLength: number,
  addDots?: boolean
) => {
  if (inputString.length <= maxLength) {
    return inputString;
  } else {
    if (addDots) {
      return inputString.slice(0, maxLength) + "...";
    } else {
      return inputString.slice(0, maxLength);
    }
  }
};

export const createVerificationCode = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
};
