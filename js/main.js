'use strict';

// ЗАДАНИЕ 3 (Часть 1). Отобразить похожие объявления на карте

var TITLE = ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'];
var PRICE = [100, 200, 300, 400];
var TYPE = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var ROOMS = [1, 2, 3];
var GUESTS = [1, 2, 3, 4];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = ['Описание 1', 'Описание 2', 'Описание 3'];
var PHOTOS = [
  'https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_25_b.jpg',
  'https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_27_b.jpg',
  'https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_17_b.jpg',
  'https://cdn.ostrovok.ru/t/x500/mec/hotels/11000000/10360000/10357700/10357605/10357605_30_b.jpg',
  'https://cdn.ostrovok.ru/t/x500/mec/hotels/10000000/9160000/9151200/9151174/9151174_1_b.jpg',
  'https://cdn.ostrovok.ru/t/x500/mec/hotels/10000000/9160000/9151200/9151174/9151174_12_b.jpg',
  'https://cdn.ostrovok.ru/t/x500/mec/hotels/10000000/9160000/9151200/9151174/9151174_5_b.jpg'
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
      photos: getRandomStringsArr(PHOTOS, 1, 7)
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

// Шаг 2. Переключение карты из неактивного состояния в активное
var map = document.querySelector('.map');
// map.classList.remove('map--faded');


// Шаг 3. Создание DOM-элементов соответствующих меткам на карте
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var advertsList = createAdvertsList(TOTAL_ADVERTS);

var createPin = function (pin) {
  var pinItem = mapPinTemplate.cloneNode(true);
  pinItem.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
  pinItem.querySelector('img').src = pin.author.avatar;
  pinItem.querySelector('img').alt = pin.offer.title;

  return pinItem;
};

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(createPin(pins[i]));
  }
  map.querySelector('.map__pins').appendChild(fragment);
};

// ЗАДАНИЕ 3 (Часть 2). Создать карточку объявления
var advertTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
var mapFiltersContainer = document.querySelector('.map__filters-container');

// Функция создания карточки объявления
var renderMapPopup = function (advert) {
  var cardElement = advertTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = advert.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = advert.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = advert.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  cardElement.querySelector('.popup__features').textContent = advert.offer.description;
  cardElement.querySelector('.popup__avatar').src = advert.author.avatar;
  renderPhotoContainer(cardElement, advert.offer.photos);
  mapFiltersContainer.insertAdjacentElement('beforebegin', cardElement);
};

// Функция проверки контейнера на наличие в нем фотографий
var renderPhotoContainer = function (cardElement, photos) {
  var cardPhotos = cardElement.querySelector('.popup__photos');
  if (cardPhotos.length === 0) {
    cardPhotos.remove(); // Удаление/скрытие блока с фотографиями в случае отсутствия фотографий
  } else {
    renderPhotos(cardPhotos, photos); // Заполнение контейнера массивом фотографий
  }
};

// Создание массива фотографий
var renderPhotos = function (popupPhotos, photos) {
  var firstImage = popupPhotos.querySelector('.popup__photo');
  var fragment = document.createDocumentFragment();
  firstImage.remove();

  for (var i = 0; i < photos.length; i++) {
    var cloneImage = firstImage.cloneNode(true);
    cloneImage.src = photos[i];
    fragment.appendChild(cloneImage);
  }
  popupPhotos.appendChild(fragment);
};

renderPins(advertsList);
renderMapPopup(advertsList[0]);

// ЗАДАНИЕ 4 (Часть 1). Реализация сценария переключения режимов страницы

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
  if (evt.key === 'Enter') {
    activationPage();
  };
});


