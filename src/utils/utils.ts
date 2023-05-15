/* eslint-disable @typescript-eslint/no-explicit-any */
export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValueFromObjectDotNotation = (obj: any, keyString: string) => {
  const keys = keyString.split(".");

  let value = obj;

  for (const key of keys) {
    value = value[key];

    if (value === undefined) {
      return undefined;
    }
  }

  return value;
};

export const makeFirstLetterUppercase = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const formatDateSince = (date: Date) => {
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
  const yearDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
  const monthDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 30));
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (yearDiff > 0) return `${yearDiff}y`;

  if (monthDiff > 0) return `${monthDiff}mo`;

  return `${dayDiff}d`;
};

export const objectToDotNotation = (
  obj: { [key: string]: any },
  prefix = ""
) => {
  const dotNotationObj = {};

  for (const key in obj) {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(dotNotationObj, objectToDotNotation(obj[key], prefixedKey));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      dotNotationObj[prefixedKey] = obj[key];
    }
  }

  return dotNotationObj;
};

export const dotNotationToObject = (
  dotNotationObj: Record<string, any>
): Record<string, any> => {
  const obj: Record<string, any> = {};

  for (const key in dotNotationObj) {
    const keys = key.split(".");
    let currentObj: Record<string, any> = obj;

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];

      if (i === keys.length - 1) {
        currentObj[currentKey] = dotNotationObj[key];
      } else {
        currentObj[currentKey] = currentObj[currentKey] || {};
        currentObj = currentObj[currentKey];
      }
    }
  }

  return obj;
};

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
