import './index.css';
import { createCo2DataResource } from './suspenseResource';
import SuspenseWrapper from './SuspenseWrapper';

const co2DataResource = createCo2DataResource();

function DataDisplay() {
  const data = co2DataResource.read();
  const firstCountryName = Object.keys(data)[0];
  const firstCountry = data[firstCountryName];

  return (
    <div className="app">
      <h1>CO2 Emissions Data</h1>
      <p>Total countries loaded: {Object.keys(data).length}</p>

      <div className="country-card">
        <h2>First Country: {firstCountryName}</h2>
        <p>ISO Code: {firstCountry.iso_code}</p>
        <p>Data entries: {firstCountry.data.length}</p>

        <div className="yearly-data">
          <h3>First 5 years:</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Population</th>
                <th>CO2</th>
                <th>CO2 per Capita</th>
              </tr>
            </thead>
            <tbody>
              {firstCountry.data.slice(0, 5).map((yearData) => (
                <tr key={yearData.year}>
                  <td>{yearData.year}</td>
                  <td>{yearData.population?.toLocaleString() || 'N/A'}</td>
                  <td>{yearData.co2?.toLocaleString() || 'N/A'}</td>
                  <td>{yearData.co2_per_capita || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
