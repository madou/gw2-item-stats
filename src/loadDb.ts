export const DB_FILE = './itemstat-db.json';

export function loadDb() {
  return require('../itemstat-db.json');
}

export default loadDb;
