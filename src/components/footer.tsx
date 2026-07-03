'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Scissors, Heart, Clock } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-stone-50 text-zinc-700 border-t border-zinc-200 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-full bg-primary/10 text-primary">
                <Scissors className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                Milla Hair Studio
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-normal">
              Salon wanita modern di Sidoarjo yang menghadirkan perawatan rambut profesional, penataan modis, dan kehangatan pelayanan berkualitas tinggi.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram SVG */}
              <a href="#" className="p-2 rounded-full bg-white border border-zinc-200 hover:bg-primary hover:text-white transition-all duration-300">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* Facebook SVG */}
              <a href="#" className="p-2 rounded-full bg-white border border-zinc-200 hover:bg-primary hover:text-white transition-all duration-300">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-zinc-900 font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-primary pl-2">
              Menu Utama
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">Layanan Kami</Link>
              </li>
              <li>
                <Link href="/stylists" className="hover:text-primary transition-colors">Pakar Stylist</Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-primary transition-colors">Membership VIP</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">Katalog Produk</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">Artikel & Tips</Link>
              </li>
            </ul>
          </div>

          {/* Business Contacts */}
          <div className="lg:col-span-2">
            <h3 className="text-zinc-900 font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-primary pl-2">
              Hubungi Kami & Jam Buka
            </h3>
            <ul className="space-y-3.5 text-sm text-zinc-600">
              <li className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                <span>
                  <strong>Alamat Salon:</strong><br />
                  Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Pagerwojo, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur 61219
                </span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>
                  <strong>Telepon / WhatsApp:</strong><br />
                  <a href="https://wa.me/6285645121008" target="_blank" rel="noopener noreferrer" className="hover:underline text-primary font-semibold">0856-4512-1008</a>
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Jam Operasional:</strong><br />
                  Senin - Minggu | 09.30 - 20.00 WIB
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-zinc-200 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Milla Hair Studio Sidoarjo. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="h-3 w-3 text-primary fill-primary" /> untuk kenyamanan dan keindahan rambut Anda.
          </p>
        </div>
      </div>
    </footer>
  );
}
