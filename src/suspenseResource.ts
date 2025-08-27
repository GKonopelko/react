import type { CountryData } from './types';

let co2DataResource: { read: () => CountryData } | null = null;

export function createCo2DataResource() {
  if (co2DataResource) return co2DataResource;

  let status = 'pending';
  let result: CountryData | Error;

  const promise = fetch('/data/co2Data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      status = 'success';
      result = data;
    })
    .catch((error) => {
      status = 'error';
      result = error;
    });

  co2DataResource = {
    read() {
      if (status === 'pending') throw promise;
      if (status === 'error') throw result;
      return result as CountryData;
    },
  };

  return co2DataResource;
}
