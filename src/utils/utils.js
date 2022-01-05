import dayjs from 'dayjs';
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


export const getRandomString = (length = 10) => (
  (Math.random() + 1).toString(length)
);

export const getDurationString = (durationInMinutes) => {
  const days = Math.floor(durationInMinutes / 1440);
  const hours = Math.floor((durationInMinutes - days * 1440) / 60);
  const minutes = durationInMinutes - days * 1440 - hours * 60;

  const daysDisplay = days > 0 ? `0${days}D`.slice(-3) : '';
  const houtsDisplay = (hours > 0) || (days > 0) ? `0${hours}H`.slice(-3) : '';
  const minutesDisplay = `0${minutes}M`.slice(-3);

  return `${daysDisplay} ${houtsDisplay} ${minutesDisplay}`;
};

export const isEscPressed = (evt) => (evt.key === 'Escape' || evt.key === 'Esc');

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const sortStartTimeDown = (pointA, pointB) => {
  const {date_from: dateFromA} = pointA;
  const {date_from: dateFromB} = pointB;

  return dayjs(dateFromA).isAfter(dateFromB) ? 1 : -1;
};

export const sortTimeDown = (pointA, pointB) => {
  const {date_from: dateFromA, date_to: dateToA} = pointA;
  const {date_from: dateFromB, date_to: dateToB} = pointB;
  const durationInMinutesA = dayjs(dateToA).diff(dayjs(dateFromA), 'm');
  const durationInMinutesB = dayjs(dateToB).diff(dayjs(dateFromB), 'm');

  return durationInMinutesB - durationInMinutesA;
};
