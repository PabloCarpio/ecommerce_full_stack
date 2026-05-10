import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'DigiStore — Digital Products Marketplace',
  description: 'Discover premium courses, templates, and digital assets.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DigiStore',
    title: 'DigiStore — Digital Products Marketplace',
    description: 'Discover premium courses, templates, and digital assets.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigiStore — Digital Products Marketplace',
    description: 'Discover premium courses, templates, and digital assets.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}