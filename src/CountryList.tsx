import { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { CountryData } from './types';

interface CountryListProps {
  data: CountryData;
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
  selectedYear: number;
  searchQuery: string;
  regionFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface CountryItem {
  name: string;
  isoCode: string;
  population?: number;
  co2?: number;
  co2PerCapita?: number;
  dataLength: number;
  region: string;
}

const Row = memo(
  ({
    data,
    index,
    style,
  }: {
    data: {
      countries: CountryItem[];
      onCountrySelect: (name: string) => void;
      selectedCountry: string | null;
    };
    index: number;
    style: React.CSSProperties;
  }) => {
    const country = data.countries[index];

    return (
      <div
        style={style}
        className={`country-item ${data.selectedCountry === country.name ? 'selected' : ''}`}
        onClick={() => data.onCountrySelect(country.name)}
      >
        <h3>{country.name}</h3>
        <p>ISO: {country.isoCode || 'N/A'}</p>
        <p>Population: {country.population?.toLocaleString() || 'N/A'}</p>
        <p>CO2: {country.co2?.toLocaleString() || 'N/A'}</p>
        <p>Years: {country.dataLength}</p>
      </div>
    );
  }
);

Row.displayName = 'CountryRow';

function CountryListComponent({
  data,
  onCountrySelect,
  selectedCountry,
  selectedYear,
  searchQuery,
  regionFilter,
  sortBy,
  sortOrder,
}: CountryListProps) {
  const getRegion = (countryName: string): string => {
    if (
      countryName.includes('Africa') ||
      countryName === 'South Africa' ||
      countryName === 'Nigeria'
    )
      return 'Africa';
    if (
      countryName.includes('Asia') ||
      countryName === 'China' ||
      countryName === 'India' ||
      countryName === 'Japan'
    )
      return 'Asia';
    if (
      countryName.includes('Europe') ||
      countryName === 'Germany' ||
      countryName === 'France' ||
      countryName === 'United Kingdom'
    )
      return 'Europe';
    if (
      countryName.includes('America') ||
      countryName === 'United States' ||
      countryName === 'Canada' ||
      countryName === 'Mexico'
    )
      return 'North America';
    if (
      countryName === 'Brazil' ||
      countryName === 'Argentina' ||
      countryName === 'Chile'
    )
      return 'South America';
    if (countryName === 'Australia' || countryName === 'New Zealand')
      return 'Oceania';
    if (countryName === 'Antarctica') return 'Antarctica';
    return 'Other';
  };

  const countries = useMemo(() => {
    return Object.entries(data)
      .map(([countryName, countryInfo]) => {
        const yearData = countryInfo.data.find(
          (item) => item.year === selectedYear
        );

        return {
          name: countryName,
          isoCode: countryInfo.iso_code,
          population: yearData?.population,
          co2: yearData?.co2,
          co2PerCapita: yearData?.co2_per_capita,
          dataLength: countryInfo.data.length,
          region: getRegion(countryName),
        };
      })
      .filter((country) => {
        const matchesSearch = country.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesRegion =
          regionFilter === 'All' || country.region === regionFilter;

        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        let aValue: string | number | undefined;
        let bValue: string | number | undefined;

        if (sortBy === 'name') {
          aValue = a.name;
          bValue = b.name;
        } else if (sortBy === 'population') {
          aValue = a.population;
          bValue = b.population;
        } else if (sortBy === 'co2') {
          aValue = a.co2;
          bValue = b.co2;
        } else if (sortBy === 'co2PerCapita') {
          aValue = a.co2PerCapita;
          bValue = b.co2PerCapita;
        } else {
          aValue = a[sortBy as keyof CountryItem] as
            | string
            | number
            | undefined;
          bValue = b[sortBy as keyof CountryItem] as
            | string
            | number
            | undefined;
        }

        if (aValue === undefined || aValue === null) {
          aValue = sortOrder === 'asc' ? Infinity : -Infinity;
        }
        if (bValue === undefined || bValue === null) {
          bValue = sortOrder === 'asc' ? Infinity : -Infinity;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [data, selectedYear, searchQuery, regionFilter, sortBy, sortOrder]);

  const itemData = useMemo(
    () => ({
      countries,
      onCountrySelect,
      selectedCountry,
    }),
    [countries, onCountrySelect, selectedCountry]
  );

  return (
    <div className="country-list">
      <h2>Countries ({countries.length})</h2>
      <div className="country-list-container">
        {countries.length > 0 ? (
          <List
            height={400}
            width="100%"
            itemCount={countries.length}
            itemSize={120}
            itemData={itemData}
            className="country-list-inner"
          >
            {Row}
          </List>
        ) : (
          <div className="country-list-empty">
            <p>No countries found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CountryListComponent, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.selectedCountry === nextProps.selectedCountry &&
    prevProps.selectedYear === nextProps.selectedYear &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.regionFilter === nextProps.regionFilter &&
    prevProps.sortBy === nextProps.sortBy &&
    prevProps.sortOrder === nextProps.sortOrder
  );
});
