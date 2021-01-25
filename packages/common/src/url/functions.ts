export const trimEndSlashes = (str: string): string => {
  const endSlashes = /\/+$/.exec(str);
  return endSlashes ? str.substring(0, endSlashes.index) : str;
};

export const trimStartSlashes = (str: string): string => {
  const startSlashes = /^\/+/.exec(str);
  return startSlashes ? str.substring(startSlashes[0].length) : str;
};

export const trimSlashes = (str: string): string => trimEndSlashes(trimStartSlashes(str));

export const joinUrl = (...p: string[]): string => `/${
  p
    .map(trimSlashes)
    .filter(x => x)
    .join('/')}`;
