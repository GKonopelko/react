import type { Metadata } from 'next';
import { ClientProviders } from './client-providers';
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
        <ClientProviders>
          <div id="root">{children}</div>
        </ClientProviders>
      </body>
    </html>
  );
}
