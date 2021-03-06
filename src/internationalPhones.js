(function () {
  var InternationalPhones, phoneFormat;

  phoneFormat = require('phoneformat.js');

  module.exports = InternationalPhones = function (knwlInstance) {
    this.validateAndFormat = function (numbers) {
      var countryCode, detectedCountryCode, i, len, number, validatedNumbers;
      validatedNumbers = [];
      for (i = 0, len = numbers.length; i < len; i++) {
        number = numbers[i];
        if (number.indexOf('+' === 0 || number.indexOf('00'))) {
          detectedCountryCode = phoneFormat.countryForE164Number(number);
          if (detectedCountryCode.length > 0) {
            countryCode = detectedCountryCode;
          }
        }
        if (countryCode == null && knwlInstance.language !== 'unknown') {
          countryCode = knwlInstance.language;
        }
        try {
          if (phoneFormat.isValidNumber(number, countryCode)) {
            validatedNumbers.push({
              number: phoneFormat.formatE164(countryCode, number),
              country: countryCode,
            });
          }
        } catch (undefined) {}
      }
      return validatedNumbers;
    };
    this.calls = function () {
      var gram, gramString, gramStrings, i, index, ref, words;
      words = knwlInstance.words.get('linkWords');
      gramStrings = [];
      for (
        index = i = 0, ref = words.length - 4;
        0 <= ref ? i <= ref : i >= ref;
        index = 0 <= ref ? ++i : --i
      ) {
        gram = words.slice(index, index + 4);
        gramString = gram.join().replace(/[^\/\d+]/g, '');
        if (
          gramString !== gramStrings[gramStrings.length - 1] &&
          gramString.length > 5
        ) {
          gramStrings.push(gramString);
        }
      }
      return this.validateAndFormat(gramStrings);
    };
  };
}.call(this));
