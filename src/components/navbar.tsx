'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Scissors, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '#', id: 'beranda' },
    { name: 'Layanan & Harga', href: '#layanan', id: 'layanan' },
    { name: 'Produk', href: '#produk', id: 'produk' },
    { name: 'Galeri', href: '#galeri', id: 'galeri' },
    { name: 'Lokasi', href: '#lokasi', id: 'lokasi' },
  ];

  const waUrl = "https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20tertarik%20untuk%20booking%20perawatan/tanya%20layanan.";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-stone-200/60 py-1' 
        : 'bg-white/70 backdrop-blur-md border-b border-stone-150/40 py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center gap-3 group">
              <motion.span 
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="p-2.5 rounded-2xl bg-stone-900 text-gold-accent shadow-sm"
              >
                <Scissors className="h-5 w-5" />
              </motion.span>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-stone-900 font-serif group-hover:text-gold-accent-hover transition-colors">
                  Milla Hair Studio
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-650 -mt-1">
                  Luxury Salon & Spa
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-1 lg:gap-x-2 bg-stone-100/70 p-1.5 rounded-full border border-stone-200/50">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={`relative px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-stone-200/60"
                      transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Button (WhatsApp CTA) */}
          <div className="hidden md:flex items-center">
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: "0 10px 25px -5px rgba(200, 162, 122, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-gold-accent font-bold text-xs px-6 py-3.5 rounded-full shadow-sm transition-all duration-200 border border-gold-accent/30"
            >
              {/* WhatsApp Icon */}
              <svg className="h-4 w-4 fill-current text-gold-accent" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
              </svg>
              <span>Konsultasi WA</span>
            </motion.a>
          </div>

          {/* Mobile Hamburg Toggle */}
          <div className="flex md:hidden items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200 focus:outline-none transition-colors border border-stone-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Panel with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-xl"
          >
            <div className="px-5 pt-3 pb-8 space-y-3 max-w-md mx-auto">
              <div className="space-y-1">
                {navLinks.map((link, idx) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      onClick={() => {
                        setActiveSection(link.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-stone-900 text-gold-accent shadow-sm'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className={`h-4 w-4 ${isActive ? 'text-gold-accent' : 'text-stone-400'}`} />
                    </motion.a>
                  );
                })}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                className="pt-4 border-t border-stone-150"
              >
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-3 bg-stone-900 text-gold-accent py-4 rounded-2xl font-bold text-sm shadow-md border border-gold-accent/30 active:scale-[0.98] transition-transform"
                >
                  <svg className="h-5 w-5 fill-current text-gold-accent" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                  </svg>
                  <span>Konsultasi WhatsApp</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
