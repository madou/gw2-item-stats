import { fetchDb } from './database';
import { writeFileSync } from 'fs';

async function main() {
  const allInfo = await fetchDb();
  writeFileSync("./itemstat-db.json", JSON.stringify(allInfo));
}

main().then(() => console.log('done'), (e) => console.error(e));
