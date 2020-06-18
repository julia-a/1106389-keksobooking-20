'use strict';

// ЗАДАНИЕ 3 (Часть 1). Отобразить похожие объявления на карте

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

// Вспомогательная функция, перевод на русский типа объекта
var translateTypeOfPlace = function (englishType) {
  var translate = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  return translate[englishType];
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
      type: translateTypeOfPlace(getRandomValueFromArr(TYPE)),
      rooms: getRandomValueFromArr(ROOMS),
      guests: getRandomValueFromArr(GUESTS),
      checkin: getRandomValueFromArr(CHECKIN),
      checkout: getRandomValueFromArr(CHECKOUT),
      features: getRandomStringsArr(FEATURES, 1, 6),
      description: getRandomValueFromArr(DESCRIPTION),
      photos: getRandomStringsArr(PHOTOS, 1, 4)
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

// Шаг 2. Создание DOM-элементов соответствующих меткам на карте
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var advertsList = createAdvertsList(TOTAL_ADVERTS);

var createPin = function (pin, index) {
  var pinItem = mapPinTemplate.cloneNode(true);
  pinItem.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
  pinItem.querySelector('img').src = pin.author.avatar;
  pinItem.querySelector('img').alt = pin.offer.title;
  pinItem.dataset.numPin = index;
  return pinItem;
};

var pinsContainer = document.querySelector('.map__pins');

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(createPin(pins[i], i));
  }
  pinsContainer.appendChild(fragment);
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

  // Закрытие объявления по клику на крестик
  var closeButton = cardElement.querySelector('.popup__close');
  closeButton.addEventListener('click', function () {
    cardElement.remove();
    document.removeEventListener('keydown', onPopupEscapePress);
  });
  document.addEventListener('keydown', onPopupEscapePress);
};

// Закрытие объявления по нажатию на ESC
var onPopupEscapePress = function (evt) {
  var cardElement = document.querySelector('.map__card');
  if (evt.key === 'Escape') {
    cardElement.remove();
    document.removeEventListener('keydown', onPopupEscapePress);
  }
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

// ЗАДАНИЕ 4 (Часть 1). Реализация сценария переключения режимов страницы

/* Функция отключения элементов управления формы,
через поиск всех тегов fieldset на странице index.html
и добавления им атрибута disabled  */

var form = document.querySelector('.ad-form');
var fieldsetElement = document.querySelectorAll('fieldset');
var map = document.querySelector('.map');
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
  form.classList.remove('ad-form--disabled');
  renderPins(advertsList);
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


// Функция вывода карточки объекта по клику на пин
var currentPin = pinsContainer.addEventListener('click', function (evt) {
  evt.preventDefault();
  var target = evt.target;
  var parentElement = target.parentElement

  if (parentElement.tagName === 'BUTTON') {
    renderMapPopup(advertsList[parentElement.dataset.numPin]);
  }
});

// Валидация формы
var offerTitle = form.querySelector('#title');
var offerChcekIn = form.querySelector('#timein');
var offerChcekOut = form.querySelector('#timeout');
var offerPriceForNight = form.querySelector('#price');
var offerTypeOfHousing = form.querySelector('#type');
var offerRoomNumber = form.querySelector('#room_number');
var numberOfRooms = form.elements.rooms;
var numberOfBeds = form.elements.capacity;

// Поле «Заголовок»
var MIN_TITLE_LENGTH = 30;
var MAX_TITLE_LENGTH = 100;

offerTitle.addEventListener('invalid', function () {
  if (offerTitle.validity.valueMissing) {
    offerTitle.setCustomValidity('Введите, пожалуйста, заголовок объявления. Это поле обязательно для заполнения');
  } else {
    offerTitle.setCustomValidity('');
  }
});

offerTitle.addEventListener('input', function () {
  var valueLength = offerTitle.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    offerTitle.reportValidity();
    offerTitle.setCustomValidity('Введите ещё ' + (MIN_TITLE_LENGTH - valueLength) +' символов');
  } else if (valueLength > MAX_TITLE_LENGTH) {
    offerTitle.reportValidity();
    offerTitle.setCustomValidity('Введите ещё ' + (MIN_TITLE_LENGTH - valueLength) +' символов');
  } else {
    offerTitle.setCustomValidity(''); // Передает пустую строку, что означает что поле заполнено правильно
  }
});

// Синхронизация полей «Время заезда и выезда»
var syncCheckInOut = function (chcekInValue, chcekOutValue) {
  switch (chcekInValue.value) {
    case '12:00':
      chcekOutValue.value = chcekInValue.value;
      break;
    case '13:00':
      chcekOutValue.value = chcekInValue.value;
      break;
    case '14:00':
      chcekOutValue.value = chcekInValue.value;
      break;
  };
};

offerChcekIn.addEventListener('change', function () {
  syncCheckInOut(offerChcekIn, offerChcekOut);
});
offerChcekOut.addEventListener('change', function () {
  syncCheckInOut(offerChcekOut, offerChcekIn);
});

// Синхронизация полей «Тип жилья» и «Цена за ночь»
var syncPriceForNigth = function () {
  switch (offerTypeOfHousing.value) {
    case 'bungalo':
      offerPriceForNight.setAttribute('value', 0);
      offerPriceForNight.setAttribute('min', 0);
      offerPriceForNight.setAttribute('max', 1000000);
      break;
    case 'flat':
      offerPriceForNight.setAttribute('value', 1000);
      offerPriceForNight.setAttribute('min', 1000);
      offerPriceForNight.setAttribute('max', 1000000);
      break;
    case 'house':
      offerPriceForNight.setAttribute('value', 5000);
      offerPriceForNight.setAttribute('min', 5000);
      offerPriceForNight.setAttribute('max', 1000000);
      break;
    case 'palace':
      offerPriceForNight.setAttribute('value', 10000);
      offerPriceForNight.setAttribute('min', 10000);
      offerPriceForNight.setAttribute('max', 1000000);
      break;
  }
};

offerTypeOfHousing.addEventListener('change', syncPriceForNigth);

// Отдельная проверка значения указанного в поле «Цена за ночь»
var validationPrice = function () {
  if (inputPriceForNight.validity.rangeUnderflow) {
    offerPriceForNight.setCustomValidity('Стоимость жилья не может быть ниже рекомендованной');
  } else if (offerPriceForNight.validity.rangeOverflow) {
    offerPriceForNight.setCustomValidity('Цена не должна превышать 1 000 000');
  } else if (offerPriceForNight.validity.valueMissing) {
    offerPriceForNight.setCustomValidity('Введите, пожалуйста, цену');
  } else {
    offerPriceForNight.setCustomValidity('');
  }
};

offerPriceForNight.addEventListener('invalid', validationPrice);

// Синхронизация полей «Количество комнат» и «Количество мест»
var setOptionsForRoomsGuests = function () {
  for (var i = 0; i < numberOfRooms.options.length; i++) {
    if (numberOfBeds.options[i].hasAttribute('disabled', 'disabled')) {
      numberOfBeds.options[i].removeAttribute('disabled', false);
    }
    if (numberOfBeds.options[i].hasAttribute('selected', true)) {
      numberOfBeds.options[i].removeAttribute('selected');
    }
  }
};

var syncRoomsGuests = function () {
  setOptionsForRoomsGuests();
  switch (numberOfRooms.value) {
    case '1':
      numberOfBeds.options[0].disabled = true;
      numberOfBeds.options[1].disabled = true;
      numberOfBeds.options[3].disabled = true;
      numberOfBeds.options[2].selected = true;
      break;
    case '2':
      numberOfBeds.options[0].disabled = true;
      numberOfBeds.options[3].disabled = true;
      numberOfBeds.options[2].selected = true;
      break;
    case '3':
      numberOfBeds.options[3].disabled = true;
      numberOfBeds.options[2].selected = true;
      break;
    case '100':
      numberOfBeds.options[0].disabled = true;
      numberOfBeds.options[1].disabled = true;
      numberOfBeds.options[2].disabled = true;
      numberOfBeds.options[3].selected = true;
      break;
  }
};

offerRoomNumber.addEventListener('change', syncRoomsGuests);
