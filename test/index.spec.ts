import { queryItemAttributes } from '..';

queryItemAttributes('ring', 'ascended', 80)
.then((v) => {
  console.log(v);
}, (e) => console.error(e));
