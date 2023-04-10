# Methodology of CPI fetching and estimation

The base CPI data is fetched from the IMF, using the DBNomics API, but there's a system to add more sources of information. The new sources can be added either manually (like with the INDEC one) or automatically (like with the IMF one). The process is triggered with the `data` npm script, which is defined in the `package.json` file.

## Manual sources

For manual sources, you just make a new JSON file in the `countryData/data/providers/` folder. The file should have the same structure than the rest (check them out).
Also, be mindful of the `priority` property, which is used to determine which source to use when there's a conflict. The higher the number, the less priority is has (the IMF has the lowest, with 999).

Right now, if there's a more than one source, the source with the highest priority is used, but I'm planning to make it so that the user can choose which source to use.

As long as you have a valid JSON file, you can run the `data` npm script and it will be added to the list of sources for the countries that the file has data for.

## Automatic sources

The automatic sources is basically making the manual sources through code, so that it's auto updated every week. To do that, make a new file in the `./providers/` folder, and export an async function that generates a JSON like the ones in the `./data/providers/`, and import and call that function from the `./providers/index.js` file. Check the `./providers/imf.js` file for an example.

# Estimation

Early enough, when I started fetching data for this, I found that there are a lot of countries that lack CPI statistics for some periods of time. So, I decided to make a system to estimate the missing data. The estimation is merely an average of the previous months. You can check the estimation method in the `./dataUnifiers/inflationCalcPipeline.js` file.
