import moment from 'moment';

let date;
let min = 0;

setInterval(() => {
  //date = moment(new Date(2017, 7, 21, 12, 50, 0)).add(min, 'hours').toDate();
  date = new Date();
  min++;
}, 1000)

export const Clock = () => {
  return date;
}
