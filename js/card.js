'use strict';
(function () {
  var advertTemplate = document.querySelector('#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

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
    cardElement.querySelector('.popup__type').textContent = translateTypeOfPlace(advert.offer.type);
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

  window.card = {
    renderMapPopup: renderMapPopup
  };
})();

