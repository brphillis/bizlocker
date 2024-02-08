import type { PreviewPage } from "@prisma/client";

export const getOrderBy = (
  sortBy?: string,
  sortOrder?: SortOrder,
  type?: "product",
): { [key: string]: SortOrder } => {
  let sortedBy = sortBy;

  //CASE PRODUCT - POPULARITY
  if (sortBy === "popular" && type === "product") {
    sortedBy = "totalSold";
  }

  //CASE PRODUCT - PRICE
  // handle price sorting after fetching as prices are based on variants
  // set to arbitrary value to prevent errors
  if (sortBy === "price") {
    sortedBy = "name";
  }

  if (sortedBy && sortOrder) {
    return { [sortedBy]: sortOrder };
  }
  return { createdAt: "asc" };
};

export const sortPreviewPages = (
  previewPages: PreviewPage[],
): PreviewPage[] => {
  return previewPages.slice().sort((a, b) => {
    if (!a.publishedAt && !b.publishedAt) return 0; // Both dates are undefined, maintain the order
    if (!a.publishedAt) return 1; // 'a' has no date, so 'b' comes first
    if (!b.publishedAt) return -1; // 'b' has no date, so 'a' comes first
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ); // Compare dates numerically in descending order
  });
};
