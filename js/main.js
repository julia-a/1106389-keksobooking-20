'use strict';
(function () {
  var borderCoords = {
    top: 130,
    bottom: 630,
    left: 50,
    right: 1090
  };
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
  var activationPage = function () {
    map.classList.remove('map--faded');
    removeDisabledAttribute(fieldset);
    form.classList.remove('ad-form--disabled');
    window.backend.load(successHandler, errorHandler);
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

      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      setBorders();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // функция, устанавливающая границы передвижения метки по карте
  var setBorders = function () {
    if (mainPin.offsetTop < borderCoords.top) {
      mainPin.style.top = borderCoords.top + 'px';
    } else if (mainPin.offsetTop > borderCoords.bottom) {
      mainPin.style.top = borderCoords.bottom + 'px';
    } else if (mainPin.offsetLeft < borderCoords.left) {
      mainPin.style.left = borderCoords.left + 'px';
    } else if (mainPin.offsetLeft > borderCoords.right) {
      mainPin.style.left = borderCoords.right + 'px';
    }
  };
})();

