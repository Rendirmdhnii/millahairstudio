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
  const [activeSection, setActiveSection] = useState('beranda');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/', id: 'beranda' },
    { name: 'Tentang Kami', href: '/#tentang', id: 'tentang' },
    { name: 'Layanan & Harga', href: '/#layanan', id: 'layanan' },
    { name: 'Galeri Treatment', href: '/#galeri', id: 'galeri' },
    { name: 'Lokasi Studio', href: '/#lokasi', id: 'lokasi' },
  ];

  const waUrl = "https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20ingin%20bertanya%20seputar%20treatment";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname === '/') {
        const sections = navLinks.map(link => link.id).filter(id => id !== 'beranda');
        const scrollPosition = window.scrollY + 120;

        let current = 'beranda';
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              current = sectionId;
              break;
            }
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const isBookingActive = pathname === '/booking';

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-xs border-b border-zinc-200 py-1' 
        : 'bg-white/80 backdrop-blur-md border-b border-zinc-200/60 py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo with Real Image src/logosalon.png */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <Image 
                src={LogoImage} 
                alt="Milla Hair Studio" 
                width={160} 
                height={45} 
                className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-x-1 bg-zinc-100/80 p-1.5 rounded-full border border-zinc-200">
            {navLinks.map((link) => {
              const isActive = pathname === '/' && activeSection === link.id;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    if (pathname === '/') setActiveSection(link.id);
                  }}
                  className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
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
            <Link
              href="/booking"
              className={`inline-flex items-center gap-2 font-bold text-xs px-4.5 py-2.5 rounded-xl transition-all shadow-xs ${
                isBookingActive
                  ? 'bg-[#926C3A] text-white shadow-xs'
                  : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200'
              }`}
            >
              <Calendar className={`h-4 w-4 ${isBookingActive ? 'text-white' : 'text-[#926C3A]'}`} />
              <span>Form Booking</span>
            </Link>

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
              className="p-2.5 rounded-xl bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:outline-none transition-colors border border-zinc-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-zinc-200 shadow-lg"
          >
            <div className="px-5 pt-3 pb-8 space-y-3 max-w-md mx-auto">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === '/' && activeSection === link.id;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => {
                        if (pathname === '/') setActiveSection(link.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-[#926C3A] text-white shadow-xs'
                          : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-zinc-200 space-y-2">
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border ${
                    isBookingActive
                      ? 'bg-[#926C3A] text-white border-[#926C3A]'
                      : 'bg-zinc-100 text-zinc-800 border-zinc-200'
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
