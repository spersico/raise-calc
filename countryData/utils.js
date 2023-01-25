const countries = require('world-countries');
const path = require('path');

const fs = require('fs');
const { writeFile } = fs.promises;

const allCountries = countries
  .map(
    ({
      cca2,
      currencies,
      cioc,
      cca3,
      region,
      subregion,
      name: { common, native },
      languages,
      latlng,
    }) => ({
      codes: { cca2, cioc, cca3 },
      names: [
        common,
        ...Object.keys(native)
          .filter((key) => key !== 'eng' && native[key].common !== common)
          .map((key) => native[key].common),
      ],
      geo: { region, subregion, latlng },
      languages,
      currencies,
    })
  )
  .sort((a, b) => a.names[0] - b.names[0]);

const storeProviderData = async (
  provider,
  countryCode,
  data,
  preference = 999
) => {
  return writeFile(
    `./countryData/data/providers/${provider}${countryCode ? '-' + countryCode : ''
    }.json`,
    JSON.stringify({
      meta: {
        updatedAt: new Date().toISOString(),
        provider,
        preference,
      },
      data,
    })
  );
};

/**
 * Promise all
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */
function promiseAllP(items, block) {
  var promises = [];
  items.forEach(function (item, index) {
    promises.push(
      (function (item, i) {
        return new Promise(function (resolve, reject) {
          return block.apply(this, [item, index, resolve, reject]);
        });
      })(item, index)
    );
  });
  return Promise.all(promises);
}

/**
 * read files
 * @param dirname string
 * @return Promise
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @see http://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
 */
function readFiles(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, function (err, filenames) {
      if (err) return reject(err);
      promiseAllP(filenames, (filename, index, resolve, reject) => {
        fs.readFile(
          path.resolve(dirname, filename),
          'utf8',
          function (err, content) {
            if (err) return reject(err);
            return resolve({ filename: filename, contents: content });
          }
        );
      })
        .then((results) => {
          return resolve(results);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  });
}

module.exports = {
  readFiles,
  storeProviderData,
  log: (title, extradata) =>
    console.log(`${title} at ${new Date().toISOString()}`),
  allCountries,
};
