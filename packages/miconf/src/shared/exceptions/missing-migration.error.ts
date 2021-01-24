import { NeededMigration } from '../migrations';

export class MissingMigrationError extends Error {
  constructor (migrations: NeededMigration[]) {
    const list = migrations.map(x => `${x.from.toString()} -> ${x.to.toString()}`);
    super(`Migrations not found:\n${list.join('\n')}`);
  }
}
