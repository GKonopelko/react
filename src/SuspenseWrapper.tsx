import { Suspense } from 'react';
import './index.css';

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading CO2 data... This may take a moment</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default SuspenseWrapper;
