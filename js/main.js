'use strict';
(function () {
  var PinSetting = {
    HALF_WIDTH: 33,
    HALF_HEIGHT: 33,
    MIN_X: 0,
    MAX_X: 600,
    MIN_Y: 130,
    MAX_Y: 630
  };
  // Границы доступной области для перемещения метки
  var MIN_COORD = {
    X: PinSetting.MIN_X - PinSetting.HALF_WIDTH,
    Y: PinSetting.MIN_Y - PinSetting.HALF_HEIGHT
  };
  var MAX_COORD = {
    X: PinSetting.MAX_X - PinSetting.HALF_WIDTH,
    Y: PinSetting.MAX_Y - PinSetting.HALF_HEIGHT
  };
  var form = document.querySelector('.ad-form');
  var fieldset = document.querySelectorAll('fieldset');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var isActive = false;

  // Стартовые координаты главной метки
  var startMainPinPosition = function () {
    var x = 0;
    var y = 0;

    if (isActive) {
      x = mainPin.offsetLeft + PinSetting.HALF_HEIGHT;
      y = mainPin.offsetTop + PinSetting.HALF_HEIGHT + PinSetting.TAIL_HEIGHT;
    } else {
      x = mainPin.offsetLeft + PinSetting.HALF_WIDTH;
      y = mainPin.offsetTop + PinSetting.HALF_HEIGHT;
    }
    window.form.putMainPinPositionToAddress(x, y);
  };

  // Функция отключения элементов управления формы, через поиск всех тегов fieldset
  // на странице index.html и добавления им атрибута disabled
  var addDisabledAttribute = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = true;
    }
  };
  addDisabledAttribute(fieldset);

  // Функция удаления атрибута disabled
  var removeDisabledAttribute = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = false;
    }
  };

  // Функция с обработчиком события клика на метку.
  // Вызывает показ карточки объявления с соответствующими данными
  var subscribeClick = function (element, advert) {
    element.addEventListener('click', function () {
      window.card.renderMapPopup(advert);
    });
  };

  var clickPins = function (arrData) {
    var mapPinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapPinElements.length; i++) {
      subscribeClick(mapPinElements[i], arrData[i]);
    }
  };

  // Функция "успешного поведения" при загрузке данных с сервера.
  // Ренедерит метки и по клику на метку показывает объявление
  var successHandler = function (arrData) {
    window.pin.renderPins(arrData);
    clickPins(arrData);
  };

  // Функция обработки ошибок при загрузке данных с сервера,
  // через добавление сообщения в имеющийся в разметке шаблон/template
  var errorHandler = function (errorMessage) {
    var template = document.querySelector('#error');
    var message = template.content.querySelector('.error__message');
    message.textContent = errorMessage;
    document.body.appendChild(template.content.cloneNode(true));
  };

  // Функция активации страницы
  var activatePage = function () {
    map.classList.remove('map--faded');
    removeDisabledAttribute(fieldset);
    startMainPinPosition();
    form.classList.remove('ad-form--disabled');
    window.backend.load(successHandler, errorHandler);
    window.form.syncRoomsGuests();
  };

  // Обработчик для активации страницы левой (основной) кнопкой мыши
  mainPin.addEventListener('mouseup', function (evt) {
    if (evt.which === 1) {
      activatePage();
    }
  });

  // Обработчик для активации страницы с клавиатуры, клавишей enter
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      activatePage();
    }
  });

  // Функция для перевода страницы в неактивное состояние
  var deactivatePage = function () {
    map.classList.add('map--faded'); // Деактивируем карту
    addDisabledAttribute(fieldset);
  };

  // Функция реализующая передвижение главной метки (mainPin) по карте
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Координаты точки начала движния
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var coordinates = {
        x: mainPin.offsetLeft - shift.x, // Обновляем координаты после смещения мыши
        y: mainPin.offsetTop - shift.y
      };

      if (coordinates.x < MIN_COORD.X) { // Проверяем, не заходит ли метка за рамки
        coordinates.x = MIN_COORD.X;
      } else if (coordinates.x > MAX_COORD.X) {
        coordinates.x = MAX_COORD.X;
      }

      if (coordinates.y < MIN_COORD.Y) {
        coordinates.y = MIN_COORD.Y;
      } else if (coordinates.y > MAX_COORD.Y) {
        coordinates.y = MAX_COORD.Y;
      }

      mainPin.style.top = coordinates.y + 'px'; // Получаем новые координаты после смещения
      mainPin.style.left = coordinates.x + 'px';

      startMainPinPosition(coordinates.x, coordinates.y);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.backend = {
    deactivatePage: deactivatePage
  };
})();

