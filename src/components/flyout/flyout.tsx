'use client';

import styles from './styles.module.css';
import { useStore } from '../../utils/store/store';
import { useEffect, useState, useRef } from 'react';

export const Flyout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const { unselectAll, getSelectedCount, getSelectedItems } = useStore();
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const count = getSelectedCount();

  const handleExport = async () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) return;

    setIsExporting(true);
    try {
      const response = await fetch('/api/generate-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `Export failed with status ${response.status}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `pokemon_${selectedItems.length}_items.csv`;
        downloadLinkRef.current.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isMounted || count === 0) {
    return null;
  }

  return (
    <div className={styles.flyout} data-testid="flyout-component">
      <div className={styles.flyoutcontent}>
        <span>{count} items selected</span>
        <button onClick={unselectAll}>Unselect all</button>
        <button
          onClick={handleExport}
          disabled={isExporting}
          aria-busy={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Download CSV'}
        </button>
        <a
          ref={downloadLinkRef}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
