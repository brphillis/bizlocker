//useful for checking if a content item has connections
export const hasNonEmptyArrayObjectOrIdKey = (
  obj: Record<string, any> | null | undefined
): boolean => {
  obj = obj ?? {};

  const hasNonEmptyArray = Array.isArray(obj) && obj.length > 0;

  const hasNonEmptyObject =
    typeof obj === "object" && obj !== null && Object.keys(obj).length > 0;

  const hasIdKeyNotNull = Object.keys(obj).some(
    (key) =>
      key.toLowerCase().includes("id") &&
      key.toLowerCase() !== "id" &&
      obj?.[key] !== null
  );

  return hasNonEmptyArray || hasNonEmptyObject || hasIdKeyNotNull;
};
