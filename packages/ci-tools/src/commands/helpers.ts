import sh, { ExecOptions } from 'shelljs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const execAsync = (cmd: string, opts: ExecOptions = {}): Promise<any> =>
  new Promise((resolve, reject) => {
    sh.exec(cmd, opts, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
