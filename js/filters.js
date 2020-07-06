'use strict';
(function () {
  var DEFAULT_VALUE = 'any';
  var advertsData = [];
  var adverts = [];
  var mapFilters = document.querySelector('.map__filters');
  var housingType = document.querySelector('#housing-type');

  // Функция "успешного поведения" при загрузке данных с сервера.
  // Ренедерит метки с учётом выбранного фильтра
  var successHandlerForLoad = function (data) {
    advertsData = data;
    window.pin.renderPins(advertsData);
    window.pin.clickPins(advertsData);
  };

  var getHousingType = function (advert) {
    return housingType.value === DEFAULT_VALUE ? true : advert.offer.type === housingType.value;
  };

  var getFilterData = function () {
    adverts = advertsData.slice(0);
    adverts = adverts.filter(function (advert) {
      return getHousingType(advert);
    });
  };

  var removePopup = function () {
    var cardElement = document.querySelector('.map__card');
    if (cardElement) {
      cardElement.remove();
    }
  };

  var reload = window.debounce(function () {
    getFilterData();
    removePopup();
    window.main.deletePins();
    window.pin.renderPins(adverts);
    window.pin.clickPins(adverts);
  });

  mapFilters.addEventListener('change', reload);

  window.filters = {
    successHandlerForLoad: successHandlerForLoad
  };
})();
