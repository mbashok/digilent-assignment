const { Model } = require("mongoose");
const { CURRENCY_API, CURRENCY_API_KEY } = require("../config");

const convert = function(from, to){
  var requestOptions = {
    method: 'GET',
    headers: {apikey: CURRENCY_API_KEY}
  };
  return fetch(CURRENCY_API + `?amount=1&from=${from}&to=${to}`, requestOptions)
      .then(response => response.json())
      .then(result => result)
      .catch(error => error);
};

module.exports = {
    convert: convert
}