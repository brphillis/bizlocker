export const handleBlockOptionItemInputChange = (
  index: number,
  newValue: string | number | undefined,
  currentItems: Array<string | number | undefined>,
  setFunction: React.Dispatch<
    React.SetStateAction<(string | number | undefined)[]>
  >
): void => {
  const sanitzedNewValue =
    newValue?.toString().includes("undefined") || !newValue ? "" : newValue;

  const updatedItems = [...currentItems];

  while (updatedItems.length <= index) {
    updatedItems.push("");
  }

  updatedItems[index] = sanitzedNewValue;

  setFunction(updatedItems);
};
