import type { Metadata, Viewport } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LenisProvider from '@/components/providers/LenisProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import IndustrialGrid from '@/components/ui/IndustrialGrid';
import ScrollToTop from '@/components/ui/ScrollToTop';


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
  authors: [{ name: 'Netriq AI', url: 'https://netriqai.com.au' }],
  creator: 'Netriq AI',
  publisher: 'Netriq AI',
  metadataBase: new URL('https://netriqai.com.au'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://netriqai.com.au',
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
  alternates: {
    canonical: 'https://netriqai.com.au',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-AU"
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
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "Netriq AI",
                    "url": "https://netriqai.com.au",
                    "description": "AI automation consulting for Australian small and medium businesses.",
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://netriqai.com.au/search?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": ["LocalBusiness", "ProfessionalService"],
                    "name": "Netriq AI Consulting",
                    "alternateName": "Netriq AI",
                    "description": "Netriq AI Consulting is a premium AI automation consultancy for Australian small and medium businesses (SMBs). We design custom AI pipelines, sales automation, and intelligent support systems. Services start at AUD $2,500.",
                    "url": "https://netriqai.com.au",
                    "logo": "https://netriqai.com.au/icon.svg",
                    "image": "https://netriqai.com.au/og-image.png",
                    "telephone": "",
                    "email": "hello@netriqai.com.au",
                    // Service-area business (no public storefront): we intentionally
                    // omit streetAddress/postalCode and define reach via areaServed.
                    // This must match the Google Business Profile being set to a
                    // service-area business with its address hidden.
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "Melbourne",
                      "addressRegion": "VIC",
                      "addressCountry": "AU"
                    },
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": "-37.8101839",
                      "longitude": "144.9686511"
                    },
                    "hasMap": "https://maps.app.goo.gl/YzuYWFzFVLWMHRtu7",
                    "areaServed": [
                      { "@type": "Country", "name": "Australia" },
                      { "@type": "State", "name": "Victoria" },
                      { "@type": "City", "name": "Melbourne" }
                    ],
                    "serviceArea": {
                      "@type": "Country",
                      "name": "Australia"
                    },
                    "knowsAbout": [
                      "AI Automation",
                      "Business Process Automation",
                      "Machine Learning Implementation",
                      "Make.com Workflows",
                      "n8n Automation",
                      "OpenAI API Integration",
                      "CRM Automation",
                      "Sales Automation",
                      "Customer Support AI",
                      "Small Business AI Consulting"
                    ],
                    "hasOfferCatalog": {
                      "@type": "OfferCatalog",
                      "name": "Netriq AI Services",
                      "itemListElement": [
                        {
                          "@type": "Offer",
                          "name": "AI Discovery Consultation",
                          "description": "Deep-dive workflow mapping to identify AI ROI potential. Includes 30+ page report and 90-day roadmap.",
                          "price": "2500",
                          "priceCurrency": "AUD"
                        },
                        {
                          "@type": "Offer",
                          "name": "Done-For-You AI Implementation",
                          "description": "Custom AI automation build, API integrations, and secure installation into your existing business tools.",
                          "price": "8000",
                          "priceCurrency": "AUD"
                        },
                        {
                          "@type": "Offer",
                          "name": "Ongoing AI Support Retainer",
                          "description": "24/7 monitoring, continuous upgrades, guaranteed 99.9% uptime, monthly ROI reports.",
                          "price": "1500",
                          "priceCurrency": "AUD",
                          "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "price": "1500",
                            "priceCurrency": "AUD",
                            "unitCode": "MON"
                          }
                        },
                        {
                          "@type": "Offer",
                          "name": "AI Team Training",
                          "description": "Staff training workshops, practical AI tool guides, and post-workshop resource packs.",
                          "price": "3000",
                          "priceCurrency": "AUD"
                        }
                      ]
                    },
                    "priceRange": "$$$",
                    "openingHours": "Mo-Fr 09:00-17:00",
                    "sameAs": [
                      "https://www.linkedin.com/company/netriqai",
                      "https://maps.app.goo.gl/YzuYWFzFVLWMHRtu7"
                    ]
                  }
                ])
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
