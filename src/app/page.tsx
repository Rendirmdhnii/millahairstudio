'use client';

import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col font-sans text-zinc-900 bg-zinc-50 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH MOBILE-OPTIMIZED SPACING & 4.9 RATING BADGE */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-zinc-900 text-white overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600" 
            alt="Milla Hair Studio Salon Interior" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/95 to-zinc-900/80" />
        </div>
        
        <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-8 space-y-6 sm:space-y-8 text-left"
          >
            {/* Header Badges Grid (Location & 4.9 Rating) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-4 sm:px-5 py-1.5 sm:py-2">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#926C3A]" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#926C3A] uppercase">
                  Premium Salon • Sidoarjo
                </span>
              </div>

              {/* 4.9/5.0 Rating Element (Solid Star SVG + Text) */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#926C3A] fill-[#926C3A]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-zinc-200 tracking-wide">
                  4.9 / 5.0 Rating
                </span>
              </div>
            </div>
            
            {/* Heading - Responsive Font Size */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.18] sm:leading-[1.15] tracking-tight">
              Kecantikan Rambut Anda<br />
              <span className="text-[#926C3A]">
                Adalah Seni & Dedikasi.
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-zinc-300 text-sm sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
              Milla Hair Studio menghadirkan perawatan dan penataan rambut kelas dunia yang profesional, steril, dan penuh estetika modern di Sidoarjo. Pancarkan rasa percaya diri mahkota indah Anda bersama kami.
            </p>
            
            {/* Action Buttons with min-h-[48px] touch targets */}
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 pt-2 sm:pt-4">
              <motion.a 
                href="/booking"
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] rounded-xl shadow-xs transition-all"
              >
                <Calendar className="h-5 w-5" />
                <span>Form Booking Online</span>
              </motion.a>
              
              <motion.a 
                href="/layanan"
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] rounded-xl border border-white/20 backdrop-blur-md transition-all"
              >
                <span>Lihat Layanan & Harga</span>
                <ArrowRight className="h-4 w-4 text-[#926C3A]" />
              </motion.a>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-8 max-w-lg">
              <div className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1 text-[#926C3A] font-bold text-lg sm:text-2xl">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-[#926C3A]" />
                  <span>4.9 / 5.0</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold mt-1 tracking-wider uppercase">Rating Pelanggan</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#926C3A]">100%</p>
                <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold mt-1 tracking-wider uppercase">Steril & Higienis</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#926C3A]">Sidoarjo</p>
                <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold mt-1 tracking-wider uppercase">Pusat Kota</p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* BRIEF EXQUISITE BRAND STATEMENT SECTION */}
      <section className="py-20 bg-white text-center px-4 sm:px-6 lg:px-8 border-b border-zinc-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 tracking-tight leading-tight">
            Elevate Your Hair Aesthetics
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Setiap kunjungan ke Milla Hair Studio dirancang khusus untuk merevitalisasi dan memperindah mahkota rambut Anda secara mendalam menggunakan pelayanan berkualitas tinggi.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/tentang" className="text-xs font-bold uppercase tracking-wider text-[#926C3A] hover:underline">
              Selengkapnya tentang kami &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// Helper Link wrapper for clean next/link compatibility
import Link from 'next/link';
