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
