'use strict';
(function () {
  var PRICES = {
    min: 10000,
    max: 50000
  };

  var mapFilters = document.querySelector('.map__filters');

  var updatePins = function (offers) {
    var filteredOffers = offers.slice();
    var selectorFilters = mapFilters.querySelectorAll('select');
    var featureFilters = mapFilters.querySelectorAll('input[type="checkbox"]:checked');

    var filterRules = {
      'housing-type': 'type',
      'housing-rooms': 'rooms',
      'housing-guests': 'guests'
    };

    var filterByValue = function (select, property) {
      return filteredOffers.filter(function (offerData) {
        return offerData.offer[property].toString() === select.value;
      });
    };

    var filterByPrice = function (priceFilter) {
      return filteredOffers.filter(function (offerData) {

        var priceFilterValues = {
          'middle': offerData.offer.price >= PRICES.min && offerData.offer.price < PRICES.max,
          'low': offerData.offer.price < PRICES.min,
          'high': offerData.offer.price >= PRICES.max
        };

        return priceFilterValues[priceFilter.value];
      });
    };

    var filterByFeatures = function (item) {
      return filteredOffers.filter(function (offerData) {
        return offerData.offer.features.indexOf(item.value) >= 0;
      });
    };

    if (selectorFilters.length !== null) {
      selectorFilters.forEach(function (item) {
        if (item.value !== 'any') {
          if (item.id !== 'housing-price') {
            filteredOffers = filterByValue(item, filterRules[item.id]);
          } else {
            filteredOffers = filterByPrice(item);
          }
        }
      });
    }

    if (featureFilters !== null) {
      featureFilters.forEach(function (item) {
        filteredOffers = filterByFeatures(item);
      });
    }

    if (filteredOffers.length) {
      window.pin.render(filteredOffers);
    }
  };

  var filterMapAds = function (offers) {
    window.card.removePopup();
    window.main.deletePins();
    updatePins(offers);
  };

  window.filter = {
    filterMapAds: filterMapAds
  };
})();
