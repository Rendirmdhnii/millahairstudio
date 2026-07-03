'use client';

import { useState } from 'react';
import { 
  Sparkles, Star, Scissors, MapPin, Clock, Check, ShieldCheck, Gem, ChevronDown, ChevronUp, Heart
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

  return (
    <div className="w-full flex flex-col font-sans text-stone-800 bg-white">
      
      {/* 1. HERO SECTION (Light Theme & Clean) */}
      <section className="relative w-full min-h-[90vh] flex items-center bg-stone-50 overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Realist Salon Interior Background */}
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600" 
            alt="Milla Hair Studio Luxury Salon Interior" 
            className="w-full h-full object-cover scale-100"
          />
        </div>
        
        {/* Soft elegant white gradient overlay for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />
        
        <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4.5 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-primary uppercase">Premium & Professional Hair Studio</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 leading-tight tracking-tight">
              Kecantikan Rambut Anda<br />
              <span className="text-primary">Adalah Seni & Dedikasi.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-zinc-650 leading-relaxed max-w-2xl font-normal">
              Milla Hair Studio menghadirkan layanan penataan rambut kelas dunia yang profesional, bersih, dan minimalis di Sidoarjo. Kami mendedikasikan keahlian seni tata rambut terbaik untuk memancarkan rasa percaya diri mahkota Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href={waLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-base px-8 py-4.5 rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* WhatsApp Icon */}
                <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                </svg>
                Booking via WhatsApp
              </a>
              
              <a 
                href="https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20ingin%20berkonsultasi%20sebelum%20perawatan." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-base px-8 py-4.5 rounded-full shadow-sm transition-all duration-300 hover:scale-[1.02]"
              >
                Konsultasi Layanan
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 max-w-lg">
              <div className="bg-white p-4 rounded-2xl border border-stone-150 text-center shadow-xs">
                <p className="text-xl sm:text-2xl font-extrabold text-zinc-900">4.9 ⭐</p>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5 tracking-wider uppercase">Google Rating</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-150 text-center shadow-xs">
                <p className="text-xl sm:text-2xl font-extrabold text-zinc-900">100%</p>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5 tracking-wider uppercase">Pelayanan Ramah</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-150 text-center shadow-xs">
                <p className="text-xl sm:text-2xl font-extrabold text-zinc-900">Sidoarjo</p>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5 tracking-wider uppercase">Lokasi Utama</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES & TREATMENTS SECTION (Layanan & Daftar Harga) */}
      <section id="layanan" className="py-24 bg-soft-pink/40 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white border border-gold-accent/20 text-gold-accent-hover rounded-full px-4.5 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-2xs">
              Menu & Daftar Harga
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-zinc-950 tracking-tight">
              Layanan Salon Kami
            </h2>
            <div className="w-16 h-1 bg-gold-accent mx-auto rounded-full my-2" />
            <p className="text-zinc-600 font-normal leading-relaxed text-sm sm:text-base">
              Nikmati perawatan eksklusif yang dikerjakan oleh professional hair stylist Milla Hair Studio menggunakan produk bersertifikat internasional.
            </p>
          </div>

          {/* Desktop View: Tabs & Dotted Menu List */}
          <div className="hidden md:block">
            {/* Tabs List */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 bg-white/50 p-2.5 rounded-2xl border border-zinc-200/60 backdrop-blur-md max-w-4xl mx-auto">
              {priceListCategories.map((category) => {
                const IconComponent = category.icon;
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'bg-gold-accent text-white shadow-md shadow-gold-accent/25 scale-[1.02]'
                        : 'text-zinc-650 hover:text-gold-accent hover:bg-white'
                    }`}
                  >
                    <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    {category.title}
                  </button>
                );
              })}
            </div>

            {/* Tab Panel Content */}
            <div className="bg-white p-10 lg:p-12 rounded-3xl border border-zinc-200/65 shadow-sm max-w-5xl mx-auto animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-6">
                {priceListCategories
                  .find((c) => c.id === activeTab)
                  ?.services.map((service, index) => (
                    <div key={index} className="flex flex-col justify-center py-2.5 group">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-zinc-950 font-bold text-[15px] group-hover:text-gold-accent transition-colors duration-250 leading-tight">
                          {service.name}
                        </span>
                        <div className="flex-1 border-b border-dashed border-zinc-300/80 min-w-[20px] mx-1 relative top-[-4px]" />
                        <span className="text-gold-accent-hover font-extrabold text-[15px] whitespace-nowrap bg-soft-pink/50 px-3.5 py-1.5 rounded-lg border border-gold-accent/15">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Mobile View: Accordion */}
          <div className="md:hidden space-y-4 max-w-md mx-auto">
            {priceListCategories.map((category) => {
              const IconComponent = category.icon;
              const isOpen = activeAccordion === category.id;
              return (
                <div 
                  key={category.id} 
                  className="bg-white rounded-2xl border border-zinc-200/85 shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : category.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-zinc-950 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-gold-accent text-white' : 'bg-stone-100 text-zinc-500'}`}>
                        <IconComponent className="h-4.5 w-4.5" />
                      </span>
                      <span className={`tracking-tight ${isOpen ? 'text-gold-accent-hover' : ''}`}>{category.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-gold-accent" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-zinc-400" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="border-t border-zinc-100 p-5 space-y-4 bg-stone-50/50 animate-fade-in-up">
                      {category.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-zinc-150/40 last:border-b-0 last:pb-0">
                          <span className="text-zinc-900 text-xs font-semibold pr-4 leading-snug">{service.name}</span>
                          <span className="text-gold-accent-hover font-bold text-xs bg-white px-2.5 py-1 rounded-md border border-gold-accent/20 shadow-2xs whitespace-nowrap">
                            {service.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* WhatsApp Call to Action Panel */}
          <div className="mt-16 text-center max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200/80 shadow-md relative overflow-hidden">
            {/* Decorative Soft Shapes */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-soft-pink rounded-full opacity-60 blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold-accent/10 rounded-full opacity-60 blur-xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 font-serif">
                Siap Tampil Memukau Bersama Kami?
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Tekan tombol di bawah untuk langsung terhubung dengan admin WhatsApp kami. Konsultasikan model rambut idaman Anda dan reservasi jadwal kedatangan dengan mudah.
              </p>
              <div className="pt-2">
                <a 
                  href="https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20tertarik%20untuk%20melakukan%20reservasi%20jadwal%20perawatan."
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gold-accent hover:bg-gold-accent-hover text-white font-bold text-base px-8 py-4.5 rounded-full shadow-lg shadow-gold-accent/25 hover:shadow-gold-accent/35 transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto justify-center cursor-pointer"
                >
                  <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.411 1.451 5.48.002 9.938-4.452 9.941-9.934.002-2.656-1.03-5.153-2.903-7.028-1.874-1.875-4.37-2.904-7.027-2.905-5.483 0-9.94 4.453-9.943 9.934-.001 1.914.5 3.791 1.453 5.4l-.994 3.633 3.717-.975zm12.39-6.07c-.3-.15-1.776-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.176-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.076-.175-.3-.02-.46.13-.61.135-.13.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.235-.244-.589-.492-.51-.676-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.495 1.7.63.717.227 1.37.195 1.885.118.574-.085 1.776-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                  </svg>
                  Reservasi Jadwal via WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PRODUCTS CATALOG SECTION */}
      <section id="produk" className="py-24 bg-stone-50 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1 bg-white text-stone-600 border border-stone-200 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
              Katalog Produk
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900">Produk Perawatan Rambut Premium</h2>
            <p className="text-zinc-500 font-normal leading-relaxed text-sm sm:text-base">
              Bawa pulang formula rambut sehat bercahaya. Kami menyediakan produk orisinil yang dirancang khusus untuk perawatan pasca treatment.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-primary/30"
              >
                <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                  />
                  <span className="absolute top-3 right-3 bg-zinc-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-xs">
                    {product.volume}
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-500 font-normal leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-base font-extrabold text-zinc-950">
                      {formatPrice(product.price)}
                    </span>
                    <a
                      href={`https://wa.me/6285645121008?text=Halo%20Milla%20Hair%20Studio,%20saya%20tertarik%20membeli%20produk%20${encodeURIComponent(product.name)}.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-zinc-800 text-xs font-bold px-4.5 py-2.5 rounded-full border border-stone-300 transition-colors"
                    >
                      Beli via WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GALLERY & PORTFOLIO */}
      <section id="galeri" className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
              Portofolio & Studio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900">Galeri Hasil Treatment</h2>
            <p className="text-zinc-500 font-normal leading-relaxed text-sm sm:text-base">
              Bukti komitmen seni, kepresisian potongan, kelembutan smoothing, dan kemewahan warna rambut pelanggan kami.
            </p>
          </div>

          {/* Gallery Grid (2 col mobile, 3 col tablet/desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Silk Smoothing Treatment',
                image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Luxury Balayage Blonde',
                image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Signature Pixie Haircut',
                image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Premium Creambath Ritual',
                image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Clean Styling Area',
                image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Salon Front Desk',
                image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600'
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="group relative aspect-square rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shadow-xs"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                  <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LOCATION & INFO */}
      <section id="lokasi" className="py-24 bg-stone-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Map Column */}
            <div className="lg:col-span-7 w-full h-96 rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4022830869766!2d112.7235084!3d-7.420658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e1329a43a0f7%3A0xe54d6824982f6e52!2sJank%20Jank%20Chicken%20Sidoarjo!5e0!3m2!1sid!2sid!4v1687500000000!5m2!1sid!2sid" 
                className="w-full h-full border-none"
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                  Lokasi Studio
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Milla Hair Studio Sidoarjo</h2>
              </div>
              
              <p className="text-sm sm:text-base text-zinc-650 leading-relaxed font-normal">
                Salon kami terletak strategis di pusat kota Sidoarjo, dirancang secara bersih dan steril untuk menghadirkan ketenangan penuh selama Anda melakukan perawatan.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                    Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Pagerwojo, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur 61219
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-zinc-700">
                    <p className="font-semibold">Buka Setiap Hari:</p>
                    <p>Senin - Minggu | 09.30 - 20.00 WIB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-4">
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-md transition-all hover:scale-[1.01]"
                >
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
