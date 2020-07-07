'use strict';
(function () {
  var NUMBER_ADVERTS = 5;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsContainer = document.querySelector('.map__pins');

  var createPin = function (pin, index) {
    var pinItem = mapPinTemplate.cloneNode(true);
    pinItem.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
    pinItem.querySelector('img').src = pin.author.avatar;
    pinItem.querySelector('img').alt = pin.offer.title;
    pinItem.dataset.numPin = index;

    return pinItem;
  };

  var renderPins = function (advertsArr) {
    var advertsNumber = advertsArr.length > NUMBER_ADVERTS ? NUMBER_ADVERTS : advertsArr.length;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < advertsNumber; i++) {
      fragment.appendChild(createPin(advertsArr[i]));
    }
    pinsContainer.appendChild(fragment);
  };

  // Вариант - 1
  // var renderPins = function (advertsArr) {
  //   var advertsNumber = advertsArr.length > NUMBER_ADVERTS ? NUMBER_ADVERTS : advertsArr.length;

  //   var fragment = document.createDocumentFragment();
  //   advertsNumber.forEach(function (advert) {
  //     fragment.appendChild(createPin(advert));
  //   });

  //   pinsContainer.appendChild(fragment);
  // };

  // Вариант - 2
  // var renderPins = function (advertsArr) {
  //   var advertsNumber = advertsArr.length > NUMBER_ADVERTS ? NUMBER_ADVERTS : advertsArr.length;

  //   var fragment = document.createDocumentFragment();
  //   advertsArr.forEach(function (advert) {
  //     fragment.appendChild(createPin(advert));
  //   });

  //   pinsContainer.appendChild(fragment);
  // };

  // Функция с обработчиком события клика на метку.
  // Вызывает показ карточки объявления с соответствующими данными
  var subscribeClick = function (element, advert) {
    element.addEventListener('click', function () {
      window.card.renderMapPopup(advert);
    });
  };

  var clickPins = function (arrData) {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pin) {
      subscribeClick(pin, arrData);
    });
  };

  window.pin = {
    renderPins: renderPins,
    clickPins: clickPins
  };
})();
