import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

/**
 * Viewport must be a separate export in Next.js 15.
 * Keeping it inside `metadata` is deprecated and will cause warnings.
 *
 * Next.js 15 change: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'FitTracker - Your Personal Fitness Journey',
  description: 'Track your fitness goals, hydration, and progress with our comprehensive fitness tracker.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}