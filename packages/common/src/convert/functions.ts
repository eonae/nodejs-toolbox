const enumMembers = (e: unknown, get: 'keys' | 'values'): Array<string | number> => {
  const numeric = Object.values(e)
    .filter(v => typeof v === 'number')
    .map(n => `${n}`);
  return Object.entries(e)
    .filter(([key]) => !numeric.includes(key))
    .map(pair => pair[get === 'keys' ? 0 : 1] as string | number);
};

export const enumKeys = (e: unknown): string[] => enumMembers(e, 'keys') as string[];

export const enumValues = (e: unknown): Array<string | number> => enumMembers(e, 'values');
