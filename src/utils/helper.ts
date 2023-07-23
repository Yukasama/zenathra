export const Formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function Timer() {
  let timeStart = new Date().getTime();
  return {
    get seconds() {
      const seconds =
        Math.ceil((new Date().getTime() - timeStart) / 1000) + "s";
      return seconds;
    },
    get ms() {
      const ms = new Date().getTime() - timeStart + "ms";
      return ms;
    },
  };
}

export function Years(startYear: number) {
  const currentYear: number = new Date().getFullYear();
  const years: string[] = [];
  for (let year = startYear; year <= currentYear - 1; year++) {
    years.push(year.toString());
  }
  return years;
}

export function MergeArrays(
  arrays: Record<string, any>[][]
): Record<string, any>[] {
  if (
    !Array.isArray(arrays) ||
    !arrays.every((array) => Array.isArray(array))
  ) {
    return [];
  }

  const result: Record<string, any>[] = [];
  for (const array of arrays) {
    if (!array.every((item) => typeof item === "object" && item.date)) {
      throw new Error(
        "Each sub-array must contain objects with a 'date' property."
      );
    }

    for (const item of array) {
      const existingItem = result.find((i) => i.date === item.date);
      if (existingItem) {
        Object.assign(existingItem, item);
      } else {
        result.push(item);
      }
    }
  }
  return result;
}

export async function Timeout(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, Number(ms) * 1000));
}
