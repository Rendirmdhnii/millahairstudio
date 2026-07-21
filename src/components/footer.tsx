'use client';

import { Phone, MapPin, Scissors, Clock } from 'lucide-react';

export default function Footer() {
  const waLink = "https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20ingin%20berkonsultasi.";

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30">
                <Scissors className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Milla Hair Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Salon wanita modern di Sidoarjo yang menghadirkan perawatan rambut profesional, penataan modis, dan kehangatan pelayanan berkualitas tinggi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#C5A880] pl-2">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#" className="hover:text-[#C5A880] text-zinc-400 transition-colors">Beranda</a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#C5A880] text-zinc-400 transition-colors">Tentang Kami</a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-[#C5A880] text-zinc-400 transition-colors">Layanan Spesialis</a>
              </li>
              <li>
                <a href="/booking" className="hover:text-[#C5A880] text-zinc-400 transition-colors">Form Booking Online</a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-[#C5A880] text-zinc-400 transition-colors">Lokasi Studio</a>
              </li>
            </ul>
          </div>

          {/* Business Contacts */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold uppercase text-xs tracking-wider border-l-2 border-[#C5A880] pl-2">
              Hubungi Kami & Jam Buka
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 text-[#C5A880] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-200">Alamat Salon:</strong><br />
                  Timur Jank Jank, Jl. Kav. DPR I No.26, Pagerwojo, Buduran, Kabupaten Sidoarjo, Jawa Timur 61219
                </span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 text-[#C5A880] flex-shrink-0" />
                <span>
                  <strong className="text-zinc-200">Telepon / WhatsApp:</strong>{' '}
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#C5A880] font-bold">0856-4512-1008</a>
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Clock className="h-4 w-4 text-[#C5A880] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-200">Jam Operasional:</strong><br />
                  Senin - Minggu | 09.30 - 20.00 WIB
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Milla Hair Studio Sidoarjo. Hak Cipta Dilindungi.</p>
          <p className="text-zinc-500">
            Didedikasikan untuk keindahan mahkota wanita modern.
          </p>
        </div>
      </div>
    </footer>
  );
}
