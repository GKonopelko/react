import { useState, useCallback, useEffect } from 'react';
import CountryDetails from './CountryDetails';
import CountryList from './CountryList';
import FilterControls from './FilterControls';
import SuspenseWrapper from './SuspenseWrapper';
import './index.css';
import { createCo2DataResource } from './suspenseResource';

const co2DataResource = createCo2DataResource();

function DataDisplay() {
  const data = co2DataResource.read();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2020);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleCountrySelect = useCallback((countryName: string) => {
    setSelectedCountry(countryName);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handleRegionFilter = useCallback((region: string) => {
    setRegionFilter(region);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSort = useCallback(
    (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    },
    []
  );

  useEffect(() => {
    if (selectedYear === 2020) {
      const latestYear = Math.max(
        ...(Object.values(data)
          .flatMap((country) => country.data.map((item) => item.year))
          .filter((year) => year !== undefined) as number[])
      );
      setSelectedYear(latestYear);
    }
  }, [data, selectedYear]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>CO2 Emissions Data</h1>
        <p>Total countries: {Object.keys(data).length}</p>
      </header>

      <FilterControls
        data={data}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onRegionFilter={handleRegionFilter}
        onSearch={handleSearch}
        onSort={handleSort}
      />

      <div className="app-content">
        <div className="sidebar">
          <CountryList
            data={data}
            onCountrySelect={handleCountrySelect}
            selectedCountry={selectedCountry}
            selectedYear={selectedYear}
            searchQuery={searchQuery}
            regionFilter={regionFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div>

        <div className="main-content">
          <CountryDetails data={data} selectedCountry={selectedCountry} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SuspenseWrapper>
      <DataDisplay />
    </SuspenseWrapper>
  );
}

export default App;
