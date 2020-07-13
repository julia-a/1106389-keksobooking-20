'use strict';
(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var form = document.querySelector('.ad-form');
  var offerTitle = form.querySelector('#title');
  var offerCheckIn = form.querySelector('#timein');
  var offerCheckOut = form.querySelector('#timeout');
  var offerPriceForNight = form.querySelector('#price');
  var prices = {
    bungalo: {
      value: 0,
      min: 0,
      max: 1000000
    },
    flat: {
      value: 1000,
      min: 1000,
      max: 1000000
    },
    house: {
      value: 5000,
      min: 5000,
      max: 1000000
    },
    palace: {
      value: 10000,
      min: 10000,
      max: 1000000
    }
  };
  var offerTypeOfHousing = form.querySelector('#type');
  var offerRoomNumber = form.querySelector('#room_number');
  var numberOfRooms = form.elements.rooms;
  var numberOfBeds = form.elements.capacity;
  var resetButton = form.querySelector('.ad-form__reset');

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

  // Синхронизация полей «Время заезда и выезда»
  var onCheckInAndOutChange = function (checkInValue, checkOutValue) {
    switch (checkInValue.value) {
      case '12:00':
        checkOutValue.value = checkInValue.value;
        break;
      case '13:00':
        checkOutValue.value = checkInValue.value;
        break;
      case '14:00':
        checkOutValue.value = checkInValue.value;
        break;
    }
  };
  offerCheckIn.addEventListener('change', function () {
    onCheckInAndOutChange(offerCheckIn, offerCheckOut);
  });
  offerCheckOut.addEventListener('change', function () {
    onCheckInAndOutChange(offerCheckOut, offerCheckIn);
  });

  // Синхронизация полей «Тип жилья» и «Цена за ночь»
  var onTypeOfHousingChange = function () {
    switch (offerTypeOfHousing.value) {
      case 'bungalo':
        offerPriceForNight.setAttribute('placeholder', prices.bungalo.value);
        offerPriceForNight.setAttribute('min', prices.bungalo.min);
        offerPriceForNight.setAttribute('max', prices.bungalo.max);
        break;
      case 'flat':
        offerPriceForNight.setAttribute('placeholder', prices.flat.value);
        offerPriceForNight.setAttribute('min', prices.flat.min);
        offerPriceForNight.setAttribute('max', prices.flat.max);
        break;
      case 'house':
        offerPriceForNight.setAttribute('placeholder', prices.house.value);
        offerPriceForNight.setAttribute('min', prices.house.min);
        offerPriceForNight.setAttribute('max', prices.house.max);
        break;
      case 'palace':
        offerPriceForNight.setAttribute('placeholder', prices.palace.value);
        offerPriceForNight.setAttribute('min', prices.palace.min);
        offerPriceForNight.setAttribute('max', prices.palace.max);
        break;
    }
  };
  offerTypeOfHousing.addEventListener('change', onTypeOfHousingChange);


  // Отдельная проверка значения указанного в поле «Цена за ночь»
  var onPriceInputChange = function (evt) {
    var inputPriceForNight = evt.target;

    if (inputPriceForNight.validity.rangeUnderflow) {
      offerPriceForNight.setCustomValidity('Стоимость жилья не может быть ниже рекомендованной');
    } else if (inputPriceForNight.validity.rangeOverflow) {
      offerPriceForNight.setCustomValidity('Цена не должна превышать 1 000 000');
    } else if (inputPriceForNight.validity.valueMissing) {
      offerPriceForNight.setCustomValidity('Введите, пожалуйста, цену');
    } else {
      offerPriceForNight.setCustomValidity('');
    }
  };
  offerPriceForNight.addEventListener('invalid', onPriceInputChange);

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

  var onRoomsAndGuestsChange = function () {
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
  offerRoomNumber.addEventListener('change', onRoomsAndGuestsChange);

  // Отправка данных из формы на сервер и обработка этого события,
  // через вызов дополнительных функций при успешной/неуспешной отправке
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), window.backend.onFormUpload, window.backend.onDataError);
  });

  // Перевод страницы в неактивное состояние при клике на кнопку формы - "Очистить"
  // Отменяет действие кнопки reset по-умолчанию и вызывает функцию деактивации страницы
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.main.onFormUpload();
  });

  window.form = {
    onRoomsAndGuestsChange: onRoomsAndGuestsChange
  };
})();

