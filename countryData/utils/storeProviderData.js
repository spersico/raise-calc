import { writeFile } from "fs/promises";
import { PROVIDERS_DATA_FOLDER } from "../constants.js";

export async function storeProviderData(
  provider,
  countryCode,
  data,
  preference = 999
) {
  const filename = `${provider}${countryCode ? "-" + countryCode : ""}.json`;

  return writeFile(
    `${PROVIDERS_DATA_FOLDER}/${filename}`,
    JSON.stringify({
      meta: {
        updatedAt: new Date().toISOString(),
        provider,
        preference,
      },
      data,
    })
  );
}
