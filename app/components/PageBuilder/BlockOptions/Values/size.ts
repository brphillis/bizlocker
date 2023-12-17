import type { BlockName } from "~/utility/blockMaster/types";

export const getSizeSelectValues = (blockName?: BlockName) => {
  if (blockName === "carousel") {
    return [
      { id: "600xScreen", name: "600 x Screen" },
      { id: "600x1280", name: "600 x 1280" },
    ];
  } else if (blockName === "banner") {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
      { id: "native", name: "Native" },
    ];
  } else {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
    ];
  }
};

export const getMobileSizeSelectValues = (blockName?: BlockName) => {
  if (blockName === "carousel") {
    return [{ id: "full", name: "Full" }];
  } else if (blockName === "banner") {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
      { id: "native", name: "Native" },
    ];
  } else {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
    ];
  }
};
