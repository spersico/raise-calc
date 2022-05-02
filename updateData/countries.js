const countries = require('world-countries');

const fullCountries = countries
  .map(
    ({
      cca2,
      currencies,
      cioc,
      cca3,
      region,
      subregion,
      name: { common: standard, native },
      languages,
      altSpellings,
      latlng,
    }) => ({
      codes: { cca2, cioc, cca3 },
      names: {
        standard,
        native: Object.keys(native)
          .filter((key) => key !== 'eng' && native[key].common !== standard)
          .map((key) => native[key].common),
        altSpellings,
      },
      geo: { region, subregion, latlng },
      languages,
      currencies,
    })
  )
  .sort((a, b) => a.names.standard - b.names.standard);

const fullCountryList = (countries, cpis) =>
  countries
    .map(({ codes, names }) => {
      const { standard, native } = names;
      const countryCpi = cpis.find(
        ({ country }) => country.code === codes.cca2
      );

      const cpiRange = countryCpi
        ? [
            countryCpi.period[0][0],
            countryCpi.period[countryCpi.period.length - 1][0],
          ]
        : [];

      return {
        code: codes.cca2,
        names: [standard, ...native.filter((name) => name !== standard)],
        cpi: countryCpi,
        cpiRange,
      };
    })
    .filter(({ cpiRange }) => cpiRange.length)
    .reduce((acum, country) => {
      acum[country.code] = country;
      return acum;
    }, {});

const slimCountryList = (fullCountryList) =>
  Object.values(fullCountryList)
    .map((country) => {
      const { code, names, cpiRange: range } = country;
      return { code, names, range };
    })
    .sort((a, b) => a.names[0].localeCompare(b.names[0]));

module.exports = {
  countries: (cpis) => fullCountryList(fullCountries, cpis),
  slimCountries: (fullCountryList) => slimCountryList(fullCountryList),
};
