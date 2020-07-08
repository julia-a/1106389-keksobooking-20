'use strict';
(function () {
  var SERVER_URL = 'https://javascript.pages.academy/keksobooking';
  var STATUS_SUCCES = 200;
  var TIMEOUT = 10000;
  var main = document.querySelector('main');

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

  // Функция "успешного поведения" при отправке данных из формы на сервер
  // Показывает сообщение об успешной отправке, а затем запускает функцию деактивации страницы
  var successHandlerForUpload = function () {
    onSuccess();
    window.main.deactivatePage();
  };

  var onSuccess = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success').cloneNode(true);

    var removeSuccessMessage = function () {
      successTemplate.remove();
      document.removeEventListener('keydown', onSuccessMessageEscPress);
      document.removeEventListener('click', onSuccessMessageClick);
    };

    var onSuccessMessageEscPress = function (evt) {
      if (evt.key === window.data.escape) {
        removeSuccessMessage();
      }
    };

    var onSuccessMessageClick = function () {
      removeSuccessMessage();
    };

    main.appendChild(successTemplate);
    document.addEventListener('keydown', onSuccessMessageEscPress);
    document.addEventListener('click', onSuccessMessageClick);
  };

  // Функция, обрабатывающая ситуацию возникновения ошибки
  var errorHandler = function (errorMessage) {
    onError(errorMessage);
  };

  var onError = function (errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var message = errorTemplate.querySelector('.error__message');

    var errorButton = errorTemplate.querySelector('.error__button');
    var removeErrorMessage = function () {
      errorTemplate.remove();
      document.removeEventListener('keydown', onErrorMessageEscPress);
      document.removeEventListener('click', onErrorMessageClick);
    };

    var onErrorMessageEscPress = function (evt) {
      if (evt.key === window.data.escape) {
        removeErrorMessage();
      }
    };

    var onErrorMessageClick = function () {
      removeErrorMessage();
    };

    message.textContent = errorMessage;
    main.appendChild(errorTemplate);
    errorButton.addEventListener('click', onErrorMessageClick);
    document.addEventListener('keydown', onErrorMessageEscPress);
    document.addEventListener('mousedown', onErrorMessageClick);
  };

  window.backend = {
    load: load,
    upload: upload,
    successHandlerForUpload: successHandlerForUpload,
    errorHandler: errorHandler
  };
})();
