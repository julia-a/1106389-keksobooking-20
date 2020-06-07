'use strict';

var TITLE = ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'];
var PRICE = [100, 200, 300, 400];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS = [1, 2, 3];
var GUESTS = [1, 2, 3, 4];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = ['Описание 1', 'Описание 2', 'Описание 3'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var TOTAL_ADVERTS = 8;

// Вспомогательная функция, создающая аватар
var getRandomAvatar = function (index) {
  return 'img/avatars/user0' + (index + 1) + '.png';
};

// Вспомогательная функция, возвращающая случайный элемент из массива
var getRandomValueFromArr = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Вспомогательная функция, возвращающая случайное число из заданного диапазона
var getRandomValueFromRange = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Вспомогательная функция, создающая массив строк
var getRandomStringsArr = function (arr, min, max) {
  var newStringsArr = arr.slice();
  newStringsArr.length = getRandomValueFromRange(min, max);
  return newStringsArr;
};

var locationX = getRandomValueFromRange(300, 900);
var locationY = getRandomValueFromRange(130, 630);

// Шаг 1. Создание массива объявлений

// Функция, создающая одно объявление
var createRandomAdvert = function (count) {
  var randomAdvert = {
    author: {
      avatar: getRandomAvatar(count),
    },
    offer: {
      title: getRandomValueFromArr(TITLE),
      address: locationX + ', ' + locationY,
      price: getRandomValueFromArr(PRICE),
      type: getRandomValueFromArr(TYPE),
      rooms: getRandomValueFromArr(ROOMS),
      guests: getRandomValueFromArr(GUESTS),
      checkin: getRandomValueFromArr(CHECKIN),
      checkout: getRandomValueFromArr(CHECKOUT),
      features: getRandomStringsArr(FEATURES, 1, 6),
      description: getRandomValueFromArr(DESCRIPTION),
      photos: getRandomStringsArr(PHOTOS, 1, 5)
    },
    location: {
      x: locationX,
      y: locationY,
    }
  };

  return randomAdvert;
};

// Функция, создающая массив объявлений (в колличестве равном count)
var createAdvertsList = function (count) {
  var list = [];
  for (var i = 0; i < count; i++) {
    list.push(createRandomAdvert());
  }
  return list;
};
console.log(createAdvertsList(8))

// Шаг 2. Переключение карты из неактивного состояния в активное
var map = document.querySelector('.map');
map.classList.remove('map--faded');


// Шаг 3. Создание DOM-элементов соответствующих меткам на карте
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var createPin = function () {
  var pinItem = mapPinTemplate.cloneNode(true);
  pinItem.style = 'left: ' + createRandomAdvert.location.x + 'px; top: ' + createRandomAdvert(i).location.y + 'px;';
  pinItem.querySelector('img').src = createRandomAdvert(i).author.avatar;
  pinItem.querySelector('img').alt = createRandomAdvert(i).offer.title;

  return pinItem;
};

var renderPins = function(advertsCount) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertsCount; i++) {
    fragment.appendChild(createPin(createAdvertsList[i]));
  }
  map.querySelector('.map__pins').appendChild(fragment);
};

renderPins(TOTAL_ADVERTS);
