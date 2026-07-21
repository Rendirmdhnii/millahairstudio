'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import LogoImage from '@/logosalon.png';

export default function Footer() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/workspace')) return null;
  const waLink = "https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20ingin%20berkonsultasi.";

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info & Extra Large Logo Image */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src={LogoImage} 
                alt="Milla Hair Studio Logo" 
                width={260} 
                height={85} 
                className="h-20 sm:h-24 w-auto object-contain brightness-110"
                priority
              />
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Salon wanita modern di Sidoarjo yang menghadirkan perawatan rambut profesional, penataan modis, dan kehangatan pelayanan berkualitas tinggi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#926C3A] pl-2">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Layanan Spesialis</Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Form Booking Online</Link>
              </li>
              <li>
                <Link href="/lokasi" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Lokasi Studio</Link>
              </li>
            </ul>
          </div>

          {/* Business Contacts & Operational Hours */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold uppercase text-xs tracking-wider border-l-2 border-[#926C3A] pl-2">
              Hubungi Kami & Jam Buka
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 text-[#926C3A] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-200">Alamat Salon:</strong><br />
                  Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Pagerwojo, Kec. Buduran, Kabupaten Sidoarjo, Jawa Timur 61219, Indonesia
                </span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 text-[#926C3A] flex-shrink-0" />
                <span>
                  <strong className="text-zinc-200">Telepon / WhatsApp:</strong>{' '}
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#926C3A] font-bold">0856-4512-1008</a>
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Clock className="h-4 w-4 text-[#926C3A] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-200">Jam Operasional:</strong><br />
                  Buka Setiap Hari: 09.30 - 19.00 WIB
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Media Links Section with Clean Custom SVGs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-zinc-800">
          <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
            Ikuti Media Sosial Milla Hair Studio
          </span>
          <div className="flex items-center gap-6">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/millahairstudio_sidoarjo?igsh=dHlpdnV3b2JxdDcz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-[#926C3A] transition-colors duration-300 min-h-[44px] flex items-center"
              title="Instagram"
            >
              <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/share/18xx3bfi4v/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-[#926C3A] transition-colors duration-300 min-h-[44px] flex items-center"
              title="Facebook"
            >
              <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@millahairstudio_sidoarjo?_r=1&_t=ZS-98DxVGoFGSb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-[#926C3A] transition-colors duration-300 min-h-[44px] flex items-center"
              title="TikTok"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.13 1.2 2.7 1.95 4.34 2.12v3.83c-1.42-.04-2.82-.44-4.03-1.2-.38-.24-.73-.52-1.05-.83v5.29c.07 1.9-.4 3.82-1.4 5.43-1.46 2.37-4.02 3.96-6.85 4.16-3.1.22-6.26-.88-8.22-3.32-2.17-2.72-2.52-6.68-.86-9.75 1.43-2.65 4.31-4.41 7.33-4.47.16 0 .32 0 .48.01v3.9c-.93.07-1.89.37-2.64.96-1.12.87-1.74 2.27-1.63 3.7.13 1.76 1.34 3.32 3.03 3.78 1.63.45 3.48-.15 4.45-1.54.54-.78.78-1.73.74-2.68V0h.06z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a 
              href="https://wa.me/6285645121008" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-[#926C3A] transition-colors duration-300 min-h-[44px] flex items-center"
              title="WhatsApp"
            >
              <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer Bottom with Discreet Workspace Link */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Milla Hair Studio Sidoarjo. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">Didedikasikan untuk keindahan mahkota wanita modern.</span>
            {/* Discreet Workspace Link */}
            <Link 
              href="/workspace" 
              className="text-[11px] text-zinc-500 hover:text-[#926C3A] transition-colors"
              title="Internal Console"
            >
              Workspace
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
