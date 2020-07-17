'use strict';
(function () {
  var PINS_LIMIT = 5;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsContainer = document.querySelector('.map__pins');

  var createPin = function (pin) {
    var pinItem = mapPinTemplate.cloneNode(true);
    pinItem.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
    pinItem.querySelector('img').src = pin.author.avatar;
    pinItem.querySelector('img').alt = pin.offer.title;

    pinItem.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.card.renderMapPopup(pin);
    });
    return pinItem;
  };

  var renderPins = function (advertsArr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < Math.min(advertsArr.length, PINS_LIMIT); i++) {
      fragment.appendChild(createPin(advertsArr[i]));
    }
    pinsContainer.appendChild(fragment);
  };

  window.pin = {
    render: renderPins
  };
})();
