export const parseVersionPart = (value: number | string): number => {
  const MAX_SEMANTIC_PART_VALUE = 99999;
  const num = parseInt(value as string, 10); // parseInt actually does work with numbers.
  if (Number.isNaN(num) || num > MAX_SEMANTIC_PART_VALUE) {
    throw new Error(`Ooops.. <${value}> doesn't seem to be a valid part of semantic version`);
  }
  return num;
};
