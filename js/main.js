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
  var form = document.querySelector('.ad-form');
  var formElements = form.querySelectorAll('fieldset');
  var filtersElements = document.querySelectorAll('[name^=housing-]');
  var rect = document.querySelector('.map__overlay').getBoundingClientRect();
  // Границы доступной области для перемещения метки
  var MIN_COORD = {
    X: PinSetting.MIN_X - PinSetting.HALF_WIDTH,
    Y: PinSetting.MIN_Y - PinSetting.HALF_HEIGHT
  };
  var MAX_COORD = {
    X: rect.width - PinSetting.HALF_WIDTH,
    Y: PinSetting.MAX_Y - PinSetting.HALF_HEIGHT
  };
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

  var toggleDisabledElements = function (elements, value) {
    elements.forEach(function (element) {
      element.disabled = value;
    });
  };
  toggleDisabledElements(formElements, true);
  toggleDisabledElements(filtersElements, true);

  // Функция активации страницы
  var activatePage = function () {
    map.classList.remove('map--faded');
    toggleDisabledElements(formElements, false);
    toggleDisabledElements(filtersElements, false);
    startMainPinPosition();
    form.classList.remove('ad-form--disabled');
    window.backend.load(window.filters.successHandlerForLoad, window.backend.errorHandler);
    window.form.syncRoomsGuests(); // Синхронизирует поля кол-во комнат/кол-во мест
    window.photo.changeImages(); // Запускает обработчики событий изменения аватара и добавления фотографий объекта
  };

  // Обработчик для активации страницы левой (основной) кнопкой мыши
  mainPin.addEventListener('mousedown', function (evt) {
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

  // Функция удаления пинов из разметки (за исключением главной метки)
  var deletePins = function () {
    var pinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinElements.forEach(function (pin) {
      pin.remove();
    });
  };

  // Функция для перевода страницы в неактивное состояние
  var deactivatePage = function () {
    deletePins(); // Удаляет пины
    form.reset(); // Очищает данные формы
    startMainPinPosition(); // Выводит координаты основной метки в форму (в поле Адрес)
    map.classList.add('map--faded'); // Деактивирует карту
    toggleDisabledElements(formElements, true); // Отключает элементы управления формы
    toggleDisabledElements(filtersElements, true); // Отключает элементы управления фильтра
    window.photo.cleanImages(); // Сбрасывает аватар и фотографии объекта на состояние по умолчанию
    window.photo.removeImages(); // Удаляет обработчики событий изменения аватара и добавления фотографий объекта
    form.classList.add('ad-form--disabled'); // Деактивирует форму
  };

  // Функция, реализующая передвижение главной метки (mainPin) по карте
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

  window.main = {
    deletePins: deletePins,
    deactivatePage: deactivatePage
  };
})();
