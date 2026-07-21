'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Calendar, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoImage from '@/logosalon.png';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang' },
    { name: 'Layanan & Harga', href: '/layanan' },
    { name: 'Galeri Treatment', href: '/galeri' },
    { name: 'Lokasi Studio', href: '/lokasi' },
  ];

  const waUrl = "https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20ingin%20bertanya%20seputar%20treatment";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isBookingActive = pathname === '/booking';

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg border-b border-zinc-800/80 py-2.5' 
        : 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-24 items-center justify-between gap-4">
          
          {/* Brand Logo with Flexible Container & Drop Shadow over Dark Background */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="relative flex items-center h-16 sm:h-20 group">
              <Image 
                src={LogoImage} 
                alt="Milla Hair Studio" 
                width={280} 
                height={280} 
                className="w-auto h-full object-contain filter drop-shadow-lg transition-transform group-hover:scale-105"
                priority={true}
              />
            </Link>
          </div>

          {/* Desktop Navigation Links (Dark Mode Styling with Pathname matching) */}
          <nav className="hidden md:flex items-center gap-x-1 bg-zinc-900/90 p-1.5 rounded-full border border-zinc-800/80 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-[#926C3A] rounded-full shadow-xs"
                      transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Form Booking Button */}
            <Link
              href="/booking"
              className={`inline-flex items-center gap-2 font-bold text-xs px-4.5 py-2.5 rounded-xl transition-all shadow-xs border ${
                isBookingActive
                  ? 'bg-[#926C3A] text-white border-[#926C3A]'
                  : 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white'
              }`}
            >
              <Calendar className={`h-4 w-4 ${isBookingActive ? 'text-white' : 'text-[#926C3A]'}`} />
              <span>Form Booking</span>
            </Link>

            {/* Konsultasi WA Button */}
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200"
            >
              <MessageSquare className="h-4 w-4 text-white" />
              <span>Konsultasi WA</span>
            </motion.a>
          </div>

          {/* Mobile Hamburg Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 text-zinc-200 hover:bg-zinc-800 focus:outline-none transition-colors border border-zinc-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (Dark Mode) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 shadow-2xl"
          >
            <div className="px-5 pt-3 pb-8 space-y-3 max-w-md mx-auto">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#926C3A] text-white shadow-xs'
                          : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border ${
                    isBookingActive
                      ? 'bg-[#926C3A] text-white border-[#926C3A]'
                      : 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  <Calendar className={`h-4 w-4 ${isBookingActive ? 'text-white' : 'text-[#926C3A]'}`} />
                  <span>Form Booking Online</span>
                </Link>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#926C3A] text-white py-3 rounded-xl font-bold text-sm shadow-xs"
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                  <span>Konsultasi WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
