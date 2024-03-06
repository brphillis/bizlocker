type AnyObject = Record<string, unknown>;

export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const hasTruePropertyStartingWith = (
  prefix: string,
  obj: Record<string, unknown>,
): boolean =>
  Object.entries(obj).some(
    ([key, value]) => key.startsWith(prefix) && value === true,
  );

export const searchObjectByKey = (
  obj: AnyObject,
  key: string,
): unknown | undefined => {
  if (key in obj) {
    return obj[key];
  }

  for (const objKey in obj) {
    if (objKey in obj && typeof obj[objKey] === "object") {
      //@ts-expect-error:unknown expected
      const nestedResult = searchObjectByKey(obj[objKey], key);
      if (nestedResult !== undefined) {
        return nestedResult;
      }
    }
  }

  return undefined;
};

export const sanitizeObject = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  const sanitizedObject: Record<string, unknown> = { ...obj };

  for (const key in sanitizedObject) {
    if (
      Array.isArray(sanitizedObject[key]) &&
      //@ts-expect-error:unknown expected
      sanitizedObject[key].length === 0
    ) {
      delete sanitizedObject[key];
    } else if (
      typeof sanitizedObject[key] === "object" &&
      sanitizedObject[key] !== null
    ) {
      //@ts-expect-error:unknown expected
      sanitizedObject[key] = sanitizeObject(sanitizedObject[key]);
      //@ts-expect-error:unknown expected
      if (Object.keys(sanitizedObject[key]).length === 0) {
        delete sanitizedObject[key];
      }
    }
  }

  return sanitizedObject;
};

export const objectToNumber = (obj: object): number => {
  const jsonString = JSON.stringify(obj);
  const hash = jsonString.split("").reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0);
    return acc & acc; // Ensure it's a 32-bit signed integer
  }, 0);
  return hash;
};

// export const stringifyObject = (obj: unknown): string => {
//   const replacer = (key: string, value: any) => {
//     if (value instanceof TransactionInstruction) {
//       // Convert TransactionInstruction to serializable format
//       return {
//         keys: value.keys.map((keyObj: any) => keyObj.toString()),
//         programId: value.programId.toString(),
//         data: value.data.toString("hex"),
//       };
//     } else if (value instanceof PublicKey) {
//       // Convert PublicKey to base58 representation
//       return value.toBase58();
//     }
//     return value;
//   };

//   return JSON.stringify(obj, replacer);
// };

export const parseObject = (jsonString: string): unknown => {
  return JSON.parse(jsonString, (key, value) => {
    if (typeof value === "string" && /^function\s*\(/.test(value)) {
      // If the string looks like a function, parse it as a function
      return eval(`(${value})`);
    }
    return value;
  });
};
