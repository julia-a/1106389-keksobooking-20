'use strict';

var advert = {
  OFFER: {
    TITLE: [
      'Заголовок 1',
      'Заголовок 2',
      'Заголовок 3'
    ],
    ADDRESS: [
      '600, 350',
      '700, 450',
      '500, 250',
      '800, 350',
      //Правильно ли задано?
    ],
    PRICE: [
      100,
      200,
      300,
      400
    ],
    TYPE: [
      'palace',
      'flat ',
      'house',
      'bungalo'
    ],
    ROOMS: [
      1,
      2
    ],
    GUESTS: [
      1,
      2,
      3,
      4
    ],
    CHECKIN: [
      '12:00',
      '13:00',
      '14:00'
    ],
    CHECKOUT: [
      '12:00',
      '13:00',
      '14:00'
    ],
    FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],
    DESCRIPTION: [
      'Описание'
    ],
  },
  LOCATION: {
    //Как задать?
  }
};

// Шаг 1. Функция создания массива объявлений

// Вспомогательная функция нахождения случайного числа,
// для последующей генерации составных частей объявления
var getRandomItem = function (arr) {
  return Math.floor(Math.random() * arr.length);
}

var createRandomAdvert = function (count) {
  var randomAdvert = {
    author: {
      avatar: 'img/avatars/user0' + (count + 1) + '.png',
    },
    offer: {
      title: getRandomItem(advert.OFFER.TITLE),
      address: getRandomItem(advert.OFFER.ADDRESS),
      price: getRandomItem(advert.OFFER.PRICE),
      type: getRandomItem(advert.OFFER.TYPE),
      rooms: getRandomItem(advert.OFFER.ROOMS),
      guests: getRandomItem(advert.OFFER.GUESTS),
      checkin: getRandomItem(advert.OFFER.CHECKIN),
      checkout: getRandomItem(advert.OFFER.CHECKOUT),
      features: getRandomItem(advert.OFFER.FEATURES),
      description: getRandomItem(advert.OFFER.DESCRIPTION),
      photos: 'http://o0.github.io/assets/images/tokyo/hotel' + (count + 1) + '.jpg'
    },
    location: {
      //Как описать?
    }
  };

  return randomAdvert;
}

var createAdvertsList = function (count) {
  var list = [];
  for (var i = 0; i < count; i++) {
    list[i] = createRandomAdvert(i);
  }
  return list;
}


// Шаг 2. Переключение карты из неактивного состояния в активное
var map = document.querySelector('.map');
map.classList.remove('map--faded');


// Шаг 3. Создание DOM-элементов соответствующих меткам на карте
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var createPin = function (advert) {
  var pinItem = mapPinTemplate.cloneNode(true);
  pinItem.style = 'left: ' + advert.location.x + 'px; top: ' + advert.location.y + 'px;';
  pinItem.querySelector('img').src = advert.author.avatar;
  pinItem.querySelector('img').alt = advert.offer.title;

  return pinItem;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  fragment.appendChild(createPin(advert[i]));
}
map.querySelector('.map__pins').appendChild(fragment);
