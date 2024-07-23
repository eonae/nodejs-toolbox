import type { ExecOptions } from 'shelljs';
import sh from 'shelljs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const execAsync = (cmd: string, opts: ExecOptions = {}): Promise<any> =>
  new Promise((resolve, reject) => {
    sh.exec(cmd, opts, (code, stdout, stderr) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });
  });
