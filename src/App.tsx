import { useState } from 'react';
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

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleRegionFilter = (region: string) => {
    setRegionFilter(region);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  const latestYear = Math.max(
    ...(Object.values(data)
      .flatMap((country) => country.data.map((item) => item.year))
      .filter((year) => year !== undefined) as number[])
  );

  if (selectedYear === 2020) {
    setSelectedYear(latestYear);
  }

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
