import type { BlockName } from "~/utility/blockMaster/types";

export const getSizeSelectValues = (blockName?: BlockName) => {
  if (blockName === "carousel") {
    return [
      { id: "h-[440px]", name: "Small 440(H)" },
      { id: "h-[540px]", name: "Medium 540(H)" },
      { id: "h-[640px]", name: "Large 640(H)" },
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
