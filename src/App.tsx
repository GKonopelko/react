import { useState, useEffect } from 'react';
import type { CountryData, CountryInfo } from './types';
import './index.css';

function App() {
  const [data, setData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/data/co2Data.json');

      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
      }

      const jsonData: CountryData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getLatestPopulation = (countryInfo: CountryInfo): number => {
    if (!countryInfo.data || countryInfo.data.length === 0) {
      return 0;
    }

    const dataWithPopulation = countryInfo.data
      .filter((item) => item.population !== undefined)
      .sort((a, b) => b.year - a.year);

    return dataWithPopulation[0]?.population || 0;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading CO2 data... This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error loading data</h2>
        <p>{error}</p>
        <button onClick={loadData}>Try Again</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error">
        <h2>No data available</h2>
        <button onClick={loadData}>Load Data</button>
      </div>
    );
  }

  const countries = Object.entries(data)
    .slice(0, 10)
    .map(([name, countryInfo]) => ({
      name,
      isoCode: countryInfo.iso_code,
      population: getLatestPopulation(countryInfo),
      yearlyData: countryInfo.data.slice(-10),
    }));

  return (
    <div className="app">
      <h1>CO2 Emissions Data</h1>
      <p>Total countries: {Object.keys(data).length}</p>
      <p>Showing: {countries.length} countries</p>

      <div className="countries-list">
        {countries.map((country) => (
          <div key={country.name} className="country-card">
            <h2>{country.name}</h2>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>ISO Code: {country.isoCode}</p>

            <div className="yearly-data">
              <h3>Recent Data (Test - last 10 years):</h3>
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Population</th>
                    <th>CO2</th>
                    <th>CO2 per Capita</th>
                    <th>Methane</th>
                  </tr>
                </thead>
                <tbody>
                  {country.yearlyData.map((yearData) => (
                    <tr key={yearData.year}>
                      <td>{yearData.year}</td>
                      <td>{yearData.population?.toLocaleString() || 'N/A'}</td>
                      <td>{yearData.co2?.toLocaleString() || 'N/A'}</td>
                      <td>{yearData.co2_per_capita || 'N/A'}</td>
                      <td>{yearData.methane || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
