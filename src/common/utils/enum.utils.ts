/**
 * Generic function to get the name of an enum value.
 * @param enumObj - The enum object.
 * @param value - The enum value.
 * @returns The name of the enum value.
 */
export function getEnumName<T>(enumObj: T, value: T[keyof T]): string {
  return enumObj[value as keyof T] as unknown as string;
}

/**
 * Utility function to convert an enum to an array of select options.
 * @param enumObj - The enum object.
 * @returns An array of select options with `label` and `value` properties.
 */
export function getEnumSelectOptions<T extends object>(
  enumObj: T
): { label: string; value: string }[] {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // Filter out the numeric keys
    .map((key) => ({
      label: key,
      value: `${enumObj[key as keyof T] as unknown as string}`, // Use the enum value as the value
    }));
}

export const formatValueSelectToEnum = <T>(
  value: string,
  enumObject: { [s: string]: T }
): T => {
  const enumKey = Object.keys(enumObject).find(
    (key) => enumObject[key as any] === parseInt(value)
  );
  const enumValue = enumKey
    ? enumObject[enumKey as keyof typeof enumObject]
    : enumObject[Object.keys(enumObject)[0]]; // Default to the first enum value if not found

  return enumValue;
};
