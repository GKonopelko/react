import { useState } from 'react';

interface ColumnSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onColumnsChange: (columns: string[]) => void;
  selectedColumns: string[];
}

const availableColumns = [
  'year',
  'population',
  'co2',
  'co2_per_capita',
  'methane',
  'oil_co2',
  'temperature_change_from_co2',
  'cement_co2',
  'land_use_change_co2',
  'nitrous_oxide',
  'total_ghg',
];

export default function ColumnSelector({
  isOpen,
  onClose,
  onColumnsChange,
  selectedColumns,
}: ColumnSelectorProps) {
  const [tempSelectedColumns, setTempSelectedColumns] =
    useState<string[]>(selectedColumns);

  const handleColumnToggle = (column: string) => {
    setTempSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleApply = () => {
    onColumnsChange(tempSelectedColumns);
    onClose();
  };

  const handleReset = () => {
    setTempSelectedColumns(['year', 'population', 'co2', 'co2_per_capita']);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Select Columns to Display</h2>

        <div className="columns-list">
          {availableColumns.map((column) => (
            <label key={column} className="column-checkbox">
              <input
                type="checkbox"
                checked={tempSelectedColumns.includes(column)}
                onChange={() => handleColumnToggle(column)}
              />
              <span>{column.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={handleReset}>Reset to Default</button>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}
