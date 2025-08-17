import type { Metadata } from 'next';
import { ClientProviders } from './client-providers';
import './global.css';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

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
          <div id="root">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
