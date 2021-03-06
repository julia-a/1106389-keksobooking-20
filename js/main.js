'use strict';
(function () {
  var PIN_WIDTH = 66;
  var PIN_HEIGHT = 86;
  var UNACTIVE_PIN_COORDS = '603, 408';
  var MAIN_PIN_LEFT = '575px';
  var MAIN_PIN_TOP = '375px';
  var HALF_PIN_WIDTH = PIN_WIDTH / 2;
  var MAP_TOP = 130 - PIN_HEIGHT;
  var MAP_RIGHT = 1200 - HALF_PIN_WIDTH;
  var MAP_BOTTOM = 1260 - 630 - PIN_HEIGHT;
  var MAP_LEFT = 0 - HALF_PIN_WIDTH;
  var advertsData = [];
  var form = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var formFieldsets = form.querySelectorAll('fieldset');
  var formFilters = document.querySelectorAll('[name^=housing-]');
  var addressInput = form.querySelector('#address');
  var mapFilters = document.querySelector('.map__filters');

  addressInput.value = UNACTIVE_PIN_COORDS;
  window.data.toggleDisabled(formFieldsets, true);
  window.data.toggleDisabled(formFilters, true);

  var onMapFiltersChange = function () {
    window.filter.filterMapAds(advertsData);
  };

  // Функция активации страницы
  var activatePage = function () {
    map.classList.remove('map--faded');
    window.data.toggleDisabled(formFieldsets, false);
    window.data.toggleDisabled(formFilters, false);
    form.classList.remove('ad-form--disabled');
    window.form.setPriceForHousingType();
    window.form.onRoomsAndGuestsChange(); // Синхронизирует поля кол-во комнат/кол-во мест
    window.photo.changeImages(); // Запускает обработчики событий изменения аватара и добавления фотографий объекта
    window.backend.load(onLoadSuccess, window.backend.onDataError);
    mapFilters.addEventListener('change', window.debounce(onMapFiltersChange));
  };

  var onLoadSuccess = function (adverts) {
    advertsData = adverts;
    window.pin.render(advertsData);
  };

  var onMainPinClick = function () {
    if (map.classList.contains('map--faded')) {
      activatePage();
    }
  };

  // Обработчик для активации страницы левой (основной) кнопкой мыши
  mainPin.addEventListener('mousedown', function (evt) {
    if (evt.which === window.data.keyMouseLeft) {
      onMainPinClick();
    }
  });

  // Обработчик для активации страницы с клавиатуры, клавишей enter
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === window.data.enter) {
      onMainPinClick();
    }
  });

  // Функция удаления пинов из разметки (за исключением главной метки)
  var deletePins = function () {
    var pinsItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinsItems.forEach(function (pin) {
      pin.remove();
    });
  };

  // Функция для перевода страницы в неактивное состояние
  var deactivatePage = function () {
    deletePins(); // Удаляет пины
    window.card.removePopup(); // Удаляет карточки объявлений
    form.reset(); // Очищает данные формы
    mapFilters.reset();
    addressInput.value = UNACTIVE_PIN_COORDS;
    mainPin.style.left = MAIN_PIN_LEFT;
    mainPin.style.top = MAIN_PIN_TOP;
    map.classList.add('map--faded'); // Деактивирует карту
    window.data.toggleDisabled(formFieldsets, true); // Отключает элементы управления формы
    window.data.toggleDisabled(formFilters, true); // Отключает элементы управления фильтра
    window.photo.cleanImages(); // Сбрасывает аватар и фотографии объекта на состояние по умолчанию
    window.photo.removeImages(); // Удаляет обработчики событий изменения аватара и добавления фотографий объекта
    form.classList.add('ad-form--disabled'); // Деактивирует форму
  };

  // Функция "успешного поведения" при отправке данных из формы на сервер
  // Показывает сообщение об успешной отправке, а затем запускает функцию деактивации страницы
  var onFormUpload = function () {
    window.backend.onSuccess();
    deactivatePage();
  };

  var onFormReset = function () {
    deactivatePage();
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
        if (current > max) {
          current = max;
        } else if (current < min) {
          current = min;
        }
        return current;
      };

      var currentLeftCoord = getCurrentCoords(MAP_LEFT, MAP_RIGHT, (mainPin.offsetLeft - shift.x));
      var currentTopCoord = getCurrentCoords(MAP_TOP, MAP_BOTTOM, (mainPin.offsetTop - shift.y));
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
    deactivatePage: deactivatePage,
    onFormUpload: onFormUpload,
    onFormReset: onFormReset,
    onLoadSuccess: onLoadSuccess,
    onMapFiltersChange: onMapFiltersChange
  };
})();
