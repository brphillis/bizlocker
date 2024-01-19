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

export const getHeightSelectValues = (blockName?: BlockName) => {
  if (blockName === "carousel") {
    return [
      { id: "h-[440px]", name: "Small 440(H)" },
      { id: "h-[540px]", name: "Medium 540(H)" },
      { id: "h-[640px]", name: "Large 640(H)" },
    ];
  } else {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
    ];
  }
};

export const getMobileHeightSelectValues = (blockName?: BlockName) => {
  if (blockName === "carousel") {
    return [
      { id: "max-md:h-[100dvh]", name: "Full Screen" },
      { id: "max-md:h-[calc(100dvh-25%)]", name: "3Qtr Screen" },
      { id: "max-md:w-[calc(100dvh/2)]", name: "Half Screen" },
      { id: "max-md:h-[calc(100dvh-110px)]", name: "Full Screen - NavBar" },
    ];
  } else {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
    ];
  }
};

export const getWidthSelectValues = (blockName?: BlockName) => {
  if (blockName === "carousel") {
    return [
      { id: "w-[100vw]", name: "Screen Width" },
      { id: "w-full", name: "Container Width" },
    ];
  } else {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
    ];
  }
};

export const getMobileWidthSelectValues = (blockName?: BlockName) => {
  if (blockName === "carousel") {
    return [{ id: "w-[440px]", name: "Small 440(W)" }];
  } else {
    return [
      { id: "small", name: "Small" },
      { id: "medium", name: "Medium" },
      { id: "large", name: "Large" },
    ];
  }
};
