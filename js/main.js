'use strict';
(function () {
  var form = document.querySelector('.ad-form');
  var fieldset = document.querySelectorAll('fieldset');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  /* Функция отключения элементов управления формы,
  через поиск всех тегов fieldset на странице index.html
  и добавления им атрибута disabled  */
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

  // Функция активации страницы
  var activationPage = function () {
    map.classList.remove('map--faded');
    removeDisabledAttribute(fieldset);
    form.classList.remove('ad-form--disabled');
    window.pin.renderPins(window.card.advertsList);
    window.form.syncRoomsGuests();
  };

  // Обработчик для активации страницы левой (основной) кнопкой мыши
  mainPin.addEventListener('mouseup', function (evt) {
    if (evt.which === 1) {
      activationPage();
    };
  });

  // Обработчик для активации страницы с клавиатуры, клавишей enter
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      activationPage();
    };
  });
})();
