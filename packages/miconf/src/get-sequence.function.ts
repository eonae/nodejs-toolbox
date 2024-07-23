export const getSequence = <T>(arr: T[], from: number, to: number): T[] => {
  const result: T[] = [];
  const increment = from <= to ? 1 : -1;

  for (let i = from; i !== to + increment; i += increment) {
    result.push(arr[i]);
  }
  return result;
};
