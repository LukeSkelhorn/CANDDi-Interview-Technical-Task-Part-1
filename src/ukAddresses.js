const { parseOptions } = require('commander');

function UKAddresses(knwl) {
  this.languages = {
    //supported languages
    english: true,
  };

  this.calls = function () {
    var words = knwl.words.get('linkWordsCasesensitive'), //get the String as an array of words
      results = [],
      test = /(\b[A-Z]{1,2}\d{1,2}( ?\d?[A-Z]{2})?)(?=,|$)/;

    for (var i = 0; i < words.length; i++) {
      if (words[i].match(test)) {
        if (words[i].length === 2 || words[i].length === 3) {
          const secondPart = words[i + 1];
          if (secondPart.includes('<')) {
            const mod = secondPart.split('<')[0];
            if (mod.length === 2 || mod.length === 3) {
              const postalCode = `${words[i]} ${mod}`;
              const addressObj = {
                address: postalCode,
                preview: knwl.tasks.preview(i),
                found: i,
              };
              results.push(addressObj);
            }
          }
        }
      }
    }

    return results;
  };
  var addresses = this;
}

module.exports = UKAddresses;
