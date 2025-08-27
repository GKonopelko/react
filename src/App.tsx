import { useState } from 'react';
import CountryDetails from './CountryDetails';
import CountryList from './CountryList';
import SuspenseWrapper from './SuspenseWrapper';
import './index.css';
import { createCo2DataResource } from './suspenseResource';

const co2DataResource = createCo2DataResource();

function DataDisplay() {
  const data = co2DataResource.read();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CO2 Emissions Data</h1>
        <p>Total countries: {Object.keys(data).length}</p>
      </header>

      <div className="app-content">
        <div className="sidebar">
          <CountryList
            data={data}
            onCountrySelect={handleCountrySelect}
            selectedCountry={selectedCountry}
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
