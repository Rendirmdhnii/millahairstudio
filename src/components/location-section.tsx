'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';

export default function LocationSection() {
  const googleMapsDirectionsUrl = "https://maps.google.com/?q=Milla+Hair+Studio+Sidoarjo+Jl.+Kav.+DPR+I+No.26+Pagerwojo+Buduran+Sidoarjo";

  return (
    <section id="lokasi" className="py-24 bg-zinc-50 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Column: Text & Operational Info */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase text-[#926C3A] shadow-xs">
                <MapPin className="h-3.5 w-3.5 text-[#926C3A]" />
                <span>Lokasi Studio Kami</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 tracking-tight leading-tight">
                Kunjungi Studio Kami
              </h2>
              
              <div className="w-16 h-1 bg-[#926C3A] rounded-full my-3" />
              
              <p className="text-zinc-500 font-normal leading-relaxed text-base sm:text-lg max-w-xl">
                Nikmati suasana salon yang tenang, steril, dan bernuansa kemewahan modern di pusat kota Sidoarjo. Kami siap menyambut kehadiran Anda.
              </p>
            </div>

            {/* Address & Operating Hours Cards */}
            <div className="space-y-4 pt-2">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs"
              >
                <div className="p-3 bg-zinc-50 text-[#926C3A] rounded-xl flex-shrink-0 mt-0.5 border border-zinc-200">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Alamat Lengkap</h4>
                  <p className="text-sm font-semibold text-zinc-800 leading-relaxed mt-1">
                    Timur Jank Jank, Jl. Kav. DPR I No.26, Pagerwojo, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur 61219
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs"
              >
                <div className="p-3 bg-zinc-50 text-[#926C3A] rounded-xl flex-shrink-0 mt-0.5 border border-zinc-200">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Jam Operasional</h4>
                  <p className="text-sm font-bold text-zinc-800 mt-1">
                    Buka Setiap Hari: <span className="text-[#926C3A] font-extrabold">09.30 - 19.00 WIB</span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Navigation Button */}
            <div className="pt-2">
              <motion.a 
                href={googleMapsDirectionsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold text-base px-8 py-4 rounded-xl shadow-xs transition-all"
              >
                <Navigation className="h-5 w-5" />
                <span>Petunjuk Arah Google Maps</span>
                <ExternalLink className="h-4 w-4 opacity-80" />
              </motion.a>
            </div>
          </div>

          {/* Right Column: Google Maps Iframe Card */}
          <div className="lg:col-span-6 w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm relative">
            <iframe 
              src="https://maps.google.com/maps?q=Jl.%20Kav.%20DPR%20I%20No.26,%20Pagerwojo,%20Sidoarjo&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              className="w-full h-full min-h-[400px] border-0"
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Milla Hair Studio Location"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
