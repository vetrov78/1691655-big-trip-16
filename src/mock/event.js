import { getRandomInteger } from '../utils/utils';

export const DESTINATIONS = [
  'Chamonix',
  'Geneva',
  'Amsterdam',
  'Stuttgart',
];

export const ALL_TYPES_OFFERS = [
  {
    'type': 'Taxi',
    'offers': [
      {
        'id': 'business',
        'title': 'Upgrade to a business class',
        'price': 120
      }, {
        'id': 'radio',
        'title': 'Choose the radio station',
        'price': 60
      }, {
        'id': 'uber',
        'title': 'Order Uber',
        'price': 20
      }
    ]
  }, {
    'type': 'Bus',
    'offers': [
      {
        'id': 'luggage',
        'title': 'Add luggage',
        'price': 20
      },{
        'id': 'meal',
        'title': 'Add meal',
        'price': 10
      }, {
        'id': 'seats',
        'title': 'Choose seats',
        'price': 5
      }
    ]
  }, {
    'type': 'Train',
    'offers': [
      {
        'id': 'luggage',
        'title': 'Add luggage',
        'price': 20
      },{
        'id': 'meal',
        'title': 'Add meal',
        'price': 10
      }, {
        'id': 'seats',
        'title': 'Choose seats',
        'price': 5
      }, {
        'id': 'comfort',
        'title': 'Switch to comfort class',
        'price': 90
      }
    ]
  }, {
    'type': 'Ship',
    'offers': [
      {
        'id': 'car',
        'title': 'Add car place',
        'price': 120
      },{
        'id': 'meal',
        'title': 'Add meal',
        'price': 10
      }, {
        'id': 'comfort',
        'title': 'Switch to comfort class',
        'price': 70
      }
    ]
  }, {
    'type': 'Drive',
    'offers': [
      {
        'id': 'transponder',
        'title': 'Toll road transponder',
        'price': 65
      },
      {
        'id': 'car',
        'title': 'Rent a car',
        'price': 200
      },
    ]
  }, {
    'type': 'Flight',
    'offers': [
      {
        'id': 'luggage',
        'title': 'Add luggage',
        'price': 30
      }, {
        'id': 'comfort',
        'title': 'Switch to comfort class',
        'price': 100
      }, {
        'id': 'meal',
        'title': 'Add meal',
        'price': 15
      }, {
        'id': 'seats',
        'title': 'Choose seats',
        'price': 5
      }, {
        'id': 'train',
        'title': 'Travel by train',
        'price': 40
      }
    ]
  }, {
    'type': 'Restaurant',
    'offers': [
      {
        'id': 'book',
        'title': 'Book a table',
        'price': 50
      }
    ]
  }
];

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
  // ADD IS OFFER CHECKED OR NOT
  if (currentTypeObject) {
    for (const offer of currentTypeObject.offers) {
      offer.checked = (getRandomInteger() === 1);
    }
  }

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
  DESTINATIONS.forEach((destination) => {
    result.push({
      destination: destination,
      description: generateDescription(),
      photos: generatePhotos(),
    });
  });
  return result;
};

export const generateEvent = () => (
  {
    pointType: generatePointType(),
    destination: generateDestination(),
  }
);
