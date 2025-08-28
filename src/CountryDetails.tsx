import { useMemo, useState } from 'react';
import type { CountryData } from './types';
import ColumnSelector from './ColumnSelector';

interface CountryDetailsProps {
  data: CountryData;
  selectedCountry: string | null;
  selectedYear?: number;
}

export default function CountryDetails({
  data,
  selectedCountry,
  selectedYear,
}: CountryDetailsProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'year',
    'population',
    'co2',
    'co2_per_capita',
  ]);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);

  const countryData = useMemo(() => {
    if (!selectedCountry) return null;
    return data[selectedCountry];
  }, [data, selectedCountry]);

  const tableData = useMemo(() => {
    if (!countryData) return [];
    return selectedYear
      ? countryData.data.filter((item) => item.year === selectedYear)
      : countryData.data;
  }, [countryData, selectedYear]);

  if (!selectedCountry) {
    return (
      <div className="country-details">
        <h2>Select a country to view details</h2>
      </div>
    );
  }

  if (!countryData) {
    return (
      <div className="country-details">
        <h2>Country not found</h2>
      </div>
    );
  }

  return (
    <div className="country-details">
      <div className="details-header">
        <h2>{selectedCountry}</h2>
        <button
          onClick={() => setIsColumnSelectorOpen(true)}
          className="column-selector-btn"
        >
          Select Columns
        </button>
      </div>

      <p>ISO Code: {countryData.iso_code}</p>
      <p>Total years: {countryData.data.length}</p>
      {selectedYear && <p>Showing data for: {selectedYear}</p>}

      <div className="data-table">
        <h3>{selectedYear ? `Data for ${selectedYear}` : 'Yearly Data'}</h3>
        <table>
          <thead>
            <tr>
              {selectedColumns.map((column) => (
                <th key={column}>{column.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((yearData) => (
              <tr key={yearData.year}>
                {selectedColumns.map((column) => (
                  <td key={column}>
                    {typeof yearData[column as keyof typeof yearData] ===
                    'number'
                      ? yearData[
                          column as keyof typeof yearData
                        ]?.toLocaleString()
                      : yearData[column as keyof typeof yearData] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ColumnSelector
        isOpen={isColumnSelectorOpen}
        onClose={() => setIsColumnSelectorOpen(false)}
        onColumnsChange={setSelectedColumns}
        selectedColumns={selectedColumns}
      />
    </div>
  );
}
