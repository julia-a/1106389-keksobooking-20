
'use strict';
(function () {
  var coordinates = {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 130,
      max: 630
    }
  };
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
  var advertTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

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

  // Функция, создающая одно объявление
  var createRandomAdvert = function (count) {
    var locationX = window.util.getRandomValueFromRange(coordinates.x.min, coordinates.x.max);
    var locationY = window.util.getRandomValueFromRange(coordinates.y.min, coordinates.y.max);

    var randomAdvert = {
      author: {
        avatar: getRandomAvatar(count),
      },
      offer: {
        title: window.util.getRandomValueFromArr(TITLE),
        address: locationX + ', ' + locationY,
        price: window.util.getRandomValueFromArr(PRICE),
        type: translateTypeOfPlace(window.util.getRandomValueFromArr(TYPE)),
        rooms: window.util.getRandomValueFromArr(ROOMS),
        guests: window.util.getRandomValueFromArr(GUESTS),
        checkin: window.util.getRandomValueFromArr(CHECKIN),
        checkout: window.util.getRandomValueFromArr(CHECKOUT),
        features: window.util.getRandomStringsFromArr(FEATURES, 1, 6),
        description: window.util.getRandomValueFromArr(DESCRIPTION),
        photos: window.util.getRandomStringsFromArr(PHOTOS, 1, 4)
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

  var advertsList = createAdvertsList(TOTAL_ADVERTS);

  // Перед созданием карточки объявления проверяем, не создана ли до этого другая карточка,
  // если да - то предыдущую карточку удаляем
  var removePopup = function () {
    var cardElement = document.querySelector('.map__card');
    if (cardElement !== null) { // если уже открыто одно объявление
      cardElement.remove();
      document.removeEventListener('keydown', onPopupEscapePress);
    }
  };

  // Функция создания карточки объявления
  var renderMapPopup = function (advert) {
    removePopup(); // перед созданием новой карточки запускаем проверку, не создано ли до этого другое объявление
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

  // Функция вывода карточки объекта по клику на пин
  var pinsContainer = document.querySelector('.map__pins')

  pinsContainer.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var parentElement = target.parentElement

    if (parentElement.tagName === 'BUTTON' && advertsList[parentElement.dataset.numPin]) {
      renderMapPopup(advertsList[parentElement.dataset.numPin]);
    }
  });

  window.card = {
    advertsList: advertsList
  };
})();

