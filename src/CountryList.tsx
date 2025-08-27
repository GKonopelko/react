import type { CountryData } from './types';

interface CountryListProps {
  data: CountryData;
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
}

export default function CountryList({
  data,
  onCountrySelect,
  selectedCountry,
}: CountryListProps) {
  const countries = Object.entries(data).map(([countryName, countryInfo]) => {
    const latestData = countryInfo.data
      .filter((item) => item.population !== undefined)
      .sort((a, b) => b.year - a.year)[0];

    return {
      name: countryName,
      isoCode: countryInfo.iso_code,
      population: latestData?.population,
      dataLength: countryInfo.data.length,
    };
  });

  return (
    <div className="country-list">
      <h2>Countries ({countries.length})</h2>
      <div className="country-list-content">
        {countries.map((country) => (
          <div
            key={country.name}
            className={`country-item ${selectedCountry === country.name ? 'selected' : ''}`}
            onClick={() => onCountrySelect(country.name)}
          >
            <h3>{country.name}</h3>
            <p>ISO: {country.isoCode || 'N/A'}</p>
            <p>Population: {country.population?.toLocaleString() || 'N/A'}</p>
            <p>Years: {country.dataLength}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
