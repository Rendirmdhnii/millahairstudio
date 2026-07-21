'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock } from 'lucide-react';
import LogoImage from '@/logosalon.png';

export default function Footer() {
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
                <Link href="/#tentang" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link href="/#layanan" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Layanan Spesialis</Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Form Booking Online</Link>
              </li>
              <li>
                <Link href="/#lokasi" className="hover:text-[#926C3A] text-zinc-400 transition-colors">Lokasi Studio</Link>
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
                  Timur Jank Jank, Jl. Kav. DPR I No.26, Pagerwojo, Buduran, Kabupaten Sidoarjo, Jawa Timur 61219
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
