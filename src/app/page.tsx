'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationSection from '../components/location-section';
import { 
  Sparkles, Star, Scissors, MapPin, Clock, Gem, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, CheckCircle2, MessageCircle
} from 'lucide-react';

export default function LandingPage() {
  
  // WhatsApp Link Helper
  const waLink = "https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20tertarik%20untuk%20booking%20perawatan/tanya%20layanan.";

  // Comprehensive Price List Categories
  const priceListCategories = [
    {
      id: 'hair-treatment-styling',
      title: 'Hair Treatment & Styling',
      icon: Scissors,
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
      icon: Sparkles,
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
      icon: Gem,
      services: [
        { name: 'Apply Extension Keratin/Ring/Braid', price: '5k - 8k / Helai' },
        { name: 'Natural / Dramatic / Volume Eyelash', price: '180k - 250k' }
      ]
    },
    {
      id: 'body-treatment-nails',
      title: 'Body Treatment & Nails',
      icon: Star,
      services: [
        { name: 'Manicure / Pedicure / Reflexi', price: '75k - 150k' },
        { name: 'Bodyspa Scrub / V Ratus', price: '75k - 300k' },
        { name: 'Facial (Basic/Detox)', price: '85k - 250k' },
        { name: 'Nail Gel (Polos/Simple/Hard Design)', price: '180k - 230k' },
        { name: 'Nail Gel Halal + Mani/Pedi', price: '165k - 175k' }
      ]
    }
  ];

  // Active Tab for Desktop View
  const [activeTab, setActiveTab] = useState(priceListCategories[0].id);

  // Active Accordion Item for Mobile View
  const [activeAccordion, setActiveAccordion] = useState<string | null>(priceListCategories[0].id);

  // Products Data
  const products = [
    {
      id: 1,
      name: 'Milla Daily Silk Keratin Shampoo',
      description: 'Sampo harian premium dengan konsentrasi keratin tinggi untuk menjaga kehalusan rambut berwarna atau bekas smoothing.',
      price: 145000,
      volume: '250ml',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2a?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 2,
      name: 'Pure Argan Glow Hair Serum',
      description: 'Serum konsentrat minyak argan organik untuk melindungi rambut dari panas hair dryer sekaligus memberikan efek kilau berkilau sepanjang hari.',
      price: 180000,
      volume: '50ml',
      image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 3,
      name: 'Deep Repair Nourishing Hair Mask',
      description: 'Perawatan mingguan intensif untuk mengembalikan kelembapan rambut kering, bercabang, dan rusak akibat bahan kimia.',
      price: 125000,
      volume: '200ml',
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 4,
      name: 'Organic Scalp Care Tonic Essence',
      description: 'Tonik herbal berformula ringan untuk memperkuat akar rambut, mengurangi kerontokan, dan menjaga kesegaran kulit kepala.',
      price: 160000,
      volume: '100ml',
      image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=400'
    }
  ];

  // Format IDR Helper
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full flex flex-col font-sans text-stone-800 bg-white overflow-x-hidden">
      
      {/* 1. HERO SECTION (Staggered Load Animation) */}
      <section className="relative w-full min-h-[92vh] flex items-center bg-stone-900 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        
        {/* Background Luxury Image with Zoom & Dark Gradient */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600" 
            alt="Milla Hair Studio Luxury Salon Interior" 
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/95 to-stone-900/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,162,122,0.15),transparent_50%)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Block */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-8 space-y-8 text-left"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-stone-800/80 border border-gold-accent/40 backdrop-blur-md rounded-full px-5 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-gold-accent animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest text-gold-accent uppercase">
                Premium & Professional Hair Studio • Sidoarjo
              </span>
            </motion.div>
            
            {/* Heading */}
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white leading-[1.15] tracking-tight">
              Kecantikan Rambut Anda<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-amber-200 to-gold-accent">
                Adalah Seni & Dedikasi.
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p variants={fadeInUp} className="text-stone-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-light">
              Milla Hair Studio menghadirkan perawatan dan penataan rambut kelas dunia yang profesional, steril, dan penuh estetika modern di Sidoarjo. Pancarkan rasa percaya diri mahkota indah Anda bersama kami.
            </motion.p>
            
            {/* Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.a 
                href={waLink}
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: "0 12px 30px -5px rgba(200, 162, 122, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-gold-accent hover:bg-gold-accent-hover text-stone-950 font-extrabold text-base px-9 py-4.5 rounded-full shadow-lg transition-all duration-200 border border-gold-accent"
              >
                {/* WhatsApp Icon */}
                <svg className="h-5 w-5 fill-current text-stone-950" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                </svg>
                <span>Booking via WhatsApp</span>
              </motion.a>
              
              <motion.a 
                href="#layanan"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2.5 bg-stone-800/90 hover:bg-stone-800 text-white font-bold text-base px-8 py-4.5 rounded-full border border-stone-700 shadow-sm transition-all duration-200"
              >
                <span>Lihat Layanan & Harga</span>
                <ArrowRight className="h-4 w-4 text-gold-accent" />
              </motion.a>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 pt-8 max-w-lg">
              <motion.div whileHover={{ y: -4 }} className="bg-stone-800/60 backdrop-blur-md p-4.5 rounded-2xl border border-stone-700/60 text-center shadow-xs">
                <p className="text-xl sm:text-2xl font-extrabold text-gold-accent">4.9 ⭐</p>
                <p className="text-[10px] text-stone-400 font-bold mt-1 tracking-wider uppercase">Google Rating</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="bg-stone-800/60 backdrop-blur-md p-4.5 rounded-2xl border border-stone-700/60 text-center shadow-xs">
                <p className="text-xl sm:text-2xl font-extrabold text-gold-accent">100%</p>
                <p className="text-[10px] text-stone-400 font-bold mt-1 tracking-wider uppercase">Steril & Nyaman</p>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="bg-stone-800/60 backdrop-blur-md p-4.5 rounded-2xl border border-stone-700/60 text-center shadow-xs">
                <p className="text-xl sm:text-2xl font-extrabold text-gold-accent">Sidoarjo</p>
                <p className="text-[10px] text-stone-400 font-bold mt-1 tracking-wider uppercase">Pusat Kota</p>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES & PRICE LIST SECTION (Scroll Reveal & AnimatePresence Tabs/Accordion) */}
      <motion.section 
        id="layanan" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 lg:py-28 bg-stone-50 px-4 sm:px-6 lg:px-8 border-b border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-stone-900 text-gold-accent rounded-full px-5 py-1.5 text-[11px] font-bold tracking-widest uppercase shadow-xs">
              <Scissors className="h-3.5 w-3.5" />
              <span>Menu & Daftar Harga</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-stone-900 tracking-tight">
              Layanan Salon Perawatan & Styling
            </h2>
            <div className="w-20 h-1 bg-gold-accent mx-auto rounded-full my-3" />
            <p className="text-stone-600 font-normal leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
              Nikmati perawatan eksklusif yang dikerjakan oleh professional hair stylist Milla Hair Studio menggunakan produk bersertifikat internasional.
            </p>
          </div>

          {/* Desktop View: Interactive Animated Tabs */}
          <div className="hidden md:block">
            {/* Tabs Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 bg-white p-2 rounded-2xl border border-stone-200 shadow-sm max-w-4xl mx-auto">
              {priceListCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-stone-950' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryBg"
                        className="absolute inset-0 bg-gold-accent rounded-xl shadow-md"
                        transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                      />
                    )}
                    <IconComponent className={`relative z-10 h-4.5 w-4.5 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                    <span className="relative z-10">{category.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Content with AnimatePresence */}
            <div className="bg-white p-10 lg:p-14 rounded-3xl border border-stone-200/80 shadow-md max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-7"
                >
                  {priceListCategories
                    .find((c) => c.id === activeTab)
                    ?.services.map((service, index) => (
                      <motion.div 
                        key={index} 
                        whileHover={{ x: 4 }}
                        className="flex flex-col justify-center py-2.5 group"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-stone-900 font-bold text-[15px] group-hover:text-gold-accent-hover transition-colors leading-tight">
                            {service.name}
                          </span>
                          <div className="flex-1 border-b border-dashed border-stone-300 min-w-[20px] mx-1 relative top-[-4px]" />
                          <span className="text-stone-950 font-extrabold text-[15px] whitespace-nowrap bg-stone-100 px-3.5 py-1.5 rounded-lg border border-stone-200">
                            {service.price}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile View: AnimatePresence Accordion */}
          <div className="md:hidden space-y-4 max-w-md mx-auto">
            {priceListCategories.map((category) => {
              const IconComponent = category.icon;
              const isOpen = activeAccordion === category.id;
              return (
                <div 
                  key={category.id} 
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : category.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-stone-900 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-gold-accent text-stone-950' : 'bg-stone-100 text-stone-500'}`}>
                        <IconComponent className="h-4.5 w-4.5" />
                      </span>
                      <span className={`tracking-tight ${isOpen ? 'text-stone-950 font-bold' : ''}`}>{category.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-gold-accent" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-stone-400" />
                    )}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                        className="overflow-hidden border-t border-stone-100 bg-stone-50/70 p-5 space-y-3.5"
                      >
                        {category.services.map((service, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-stone-200/50 last:border-b-0 last:pb-0">
                            <span className="text-stone-900 text-xs font-semibold pr-4 leading-snug">{service.name}</span>
                            <span className="text-stone-950 font-bold text-xs bg-white px-3 py-1.5 rounded-md border border-stone-200 whitespace-nowrap shadow-xs">
                              {service.price}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* WhatsApp Call to Action Panel */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="mt-16 text-center max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-stone-900 text-white border border-gold-accent/30 shadow-xl relative overflow-hidden"
          >
            {/* Soft Metallic Glowing Accents */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-gold-accent/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
                Ingin Rambut Sehat & Memukau?
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                Konsultasikan keinginan Anda langsung dengan admin WhatsApp kami. Reservasi jadwal kedatangan dengan fleksibel dan dapatkan pelayanan terbaik.
              </p>
              <div className="pt-3">
                <motion.a 
                  href={waLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 30px -5px rgba(200, 162, 122, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 bg-gold-accent hover:bg-gold-accent-hover text-stone-950 font-extrabold text-base px-9 py-4.5 rounded-full shadow-lg transition-all duration-200 border border-gold-accent w-full sm:w-auto justify-center"
                >
                  <svg className="h-5 w-5 fill-current text-stone-950" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                  </svg>
                  <span>Reservasi Jadwal via WhatsApp</span>
                </motion.a>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* 3. PRODUCTS CATALOG SECTION (Staggered Cards & Hover Elevate) */}
      <motion.section 
        id="produk" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 lg:py-28 bg-white px-4 sm:px-6 lg:px-8 border-b border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 border border-stone-200 rounded-full px-5 py-1.5 text-[11px] font-bold tracking-widest uppercase">
              <Gem className="h-3.5 w-3.5 text-gold-accent" />
              <span>Katalog Produk Hair Care</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-stone-900 tracking-tight">
              Produk Perawatan Rambut Premium
            </h2>
            <div className="w-20 h-1 bg-gold-accent mx-auto rounded-full my-3" />
            <p className="text-stone-600 font-normal leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
              Bawa pulang formula rambut sehat bercahaya. Kami menyediakan produk orisinil khusus untuk menjaga kilau dan kelembutan pasca treatment.
            </p>
          </div>

          {/* Products Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.08)" }}
                transition={{ duration: 0.3 }}
                className="bg-stone-50 rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col justify-between group"
              >
                <div className="relative h-64 w-full overflow-hidden bg-stone-200">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <span className="absolute top-4 right-4 bg-stone-900 text-gold-accent text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md border border-gold-accent/30">
                    {product.volume}
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-gold-accent-hover transition-colors font-serif">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-normal leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-stone-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-lg font-extrabold text-stone-950 font-serif">
                      {formatPrice(product.price)}
                    </span>
                    <motion.a
                      href={`https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20tertarik%20membeli%20produk%20${encodeURIComponent(product.name)}.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 bg-stone-900 text-gold-accent text-xs font-bold px-4.5 py-2.5 rounded-full border border-gold-accent/30 shadow-xs transition-colors"
                    >
                      <span>Beli WA</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.section>

      {/* 4. GALLERY & PORTFOLIO SECTION */}
      <motion.section 
        id="galeri" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-24 lg:py-28 bg-stone-50 px-4 sm:px-6 lg:px-8 border-b border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-stone-900 text-gold-accent rounded-full px-5 py-1.5 text-[11px] font-bold tracking-widest uppercase shadow-xs">
              <Star className="h-3.5 w-3.5" />
              <span>Portofolio Karya & Studio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-stone-900 tracking-tight">
              Galeri Hasil Treatment
            </h2>
            <div className="w-20 h-1 bg-gold-accent mx-auto rounded-full my-3" />
            <p className="text-stone-600 font-normal leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
              Bukti komitmen seni, kepresisian potongan, kelembutan smoothing, dan kemewahan warna rambut pelanggan kami.
            </p>
          </div>

          {/* Gallery Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                title: 'Silk Smoothing Treatment',
                category: 'Smoothing',
                image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Luxury Balayage Blonde',
                category: 'Coloring',
                image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Signature Pixie Haircut',
                category: 'Haircut',
                image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Premium Creambath Ritual',
                category: 'Spa & Treatment',
                image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Clean Styling Area',
                category: 'Studio Atmosphere',
                image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Salon Front Desk',
                category: 'Luxury Lounge',
                image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600'
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square rounded-3xl overflow-hidden border border-stone-200 bg-stone-900 shadow-sm"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" 
                />
                
                {/* Subtle Permanent Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-gold-accent">
                    {item.category}
                  </span>
                  <h4 className="text-white text-sm sm:text-base font-bold font-serif mt-1">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 5. LOCATION & INFO SECTION */}
      <LocationSection />

    </div>
  );
}
