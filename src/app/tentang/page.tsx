'use client';

import { motion } from 'framer-motion';
import { Scissors, ShieldCheck, Users } from 'lucide-react';

export default function TentangPage() {
  return (
    <div className="w-full min-h-[70vh] bg-white font-sans text-zinc-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-6 sm:mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center"
        >
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-zinc-100 text-[#926C3A] border border-zinc-200 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase">
              <Scissors className="h-3.5 w-3.5" />
              <span>Tentang Milla Hair Studio</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 tracking-tight leading-tight">
              Pengalaman Perawatan Rambut Berkelas Dunia
            </h1>

            <p className="text-zinc-500 text-sm sm:text-lg leading-relaxed font-normal">
              Milla Hair Studio didirikan untuk menghadirkan tempat relaksasi dan perawatan rambut berstandar internasional bagi wanita modern Sidoarjo. Kami menggabungkan teknik penataan terkini dengan produk perawatan rambut alami pilihan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
                <ShieldCheck className="h-6 w-6 text-[#926C3A] mb-2" />
                <h4 className="font-bold text-sm text-zinc-900">Produk Bersertifikat</h4>
                <p className="text-xs text-zinc-500 mt-1">Menggunakan formula ramah kulit kepala tanpa zat kimia berbahaya.</p>
              </div>
              <div className="p-4 sm:p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
                <Users className="h-6 w-6 text-[#926C3A] mb-2" />
                <h4 className="font-bold text-sm text-zinc-900">Stylist Berpengalaman</h4>
                <p className="text-xs text-zinc-500 mt-1">Tim profesional yang tersertifikasi dalam teknik tren internasional.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600" 
              alt="Hair Treatment Studio"
              className="w-full h-56 sm:h-72 object-cover rounded-2xl shadow-sm border border-zinc-200"
            />
            <img 
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600" 
              alt="Styling Hair Studio"
              className="w-full h-56 sm:h-72 object-cover rounded-2xl shadow-sm border border-zinc-200 mt-4 sm:mt-8"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
