type AnyObject = Record<string, any>;

export const isEmptyObject = (obj: AnyObject): boolean => {
  return Object.keys(obj).length === 0;
};
