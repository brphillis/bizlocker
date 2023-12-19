export const handleBlockOptionItemInputChange = (
  index: number,
  newValue: string | undefined,
  currentItems: Array<string | undefined>,
  setFunction: React.Dispatch<React.SetStateAction<(string | undefined)[]>>
): void => {
  const updatedItems = [...currentItems];

  while (updatedItems.length <= index) {
    updatedItems.push("");
  }

  updatedItems[index] = newValue;

  setFunction(updatedItems);
};
