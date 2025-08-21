import React from 'react';

export const MockCountryAutocomplete: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div>
    <input
      data-testid="country-input"
      placeholder="Start typing country name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
