import type { Metadata } from 'next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Milla Hair Studio - Luxury Salon & Spa Sidoarjo',
  description: 'Mewujudkan kecantikan mahkota wanita modern melalui keahlian seni tata rambut berkelas dunia dan pelayanan penuh kehangatan.',
  keywords: 'salon sidoarjo, hair studio, potong rambut, balayage, keratin treatment, korea wave perm, milla hair studio',
  robots: 'index, follow',
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
