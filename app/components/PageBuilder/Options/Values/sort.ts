import type { BlockName } from "~/utility/blockMaster/types";

export const sortOrderSelectValues = [
  { id: "asc", name: "Ascending" },
  { id: "desc", name: "Descending" },
];

export const returnCorrectSortByValues = (
  selectedBlock: BlockName
): SelectValue[] => {
  switch (selectedBlock) {
    case "product":
      return [
        { id: "name", name: "Name" },
        { id: "totalSold", name: "Total Sold" },
        { id: "price", name: "Price" },
        { id: "createdAt", name: "CreatedAt" },
      ];

    case "article":
      return [
        { id: "title", name: "Title" },
        { id: "createdAt", name: "CreatedAt" },
      ];

    default:
      return [
        { id: "title", name: "Title" },
        { id: "createdAt", name: "CreatedAt" },
      ];
  }
};
