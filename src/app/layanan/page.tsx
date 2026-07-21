'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function LayananPage() {
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

  const [activeTab, setActiveTab] = useState(priceListCategories[0].id);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(priceListCategories[0].id);

  return (
    <div className="w-full min-h-[70vh] bg-zinc-50 font-sans text-zinc-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-6 sm:mt-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase text-[#926C3A] shadow-xs">
            <span>Menu & Daftar Harga</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 tracking-tight">
            Pilihan Perawatan Berkelas
          </h1>
          <div className="w-16 h-1 bg-[#926C3A] rounded-full mx-auto" />
          <p className="text-zinc-500 text-sm sm:text-lg font-normal leading-relaxed">
            Seluruh harga transparan dengan pengerjaan oleh stylist berpengalaman menggunakan produk internasional.
          </p>
        </motion.div>

        {/* DESKTOP & MOBILE TABS */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex overflow-x-auto justify-start sm:justify-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-zinc-200 shadow-xs max-w-4xl mx-auto scrollbar-none">
            {priceListCategories.map((category) => {
              const isActive = activeTab === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex-shrink-0 text-center py-3 px-4 sm:px-5 min-h-[44px] rounded-xl sm:rounded-full text-xs font-bold transition-all ${
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

          <div className="max-w-4xl mx-auto hidden md:block">
            {priceListCategories.map((category) => {
              if (category.id !== activeTab) return null;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-5 sm:p-8 border border-zinc-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 sm:gap-y-4 divide-y md:divide-y-0 divide-zinc-100">
                    {category.services.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-zinc-100 last:border-0 min-h-[44px] gap-3">
                        <span className="font-semibold text-zinc-800 text-xs sm:text-sm text-left leading-snug">{item.name}</span>
                        <span className="font-bold text-[#926C3A] text-xs sm:text-sm font-mono flex-shrink-0 text-right">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MOBILE ACCORDION */}
        <div className="md:hidden space-y-4 max-w-4xl mx-auto">
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
                        <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-zinc-50 last:border-0 min-h-[44px] gap-3">
                          <span className="font-medium text-zinc-700 text-left">{item.name}</span>
                          <span className="font-bold text-[#926C3A] font-mono flex-shrink-0">{item.price}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 text-center max-w-4xl mx-auto">
          <motion.a
            href="/booking"
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold text-xs sm:text-sm px-8 py-3.5 sm:py-4 min-h-[48px] rounded-xl shadow-xs transition-all w-full sm:w-auto"
          >
            <Calendar className="h-4 w-4" />
            <span>Reservasi Jadwal Sekarang</span>
          </motion.a>
        </div>

      </div>
    </div>
  );
}
