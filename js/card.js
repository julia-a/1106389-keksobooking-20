'use strict';
(function () {
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

  // Функция, создающая одно объявление
  var createRandomAdvert = function (count) {

    var locationX = window.util.getRandomValueFromRange(300, 900);
    var locationY = window.util.getRandomValueFromRange(130, 630);

    var randomAdvert = {
      author: {
        avatar: window.util.getRandomAvatar(count),
      },
      offer: {
        title: window.util.getRandomValueFromArr(TITLE),
        address: locationX + ', ' + locationY,
        price: window.util.getRandomValueFromArr(PRICE),
        type: window.util.translateTypeOfPlace(getRandomValueFromArr(TYPE)),
        rooms: window.util.getRandomValueFromArr(ROOMS),
        guests: window.util.getRandomValueFromArr(GUESTS),
        checkin: window.util.getRandomValueFromArr(CHECKIN),
        checkout: window.util.getRandomValueFromArr(CHECKOUT),
        features: window.util.getRandomStringsArr(FEATURES, 1, 6),
        description: window.util.getRandomValueFromArr(DESCRIPTION),
        photos: window.util.getRandomStringsArr(PHOTOS, 1, 4)
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

  // Функция вывода карточки объекта по клику на пин
  var currentPin = window.pin.pinsContainer.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var parentElement = target.parentElement

    if (parentElement.tagName === 'BUTTON') {
      renderMapPopup(advertsList[parentElement.dataset.numPin]);
    }
  });
})();

