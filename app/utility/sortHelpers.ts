export const getOrderBy = (sortBy?: SortBy, sortOrder?: SortOrder) => {
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
