import { queryItemAttributes } from './index';

queryItemAttributes('ring', 'ascended', 80)
.then((v) => {
  console.log(v);
}, (e) => console.error(e));
