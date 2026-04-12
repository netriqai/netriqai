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
    default: 'Netriq AI — AI Automation Consulting for SMBs | Melbourne',
    template: '%s | Netriq AI Consulting',
  },
  description:
    'Netriq AI is a premium AI automation consultancy specializing in Small and Medium Business (SMB) efficiency. We design and implement custom AI pipelines, sales automation, and intelligent support systems for Australian businesses. Starting from AUD $2,500.',
  keywords: [
    'SMB AI automation',
    'Small business AI consulting',
    'AI automation agency Australia',
    'Melbourne AI consultants',
    'custom AI workflows',
    'AI for small business efficiency',
    'business process automation',
    'Australian AI consultancy',
    'intelligent automation for SMBs',
    'AI implementation services',
  ],
  authors: [{ name: 'Netriq AI', url: 'https://netriq.com.au' }],
  creator: 'Netriq AI',
  publisher: 'Netriq AI',
  metadataBase: new URL('https://netriq.com.au'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://netriq.com.au',
    siteName: 'Netriq AI',
    title: 'Netriq AI — We Rewire Your Business With AI',
    description:
      "We don't just automate your business. We rewire it. Custom AI automation for Australian SMBs — 200+ workflows built, AUD $4.2M saved for clients.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Netriq AI — AI Automation Consultancy Melbourne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Netriq AI — AI Automation for Australian SMBs',
    description:
      "We don't just automate your business. We rewire it. 200+ workflows built. AUD $4.2M saved.",
    images: ['/og-image.png'],
    creator: '@netriqai',
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
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ProfessionalService",
                  "name": "Netriq AI",
                  "description": "Premium AI Automation Consultancy for Small and Medium Businesses (SMBs) in Australia.",
                  "url": "https://netriq.com.au",
                  "logo": "https://netriq.com.au/icon.svg",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Melbourne",
                    "addressRegion": "VIC",
                    "addressCountry": "AU"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "-37.8136",
                    "longitude": "144.9631"
                  },
                  "priceRange": "$$$",
                  "serviceType": "AI Automation, Business Process Optimization, SMB AI Consulting",
                  "areaServed": "Australia",
                  "openingHours": "Mo-Fr 09:00-17:00"
                })
              }}
            />
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
