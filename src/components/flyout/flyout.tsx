import styles from './styles.module.css';
import { useStore } from '../../utils/store/store';
import { useEffect, useState, useRef } from 'react';

export const Flyout = () => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const { unselectAll, getSelectedCount, getSelectedItems } = useStore();
  const count = getSelectedCount();

  const handleExport = () => {
    const items = getSelectedItems();
    if (items.length === 0) return;

    const headers = 'ID,Name,Description\n';
    const csvContent = items
      .map(({ id, name, description }) => `"${id}","${name}","${description}"`)
      .join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  useEffect(() => {
    if (downloadUrl && downloadLinkRef.current) {
      downloadLinkRef.current.click();
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }, [downloadUrl]);

  if (count === 0) return null;

  return (
    <div className={styles.flyout}>
      <div className={styles.flyoutcontent}>
        <span>{count} items selected</span>
        <button onClick={unselectAll}>Unselect all</button>
        <button onClick={handleExport}>Download</button>
        <a
          ref={downloadLinkRef}
          href={downloadUrl || undefined}
          download={`${count}_items.csv`}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
