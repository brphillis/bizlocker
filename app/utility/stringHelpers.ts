export const randomId = () => {
  let id = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < 20; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
};

export const capitalizeFirst = (str: string): string => {
  if (str.length === 0) {
    return str;
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const resOfWord = str.slice(1);

  return firstLetter + resOfWord;
};
