'use strict';
(function () {
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
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < Math.min(advertsArr.length, 5); i++) {
      fragment.appendChild(createPin(advertsArr[i]));
    }
    pinsContainer.appendChild(fragment);
  };

  // Функция с обработчиком события клика на метку.
  // Вызывает показ карточки объявления с соответствующими данными
  var subscribeClick = function (element, advert) {
    element.addEventListener('click', function () {
      window.card.renderMapPopup(advert);
    });
  };

  var clickPins = function (arrData) {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pin, index) {
      subscribeClick(pin, arrData[index]);
    });
  };

  window.pin = {
    render: renderPins,
    click: clickPins
  };
})();
