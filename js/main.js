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

// Шаг 1. Создание массива объявлений

// Функция, создающая одно объявление
var createRandomAdvert = function (count) {

  var locationX = getRandomValueFromRange(300, 900);
  var locationY = getRandomValueFromRange(130, 630);

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
    list.push(createRandomAdvert(i));
  }
  return list;
};

// // Шаг 2. Переключение карты из неактивного состояния в активное
// var map = document.querySelector('.map');
// map.classList.remove('map--faded');


// // Шаг 3. Создание DOM-элементов соответствующих меткам на карте
// var mapPinTemplate = document.querySelector('#pin')
//   .content
//   .querySelector('.map__pin');

// var advertsList = createAdvertsList(TOTAL_ADVERTS);

// var createPin = function (pin) {
//   var pinItem = mapPinTemplate.cloneNode(true);
//   pinItem.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
//   pinItem.querySelector('img').src = pin.author.avatar;
//   pinItem.querySelector('img').alt = pin.offer.title;

//   return pinItem;
// };

// var renderPins = function (pins) {
//   var fragment = document.createDocumentFragment();
//   for (var i = 0; i < pins.length; i++) {
//     fragment.appendChild(createPin(pins[i]));
//   }
//   map.querySelector('.map__pins').appendChild(fragment);
// };

// renderPins(advertsList);

// ЗАДАНИЕ 4. Обработка событий (Часть 1)

/* Функция отключения элементов управления формы,
через поиск всех тегов fieldset на странице index.html
и добавления им атрибута disabled  */

var noticeForm = document.querySelector('.notice__form');
var fieldsetElement = document.querySelectorAll('fieldset');
var mainPin = document.querySelector('.map__pin--main');

var addDisabledAttribute = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = true;
  }
};
addDisabledAttribute(fieldsetElement);

// Функция удаления атрибута disabled
var removeDisabledAttribute = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = false;
  }
};

// Функция активации страницы
var activationPage = function () {
  map.classList.remove('map--faded');
  removeDisabledAttribute(fieldsetElement);
  noticeForm.classList.remove('notice__form--disabled');
};

// Обработчик для активации страницы левой (основной) кнопкой мыши
mainPin.addEventListener('mouseup', function (evt) {
  if (evt.which === 1) {
    activationPage();
  };
});

// Обработчик для активации страницы с клавиатуры, клавишей enter
mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 13) {
    activationPage();
  };
});
