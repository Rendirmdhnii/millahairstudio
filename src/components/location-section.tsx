'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, Phone, ExternalLink } from 'lucide-react';

export default function LocationSection() {
  // Google Maps Direct Navigation Link
  const googleMapsDirectionsUrl = "https://maps.google.com/?q=Milla+Hair+Studio+Sidoarjo+Jl.+Kav.+DPR+I+No.26+Pagerwojo+Buduran+Sidoarjo";

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="lokasi" className="py-20 lg:py-28 bg-stone-50 px-4 sm:px-6 lg:px-8 border-b border-stone-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Column: Text & Operational Information */}
          <motion.div variants={itemVariants} className="lg:col-span-6 space-y-8 text-left">
            {/* Header Badge & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-stone-900 text-gold-accent px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-xs">
                <MapPin className="h-3.5 w-3.5" />
                <span>Lokasi Studio Kami</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-stone-900 tracking-tight leading-tight">
                Kunjungi Studio Kami
              </h2>
              
              <div className="w-20 h-1 bg-gold-accent rounded-full my-3" />
              
              <p className="text-stone-600 font-normal leading-relaxed text-base sm:text-lg max-w-xl">
                Nikmati suasana salon yang tenang, steril, dan bernuansa kemewahan modern di pusat kota Sidoarjo. Kami siap menyambut kehadiran Anda.
              </p>
            </div>

            {/* Address & Operating Hours Cards */}
            <div className="space-y-4 pt-2">
              {/* Address Card */}
              <motion.div 
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-gold-accent/40"
              >
                <div className="p-3 bg-stone-900 text-gold-accent rounded-xl flex-shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-stone-400 tracking-wider">Alamat Lengkap</h4>
                  <p className="text-sm font-semibold text-stone-800 leading-relaxed mt-1">
                    Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Pagerwojo, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur 61219
                  </p>
                </div>
              </motion.div>
              
              {/* Operating Hours Card */}
              <motion.div 
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-gold-accent/40"
              >
                <div className="p-3 bg-stone-900 text-gold-accent rounded-xl flex-shrink-0 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-stone-400 tracking-wider">Jam Operasional</h4>
                  <p className="text-sm font-bold text-stone-800 mt-1">
                    Buka Setiap Hari: <span className="text-gold-accent-hover">09.30 - 20.00 WIB</span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <motion.a 
                href={googleMapsDirectionsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: "0 10px 25px -5px rgba(200, 162, 122, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 bg-gold-accent hover:bg-gold-accent-hover text-stone-950 font-extrabold text-base px-8 py-4 rounded-full shadow-md transition-all border border-gold-accent"
              >
                <Navigation className="h-5 w-5 fill-current text-stone-950" />
                <span>Petunjuk Arah</span>
                <ExternalLink className="h-4 w-4 opacity-70" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Google Maps Iframe Card Wrapper */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-6 w-full h-[420px] sm:h-[480px] min-h-[400px] rounded-3xl overflow-hidden border border-stone-200/90 bg-white shadow-xl relative group"
          >
            {/* Embedded Google Maps Iframe */}
            <iframe 
              src="ISI_DENGAN_LINK_EMBED_MAPS" 
              className="w-full h-full min-h-[400px] border-0"
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Milla Hair Studio Google Maps Location"
            />

            {/* Subtle Overlay Border Gradient for Enterprise Finish */}
            <div className="absolute inset-0 rounded-3xl border border-stone-950/5 pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
