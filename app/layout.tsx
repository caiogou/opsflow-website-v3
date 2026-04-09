import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'OpsFlow Advisory — AI-Powered Supply Chain Execution',
  description:
    'From diagnostic to measurable execution in 6 weeks, not 6 months. Senior-led, AI-powered supply chain execution for mid-market manufacturers in EMEA.',
  keywords: [
    'supply chain',
    'S&OP',
    'AI',
    'execution',
    'manufacturing',
    'EMEA',
    'inventory optimization',
    'demand planning',
  ],
  authors: [{ name: 'OpsFlow Advisory' }],
  openGraph: {
    title: 'OpsFlow Advisory — AI-Powered Supply Chain Execution',
    description:
      'From diagnostic to measurable execution in 6 weeks, not 6 months. Senior-led, AI-powered supply chain execution for mid-market manufacturers in EMEA.',
    url: 'https://opsflow-advisory.ch',
    siteName: 'OpsFlow Advisory',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://opsflow-advisory.ch/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OpsFlow Advisory — AI-Powered Supply Chain Execution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpsFlow Advisory — AI-Powered Supply Chain Execution',
    description:
      'From diagnostic to measurable execution in 6 weeks, not 6 months. Senior-led, AI-powered supply chain execution for mid-market manufacturers in EMEA.',
    images: ['https://opsflow-advisory.ch/og-image.png'],
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#0A1A2F] text-white font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
