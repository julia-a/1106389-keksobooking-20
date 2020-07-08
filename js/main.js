'use strict';
(function () {
  var PIN_WIDTH = 66;
  var PIN_HEIGHT = 86;
  var UNACTIVE_PIN_COORDS = '603, 408';
  var MAIN_PIN_LEFT = '575px';
  var MAIN_PIN_TOP = '375px';
  var HALF_PIN_WIDTH = PIN_WIDTH / 2;
  var MapLimit = {
    TOP: 130 - PIN_HEIGHT,
    RIGHT: 1200 - HALF_PIN_WIDTH,
    BOTTOM: 630 - PIN_HEIGHT,
    LEFT: 0 - HALF_PIN_WIDTH
  };
  var form = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var formFieldsets = form.querySelectorAll('fieldset');
  var formFilters = document.querySelectorAll('[name^=housing-]');
  var addressInput = form.querySelector('input[name=address]');

  addressInput.value = UNACTIVE_PIN_COORDS;

  var toggleDisabled = function (elements, value) {
    elements.forEach(function (element) {
      element.disabled = value;
    });
  };
  toggleDisabled(formFieldsets, true);
  toggleDisabled(formFilters, true);

  // Функция активации страницы
  var activatePage = function () {
    map.classList.remove('map--faded');
    toggleDisabled(formFieldsets, false);
    toggleDisabled(formFilters, false);
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
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pin) {
      pin.remove();
    });
  };

  // Функция для перевода страницы в неактивное состояние
  var deactivatePage = function () {
    deletePins(); // Удаляет пины
    form.reset(); // Очищает данные формы
    mainPin.style.left = MAIN_PIN_LEFT;
    mainPin.style.top = MAIN_PIN_TOP;
    addressInput.value = UNACTIVE_PIN_COORDS;
    map.classList.add('map--faded'); // Деактивирует карту
    toggleDisabled(formFieldsets, true); // Отключает элементы управления формы
    toggleDisabled(formFilters, true); // Отключает элементы управления фильтра
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

      var getCurrentCoords = function (min, max, current) {
        switch (true) {
          case (current > max):
            current = max;
            break;
          case (current < min):
            current = min;
            break;
        }
        return current;
      };

      var currentLeftCoord = getCurrentCoords(MapLimit.LEFT, MapLimit.RIGHT, (mainPin.offsetLeft - shift.x));
      var currentTopCoord = getCurrentCoords(MapLimit.TOP, MapLimit.BOTTOM, (mainPin.offsetTop - shift.y));
      mainPin.style.top = currentTopCoord + 'px';
      mainPin.style.left = currentLeftCoord + 'px';
      addressInput.value = (currentLeftCoord + HALF_PIN_WIDTH) + ', ' + (currentTopCoord + PIN_HEIGHT);
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
