import type { PreviewPage } from "@prisma/client";

export const getOrderBy = (
  sortBy?: any,
  sortOrder?: SortOrder
):
  | { createdAt: SortOrder }
  | { totalSold: SortOrder }
  | { name: SortOrder }
  | { title: SortOrder }
  | { index: SortOrder }
  | undefined => {
  if (sortBy && sortOrder) {
    switch (sortBy) {
      case "createdAt":
        return { createdAt: sortOrder };
      case "totalSold":
        return { totalSold: sortOrder };
      case "name":
        return { name: sortOrder };
      case "title":
        return { title: sortOrder };
      case "index":
        return { index: sortOrder };
      default:
        return undefined;
    }
  }
  return undefined;
};

export const sortPreviewPages = (
  previewPages: PreviewPage[]
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
