import { Factory } from 'miragejs';

export default Factory.extend({
  title(i) {
    return `Song ${i}`;
  },

  year() {
    let min = 1950;
    let max = 2019;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  author: 'Rathish',
});
