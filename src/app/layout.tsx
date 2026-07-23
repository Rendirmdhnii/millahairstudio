import type { Metadata } from 'next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.millahairstudio.com'),
  title: {
    default: 'Milla Hair Studio & Salon',
    template: '%s | Milla Hair Studio & Salon'
  },
  description: 'Temukan Keahlian Artistik & Dedikasi Dalam Setiap Perawatan Rambut. Salon premium di Sidoarjo.',
  applicationName: 'Milla Hair Studio & Salon',
  authors: [{ name: 'Milla Hair Studio' }],
  generator: 'Next.js',
  keywords: ["Milla Hair Studio", "salon premium Sidoarjo", "balayage Sidoarjo", "keratin treatment Sidoarjo", "potong rambut Sidoarjo"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Milla Hair Studio & Salon',
    description: 'Temukan Keahlian Artistik & Dedikasi Dalam Setiap Perawatan Rambut. Salon premium di Sidoarjo.',
    url: 'https://www.millahairstudio.com',
    siteName: 'Milla Hair Studio & Salon',
    images: [
      { 
        url: "/images/bg-salon-cerah.jpg", 
        width: 1200, 
        height: 630, 
        alt: "Milla Hair Studio & Salon" 
      }
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milla Hair Studio & Salon',
    description: 'Temukan Keahlian Artistik & Dedikasi Dalam Setiap Perawatan Rambut. Salon premium di Sidoarjo.',
    images: ['/images/bg-salon-cerah.jpg'],
  },
  verification: {
    google: 'isi_dengan_google_site_verification_code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans antialiased selection:bg-[#926C3A]/20 selection:text-zinc-900">
        {/* Floating Navbar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        
        {/* Luxury Footer */}
        <Footer />
      </body>
    </html>
  );
}
