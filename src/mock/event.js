import { ALL_TYPES_OFFERS, DESTINATIONS } from '../const';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generatePointType = () => {
  const types = [
    'Taxi',
    'Bus',
    'Train',
    'Ship',
    'Drive',
    'Flight',
    'Check-in',
    'Sightseeing',
    'Restaurant',
  ];

  const randomIndex = getRandomInteger(0, types.length - 1);
  const type = types[randomIndex];

  const currentTypeObject = ALL_TYPES_OFFERS.find((element) => element.type === type);

  return {
    type: type,
    offers: currentTypeObject ? currentTypeObject['offers'] : ''
  };
};

const generateDestination = () => (
  DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)]
);


const generateDescription = () => {
  const MAX_SENTENCES_IN_DESCRIPTION = 5;

  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const sentencesArray = text.match(/[^.!?]+[.!?]+/g);
  const shuffledArray = sentencesArray.sort(() => 0.5 - Math.random());

  return  shuffledArray.slice(0, getRandomInteger(1, MAX_SENTENCES_IN_DESCRIPTION));
};

const generatePhotos = () => {
  const MAX_NUMBER = 1000;
  const numberPhotos = getRandomInteger(1, 6);
  const getRandomPhoto = () => (
    `http://picsum.photos/248/152?r=${Math.floor(Math.random() * MAX_NUMBER)}`
  );

  return Array.from({length: numberPhotos}, getRandomPhoto);
};

// RELATION BETWEEN POINT NAME - DESCRIPTION AND PHOTOS
export const relationNameDescription = () => {
  const result = [];
  let item = {};
  for (const destination of DESTINATIONS) {
    item ={};
    item.destination = destination;
    item.description = generateDescription();
    item.photos = generatePhotos();
    result.push(item);
  }

  return result;
};

export const generateEvent = () => (
  {
    pointType: generatePointType(),
    destination: generateDestination(),
  }
);
