import { fetchDb } from './database';
import { DB_FILE } from './loadDb';
import { writeFileSync } from 'fs';

async function main() {
  const allInfo = await fetchDb();
  writeFileSync(DB_FILE, JSON.stringify(allInfo));
}

main().then(() => console.log('done'), (e) => console.error(e));
