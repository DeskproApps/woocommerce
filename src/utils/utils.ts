export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectValue = (obj: any, keyString: string) => {
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
