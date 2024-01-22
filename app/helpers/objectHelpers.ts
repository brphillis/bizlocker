type AnyObject = Record<string, any>;

export const isEmptyObject = (obj: AnyObject): boolean => {
  return Object.keys(obj).length === 0;
};

export const hasTruePropertyStartingWith = (
  prefix: string,
  obj: Record<string, any>,
): boolean =>
  Object.entries(obj).some(
    ([key, value]) => key.startsWith(prefix) && value === true,
  );

export const searchObjectByKey = (
  obj: AnyObject,
  key: string,
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

export const sanitizeObject = (
  obj: Record<string, any>,
): Record<string, any> => {
  const sanitizedObject: Record<string, any> = { ...obj };

  for (const key in sanitizedObject) {
    if (
      Array.isArray(sanitizedObject[key]) &&
      sanitizedObject[key].length === 0
    ) {
      delete sanitizedObject[key];
    } else if (
      typeof sanitizedObject[key] === "object" &&
      sanitizedObject[key] !== null
    ) {
      sanitizedObject[key] = sanitizeObject(sanitizedObject[key]);
      if (Object.keys(sanitizedObject[key]).length === 0) {
        delete sanitizedObject[key];
      }
    }
  }

  return sanitizedObject;
};
