'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import LocationSection from '../components/location-section';
import { 
  Sparkles, Scissors, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, Calendar, Users, Camera, Star
} from 'lucide-react';

// Static Imports of Real Treatment Images
import imgHaircut from '@/haircut layer.png';
import imgHairdo from '@/hairdo.png';
import imgKeratin from '@/keratin.png';
import imgSmoothing from '@/smooting.png';

export default function LandingPage() {
  
  // Price List Categories (No icons inside buttons - Clean Pure Text UI)
  const priceListCategories = [
    {
      id: 'hair-treatment-styling',
      title: 'Hair Treatment & Styling',
      services: [
        { name: 'Ladies Haircut (Owner)', price: '125k' },
        { name: 'Ladies Haircut By Hairdresser', price: '100k' },
        { name: 'Gent Haircut', price: '50k' },
        { name: 'Hairspa / Hairmask (Keratin/Matrix/MK Texture)', price: '150k - 200k' },
        { name: 'Scalp / Hairfall Treatment', price: '200k' },
        { name: 'Wash & Dry / Flat Iron / Curly', price: '45k - 110k' },
        { name: 'Hairdo / Halfdo', price: '130k - 150k' }
      ]
    },
    {
      id: 'hair-color-smoothing-perm',
      title: 'Hair Color, Smoothing & Perm',
      services: [
        { name: 'Basic Color Vegan (No Bleach)', price: '300k - 900k + UP' },
        { name: 'Balyage / Highlight', price: '480k - 900k + UP' },
        { name: 'Bleach + Fashion Color', price: '500k - 950k + UP' },
        { name: 'Smoothing Collagen / Japan Nano Keratin', price: '400k - 980k + UP' },
        { name: 'Keratin Filler', price: 'Start From 470k - 1000k + UP' },
        { name: 'Down Perm Poni / Cold Perm', price: '250k - 600k + UP' }
      ]
    },
    {
      id: 'hair-extension-eyelash',
      title: 'Hair Extension & Eyelash',
      services: [
        { name: 'Apply Extension Keratin/Ring/Braid', price: '5k - 8k / Helai' },
        { name: 'Natural / Dramatic / Volume Eyelash', price: '180k - 250k' }
      ]
    },
    {
      id: 'body-treatment-nails',
      title: 'Body Treatment & Nails',
      services: [
        { name: 'Manicure / Pedicure / Reflexi', price: '75k - 150k' },
        { name: 'Bodyspa Scrub / V Ratus', price: '75k - 300k' },
        { name: 'Facial (Basic/Detox)', price: '85k - 250k' },
        { name: 'Nail Gel (Polos/Simple/Hard Design)', price: '180k - 230k' },
        { name: 'Nail Gel Halal + Mani/Pedi', price: '165k - 175k' }
      ]
    }
  ];

  // Active Tab & Accordion
  const [activeTab, setActiveTab] = useState(priceListCategories[0].id);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(priceListCategories[0].id);

  // Real Salon Portfolio Gallery Showcase Data
  const galleryItems = [
    {
      id: 1,
      title: 'Premium Hairdo & Styling',
      category: 'STYLING',
      image: imgHairdo
    },
    {
      id: 2,
      title: 'Signature Smoothing',
      category: 'SMOOTHING',
      image: imgSmoothing
    },
    {
      id: 3,
      title: 'Ladies Layer Haircut',
      category: 'HAIRCUT',
      image: imgHaircut
    },
    {
      id: 4,
      title: 'Keratin Filler Treatment',
      category: 'TREATMENT',
      image: imgKeratin
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans text-zinc-900 bg-zinc-50 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH ELEGANT 4.9/5.0 RATING BADGE */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[88vh] flex items-center bg-zinc-900 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600" 
            alt="Milla Hair Studio Salon Interior" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/95 to-zinc-900/80" />
        </div>
        
        <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-8 space-y-8 text-left"
          >
            {/* Header Badges Grid (Location & 4.9 Rating) */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2">
                <Sparkles className="h-4 w-4 text-[#926C3A]" />
                <span className="text-[11px] font-bold tracking-widest text-[#926C3A] uppercase">
                  Premium Salon • Sidoarjo
                </span>
              </div>

              {/* 4.9/5.0 Rating Element (Solid Star SVG + Text) */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-[#926C3A] fill-[#926C3A]" />
                <span className="text-[11px] font-bold text-zinc-200 tracking-wide">
                  4.9 / 5.0 Rating
                </span>
              </div>
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.15] tracking-tight">
              Kecantikan Rambut Anda<br />
              <span className="text-[#926C3A]">
                Adalah Seni & Dedikasi.
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-zinc-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
              Milla Hair Studio menghadirkan perawatan dan penataan rambut kelas dunia yang profesional, steril, dan penuh estetika modern di Sidoarjo. Pancarkan rasa percaya diri mahkota indah Anda bersama kami.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.a 
                href="/booking"
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold text-base px-8 py-4 rounded-xl shadow-xs transition-all"
              >
                <Calendar className="h-5 w-5" />
                <span>Form Booking Online</span>
              </motion.a>
              
              <motion.a 
                href="#layanan"
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base px-8 py-4 rounded-xl border border-white/20 backdrop-blur-md transition-all"
              >
                <span>Lihat Layanan & Harga</span>
                <ArrowRight className="h-4 w-4 text-[#926C3A]" />
              </motion.a>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#926C3A] font-bold text-xl sm:text-2xl">
                  <Star className="h-5 w-5 fill-[#926C3A]" />
                  <span>4.9 / 5.0</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-bold mt-1 tracking-wider uppercase">Rating Pelanggan</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#926C3A]">100%</p>
                <p className="text-[10px] text-zinc-400 font-bold mt-1 tracking-wider uppercase">Steril & Higienis</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#926C3A]">Sidoarjo</p>
                <p className="text-[10px] text-zinc-400 font-bold mt-1 tracking-wider uppercase">Pusat Kota</p>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT SECTION */}
      {/* ========================================================================= */}
      <section id="tentang" className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-zinc-100 text-[#926C3A] border border-zinc-200 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase">
                <Scissors className="h-3.5 w-3.5" />
                <span>Tentang Milla Hair Studio</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 tracking-tight leading-tight">
                Pengalaman Perawatan Rambut Berkelas Dunia
              </h2>

              <p className="text-zinc-500 text-base sm:text-lg leading-relaxed font-normal">
                Milla Hair Studio didirikan untuk menghadirkan tempat relaksasi dan perawatan rambut berstandar internasional bagi wanita modern Sidoarjo. Kami menggabungkan teknik penataan terkini dengan produk perawatan rambut alami pilihan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <ShieldCheck className="h-6 w-6 text-[#926C3A] mb-2" />
                  <h4 className="font-bold text-sm text-zinc-900">Produk Bersertifikat</h4>
                  <p className="text-xs text-zinc-500 mt-1">Menggunakan formula ramah kulit kepala tanpa zat kimia berbahaya.</p>
                </div>
                <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <Users className="h-6 w-6 text-[#926C3A] mb-2" />
                  <h4 className="font-bold text-sm text-zinc-900">Stylist Berpengalaman</h4>
                  <p className="text-xs text-zinc-500 mt-1">Tim profesional yang tersertifikasi dalam teknik tren internasional.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600" 
                alt="Hair Treatment Studio"
                className="w-full h-72 object-cover rounded-2xl shadow-sm border border-zinc-200"
              />
              <img 
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600" 
                alt="Styling Hair Studio"
                className="w-full h-72 object-cover rounded-2xl shadow-sm border border-zinc-200 mt-8"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SERVICES & PRICELIST SECTION (CLEAN PURE TEXT TABS - NO ICONS) */}
      {/* ========================================================================= */}
      <section id="layanan" className="py-24 bg-zinc-50 px-4 sm:px-6 lg:px-8 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase text-[#926C3A] shadow-xs">
              <span>Menu & Daftar Harga</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 tracking-tight">
              Pilihan Perawatan Berkelas
            </h2>
            <div className="w-16 h-1 bg-[#926C3A] rounded-full mx-auto" />
            <p className="text-zinc-500 text-base sm:text-lg font-normal leading-relaxed">
              Seluruh harga transparan dengan pengerjaan oleh stylist berpengalaman menggunakan produk internasional.
            </p>
          </motion.div>

          {/* DESKTOP TABS (PURE CLEAN TEXT ONLY - NO ICONS) */}
          <div className="hidden md:block space-y-8">
            <div className="flex justify-center gap-2 bg-white p-2 rounded-full border border-zinc-200 shadow-xs max-w-4xl mx-auto">
              {priceListCategories.map((category) => {
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex-1 text-center py-3.5 px-5 rounded-full text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#926C3A] text-white shadow-xs' 
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{category.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="max-w-4xl mx-auto">
              {priceListCategories.map((category) => {
                if (category.id !== activeTab) return null;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 divide-y md:divide-y-0 divide-zinc-100">
                      {category.services.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-3 border-b border-zinc-100 last:border-0">
                          <span className="font-semibold text-zinc-800 text-sm">{item.name}</span>
                          <span className="font-bold text-[#926C3A] text-sm font-mono">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* MOBILE ACCORDION (PURE CLEAN TEXT ONLY) */}
          <div className="md:hidden space-y-4">
            {priceListCategories.map((category) => {
              const isOpen = activeAccordion === category.id;
              return (
                <div key={category.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : category.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-zinc-900 text-sm"
                  >
                    <span>{category.title}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-[#926C3A]" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5 pt-1 border-t border-zinc-100 space-y-3"
                      >
                        {category.services.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-zinc-50 last:border-0">
                            <span className="font-medium text-zinc-700">{item.name}</span>
                            <span className="font-bold text-[#926C3A] font-mono">{item.price}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <motion.a
              href="/booking"
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-xs transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>Reservasi Jadwal Sekarang</span>
            </motion.a>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. GALLERY SECTION WITH REAL SALON IMAGES (STATIC IMPORTS & BLUR PLACEHOLDER) */}
      {/* ========================================================================= */}
      <section id="galeri" className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-zinc-100 text-[#926C3A] border border-zinc-200 px-5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase">
              <Camera className="h-3.5 w-3.5" />
              <span>Galeri Portofolio Treatment</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 tracking-tight">
              Hasil Karya Hair Stylist Kami
            </h2>
            <div className="w-16 h-1 bg-[#926C3A] rounded-full mx-auto" />
            <p className="text-zinc-500 text-base sm:text-lg font-normal leading-relaxed">
              Koleksi dokumentasi nyata penataan dan perawatan rambut pelanggan setia Milla Hair Studio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="h-72 w-full overflow-hidden bg-zinc-200 relative">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    placeholder="blur"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white font-bold text-[10px] uppercase px-3.5 py-1 rounded-full border border-white/10 shadow-xs">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 text-left">
                  <h3 className="font-bold text-sm text-zinc-900">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LOCATION INTEGRATION SECTION */}
      {/* ========================================================================= */}
      <LocationSection />

    </div>
  );
}
