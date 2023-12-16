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

export const searchObjectByKey = (
  obj: AnyObject,
  key: string
): any | undefined => {
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }

  for (const objKey in obj) {
    if (obj.hasOwnProperty(objKey) && typeof obj[objKey] === "object") {
      const nestedResult = searchObjectByKey(obj[objKey], key);
      if (nestedResult !== undefined) {
        return nestedResult;
      }
    }
  }

  return undefined;
};
