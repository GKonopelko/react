import type { Metadata } from 'next';

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
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
