'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

// Static Imports of Real Treatment Images
import imgHaircut from '@/haircut layer.png';
import imgHairdo from '@/hairdo.png';
import imgKeratin from '@/keratin.png';
import imgSmoothing from '@/smooting.png';

export default function GaleriPage() {
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
    <div className="w-full min-h-[70vh] bg-white font-sans text-zinc-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-6 sm:mt-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-zinc-100 text-[#926C3A] border border-zinc-200 px-5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase">
            <Camera className="h-3.5 w-3.5" />
            <span>Galeri Portofolio Treatment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 tracking-tight">
            Hasil Karya Hair Stylist Kami
          </h1>
          <div className="w-16 h-1 bg-[#926C3A] rounded-full mx-auto" />
          <p className="text-zinc-500 text-sm sm:text-lg font-normal leading-relaxed">
            Koleksi dokumentasi nyata penataan dan perawatan rambut pelanggan setia Milla Hair Studio.
          </p>
        </motion.div>

        {/* RESPONSIVE GRID: 1-COL (MOBILE) / 2-COL (TABLET) / 4-COL (DESKTOP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-64 sm:h-72 w-full overflow-hidden bg-zinc-200 relative">
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
              <div className="p-4 sm:p-5 text-left flex-1 flex items-center">
                <h3 className="font-bold text-xs sm:text-sm text-zinc-900">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
