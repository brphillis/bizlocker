export const handleBlockOptionItemInputChange = (
  index: number,
  newValue: string,
  currentItems: string[],
  setFunction: React.Dispatch<React.SetStateAction<string[]>>
): void => {
  const updatedItems = [...currentItems];

  while (updatedItems.length <= index) {
    updatedItems.push("");
  }

  updatedItems[index] = newValue;

  setFunction(updatedItems);
};
