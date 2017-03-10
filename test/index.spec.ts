import { queryItemAttributes } from '..';

Promise.resolve()
.then(() => queryItemAttributes('ring', 'ascended', 80))
.then((v) => {
  console.log(v);
}, (e) => console.error(e));
