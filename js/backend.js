'use strict';
(function () {
  var SERVER_URL = 'https://javascript.pages.academy/keksobooking';
  var STATUS_SUCCES = 200;
  var TIMEOUT = 10000;

  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCES) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT; // 10s

    return xhr;
  };

  // Функция, получающая данные с сервера
  var load = function (onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('GET', SERVER_URL + '/data');
    xhr.send();
  };

  // Функция, отправляющая данные из формы на сервер
  var upload = function (data, onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  };

  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successPopup = successTemplate.cloneNode(true);
  var errorPopup = errorTemplate.cloneNode(true);


  // Функция "успешного поведения" при загрузке данных с сервера.
  // Ренедерит метки и по клику на метку показывает объявление
  var successHandlerForLoad = function (arrData) {
    window.pin.renderPins(arrData);
    window.pin.clickPins(arrData);
  };

  // Функция "успешного поведения" при отправке данных из формы на сервер
  // Показывает окно об успешной отправке, а затем запускает функцию деактивации страницы
  var successHandlerForUpload = function () {
    main.appendChild(successPopup);
    window.main.deactivatePage();
  };

  successPopup.addEventListener('click', function () {
    successPopup.style.display = 'none';
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      successPopup.style.display = 'none';
      errorPopup.style.display = 'none';
    }
  });

  // Функция, создающая окно с сообщением об ошибке
  var errorHandler = function (errorMessage) {
    var message = errorPopup.querySelector('.error__message');
    message.textContent = errorMessage;
    main.appendChild(errorPopup);
  };

  errorPopup.addEventListener('click', function () {
    errorPopup.style.display = 'none';
  });

  var errorButton = errorPopup.querySelector('.error__button');
  errorButton.addEventListener('click', function () {
    errorPopup.style.display = 'none';
  });

  window.backend = {
    load: load,
    upload: upload,
    successHandlerForLoad: successHandlerForLoad,
    successHandlerForUpload: successHandlerForUpload,
    errorHandler: errorHandler
  };
})();
