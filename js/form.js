'use strict';
(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var form = document.querySelector('.ad-form');
  var offerTitle = form.querySelector('#title');
  var offerAddress = form.querySelector('#address');
  var offerChcekIn = form.querySelector('#timein');
  var offerChcekOut = form.querySelector('#timeout');
  var offerPriceForNight = form.querySelector('#price');
  var prices = {
    bungalo: {
      value: 0,
      max: 1000000
    },
    flat: {
      value: 1000,
      max: 1000000
    },
    house: {
      value: 5000,
      max: 1000000
    },
    palace: {
      value: 10000,
      max: 1000000
    }
  };
  var offerTypeOfHousing = form.querySelector('#type');
  var offerRoomNumber = form.querySelector('#room_number');
  var numberOfRooms = form.elements.rooms;
  var numberOfBeds = form.elements.capacity;

  // Валидация поля «Заголовок»
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
      offerTitle.setCustomValidity('Введите ещё ' + (MIN_TITLE_LENGTH - valueLength) + ' символов');
    } else if (valueLength > MAX_TITLE_LENGTH) {
      offerTitle.reportValidity();
      offerTitle.setCustomValidity('Введите ещё ' + (MIN_TITLE_LENGTH - valueLength) + ' символов');
    } else {
      offerTitle.setCustomValidity(''); // Передает пустую строку, что означает что поле заполнено правильно
    }
  });

  // Ставим стартовые координаты в поле «Адрес»
  var putMainPinPositionToAddress = function (x, y) {
    offerAddress.value = x + ', ' + y;
  };

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
    }
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
        offerPriceForNight.setAttribute('value', prices.bungalo.value);
        offerPriceForNight.setAttribute('min', prices.bungalo.value);
        offerPriceForNight.setAttribute('max', prices.bungalo.max);
        break;
      case 'flat':
        offerPriceForNight.setAttribute('value', prices.bungalo.value);
        offerPriceForNight.setAttribute('min', prices.bungalo.value);
        offerPriceForNight.setAttribute('max', prices.bungalo.max);
        break;
      case 'house':
        offerPriceForNight.setAttribute('value', prices.house.value);
        offerPriceForNight.setAttribute('min', prices.house.value);
        offerPriceForNight.setAttribute('max', prices.house.max);
        break;
      case 'palace':
        offerPriceForNight.setAttribute('value', prices.palace.value);
        offerPriceForNight.setAttribute('min', prices.palace.value);
        offerPriceForNight.setAttribute('max', prices.palace.max);
        break;
    }
  };
  offerTypeOfHousing.addEventListener('change', syncPriceForNigth);

  // Отдельная проверка значения указанного в поле «Цена за ночь»
  var validationPrice = function (evt) {
    var inputPriceForNight = evt.target;

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

  window.form = {
    syncRoomsGuests: syncRoomsGuests,
    putMainPinPositionToAddress: putMainPinPositionToAddress
  };
})();
