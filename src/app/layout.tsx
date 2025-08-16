import type { Metadata } from 'next';
import { ThemeProvider } from '../components/theme-context/theme-context-provider';
import './global.css';

export const metadata: Metadata = {
  title: 'NextJs',
  description: 'From Vite to NextJs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div id="root">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
