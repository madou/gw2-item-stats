import { readFile } from 'fs';
export const DB_FILE = './itemstat-db.json';

export function loadDb() {
  return new Promise<string>((resolve, reject) => {
    readFile(DB_FILE, 'utf-8', (err, value) => {
      err && reject(err);
      resolve(value.toString());
    });
  })
  .then((v) => JSON.parse(v));
}

export default loadDb;
