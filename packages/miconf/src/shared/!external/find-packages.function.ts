import { join } from 'path';
import { readdirSync, lstatSync } from 'fs';

/**
 * Relative paths and glob patterns like src/* - for now
 */
export const findPackages = (root: string, patterns: string[]): string[] => {
  const result = patterns
    .map(p => {
      const supportedGlob = /^[^*]*(\/\*)?$/;
      if (!supportedGlob.test(p)) throw new Error(`Unsupported glob: <${p}>`);
      if (p.endsWith('*')) {
        const globRoot = p.replace('*', '');
        return readdirSync(join(root, globRoot))
          .map(x => join(root, globRoot, x))
          .filter(x => lstatSync(x).isDirectory())
          .map(packageDir => join(packageDir, 'package.json'));
      }
      const path = join(root, p, 'package.json');
      return [path];
    })
    .reduce((acc, x) => ([...acc, ...x]), []);
  return result;
};

// Example:

// const lernaJson = readObjSync(join(process.cwd(), 'lerna.json')) as any;

// findPackages(process.cwd(), lernaJson.packages as string[])
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
