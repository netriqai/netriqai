import type { Metadata, Viewport } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LenisProvider from '@/components/providers/LenisProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import IndustrialGrid from '@/components/ui/IndustrialGrid';
import ScrollToTop from '@/components/ui/ScrollToTop';

export const runtime = 'edge';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NeuralShift AI — AI Automation Consultancy | Melbourne, Australia',
    template: '%s | NeuralShift AI',
  },
  description:
    'NeuralShift AI builds custom AI automation systems for Australian SMBs. We automate operations, sales pipelines, support teams, and back-office workflows. Starting from AUD $2,500.',
  keywords: [
    'AI automation',
    'AI consultancy',
    'Melbourne AI',
    'Australian AI agency',
    'business automation',
    'workflow automation',
    'Make.com',
    'n8n',
    'AI implementation',
    'SMB automation',
    'AI strategy',
  ],
  authors: [{ name: 'NeuralShift AI', url: 'https://search.neuralshiftai.com.au' }],
  creator: 'NeuralShift AI',
  publisher: 'NeuralShift AI',
  metadataBase: new URL('https://search.neuralshiftai.com.au'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://search.neuralshiftai.com.au',
    siteName: 'NeuralShift AI',
    title: 'NeuralShift AI — We Rewire Your Business With AI',
    description:
      "We don't just automate your business. We rewire it. Custom AI automation for Australian SMBs — 200+ workflows built, AUD $4.2M saved for clients.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuralShift AI — AI Automation Consultancy Melbourne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuralShift AI — AI Automation for Australian SMBs',
    description:
      "We don't just automate your business. We rewire it. 200+ workflows built. AUD $4.2M saved.",
    images: ['/og-image.png'],
    creator: '@neuralshiftai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body 
        className="bg-background text-text-primary font-sans antialiased selection:bg-white selection:text-black"
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <ThemeProvider>
          <LenisProvider>
            <IndustrialGrid />
            <Navbar />
            <main id="main-content">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
