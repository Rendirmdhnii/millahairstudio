'use client';

import { useState } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '#' },
    { name: 'Layanan', href: '#layanan' },
    { name: 'Produk', href: '#produk' },
    { name: 'Galeri', href: '#galeri' },
    { name: 'Lokasi', href: '#lokasi' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center gap-2.5 group">
              <span className="p-2 rounded-full bg-stone-100 text-primary transition-all duration-300 group-hover:bg-primary/10">
                <Scissors className="h-6 w-6" />
              </span>
              <span className="text-xl font-bold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-primary">
                Milla Hair Studio
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-8 lg:gap-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold tracking-wide text-zinc-700 hover:text-primary transition-colors duration-250"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Button (WhatsApp CTA) */}
          <div className="hidden md:flex items-center">
            <a
              href="https://wa.me/6285645121008"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs px-6 py-3.5 rounded-full shadow transition-all duration-300 hover:scale-[1.02]"
            >
              {/* WhatsApp Icon */}
              <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
              </svg>
              Konsultasi WhatsApp
            </a>
          </div>

          {/* Mobile Hamburg Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-zinc-600 hover:text-primary focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-zinc-200/80 shadow-lg animate-fade-in-up">
          <div className="px-4 pt-2 pb-6 space-y-1.5 sm:px-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-xl text-base font-semibold text-zinc-700 hover:text-primary hover:bg-stone-50 transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="border-t border-zinc-150/50 my-4 pt-4">
              <a
                href="https://wa.me/6285645121008"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-full font-bold shadow-md transition-all hover:shadow-lg"
              >
                {/* WhatsApp Icon */}
                <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                </svg>
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
