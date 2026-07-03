import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import AiConsultant from '../components/ai-consultant';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Milla Hair Studio - Enterprise Premium Salon',
  description: 'Mewujudkan kecantikan mahkota wanita modern melalui keahlian seni tata rambut berkelas dunia dan teknologi modern.',
  keywords: 'salon, hair studio, potong rambut, balayage, keratin treatment, korea wave perm, milla hair studio',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        {/* Link Playfair Display and Inter fonts from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700;850&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        {/* Floating Navbar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        
        {/* AI Chatbot Widget */}
        <AiConsultant />
        
        {/* Luxury Footer */}
        <Footer />
      </body>
    </html>
  );
}
