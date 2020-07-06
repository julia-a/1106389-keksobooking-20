'use strict';
(function () {
  var DEFAULT_VALUE = 'any';
  var LOW_PRICE = 'low';
  var MIDDLE_PRICE = 'middle';
  var HIGHT_PRICE = 'high';
  var HousingPrice = {
    LOW_MAX: 10000,
    MIDDLE_MIN: 10000,
    MIDDLE_MAX: 50000,
    HIGHT_MIN: 50000
  };
  var advertsData = [];
  var adverts = [];
  var mapFilters = document.querySelector('.map__filters');
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');


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

  var getHousingPrice = function (advert) {
    switch (housingPrice.value) {
      case (LOW_PRICE):
        return advert.offer.price < HousingPrice.LOW_MAX;

      case (MIDDLE_PRICE):
        return advert.offer.price >= HousingPrice.MIDDLE_MIN && advert.offer.price < HousingPrice.MIDDLE_MAX;

      case (HIGHT_PRICE):
        return advert.offer.price >= HousingPrice.HIGHT_MIN;
    }
    return true;
  };

  var getHousingRooms = function (advert) {
    return housingRooms.value === DEFAULT_VALUE ? true : advert.offer.rooms.toString() === housingRooms.value;
  };

  var getHousingGuests = function (advert) {
    return housingGuests.value === DEFAULT_VALUE ? true : advert.offer.guests.toString() === housingGuests.value;
  };

  var getHousingFeatures = function (advert) {
    var checkedFeatures = housingFeatures.querySelectorAll('input:checked');
    var checkedFeaturesArray = Array.from(checkedFeatures);
    return checkedFeaturesArray.every(function (feature) {
      return advert.offer.features.includes(feature.value);
    });
  };

  var getFilterData = function () {
    adverts = advertsData.slice(0);
    adverts = adverts.filter(function (advert) {
      return getHousingType(advert) && getHousingPrice(advert) && getHousingRooms(advert) && getHousingGuests(advert) && getHousingFeatures(advert)
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
