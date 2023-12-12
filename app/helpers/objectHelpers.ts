type AnyObject = Record<string, any>;

export const isEmptyObject = (obj: AnyObject): boolean => {
  return Object.keys(obj).length === 0;
};

export const hasTruePropertyStartingWith = (
  prefix: string,
  obj: Record<string, any>
): boolean =>
  Object.entries(obj).some(
    ([key, value]) => key.startsWith(prefix) && value === true
  );
