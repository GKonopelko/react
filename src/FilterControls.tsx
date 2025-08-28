import { useState, useCallback, useMemo } from 'react';
import type { CountryData } from './types';

interface FilterControlsProps {
  data: CountryData;
  selectedYear: number;
  onYearChange: (year: number) => void;
  onRegionFilter: (region: string) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const regions = [
  'All',
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Antarctica',
];

export default function FilterControls({
  data,
  selectedYear,
  onYearChange,
  onRegionFilter,
  onSearch,
  onSort,
}: FilterControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(data)
          .flatMap((country) => country.data.map((item) => item.year))
          .filter((year) => year !== undefined)
      )
    ).sort((a, b) => b - a);
  }, [data]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch(query);
    },
    [onSearch]
  );

  const handleRegionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const region = e.target.value;
      setSelectedRegion(region);
      onRegionFilter(region);
    },
    [onRegionFilter]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSortBy = e.target.value;
      setSortBy(newSortBy);
      onSort(newSortBy, sortOrder);
    },
    [onSort, sortOrder]
  );

  const handleSortOrderToggle = useCallback(() => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onSort(sortBy, newOrder);
  }, [onSort, sortBy, sortOrder]);

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onYearChange(Number(e.target.value));
    },
    [onYearChange]
  );

  return (
    <div className="filter-controls">
      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="year-select">Select Year:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="region-filter">Filter by Region:</label>
          <select
            id="region-filter"
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search">Search Countries:</label>
          <input
            id="search"
            type="text"
            placeholder="Search country name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select id="sort-by" value={sortBy} onChange={handleSortChange}>
            <option value="name">Name</option>
            <option value="population">Population</option>
            <option value="co2">CO2 Emissions</option>
            <option value="co2_per_capita">CO2 per Capita</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort Order:</label>
          <button onClick={handleSortOrderToggle} className="sort-order-btn">
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>
    </div>
  );
}
