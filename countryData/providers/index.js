import { buildIMFData } from "./imf.js";

export async function fetchAllProvidersData() {
  await buildIMFData();
}
