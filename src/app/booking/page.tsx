'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scissors, Calendar, Clock, User, Phone, Sparkles, 
  CheckCircle2, ArrowRight, Loader2, MessageSquare, ShieldCheck
} from 'lucide-react';
import { useMillaStore } from '@/store/useMillaStore';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

export default function PublicBookingPage() {
  const { services, addSupabaseBooking } = useMillaStore();

  // Form State
  const [fullName, setFullName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]?.name || 'Signature Milla Haircut & Blow');
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('14:00');

  // Submit & Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Admin WhatsApp Phone Number for Redirection
  const ADMIN_WA_NUMBER = '628119999222'; // Official Admin Milla Studio WhatsApp

  // Time Slot Options
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !whatsappPhone || !selectedService || !bookingDate || !bookingTime) {
      alert('Mohon isi semua bidang formulir reservasi.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Insert into Supabase table `bookings` with status 'pending'
      const { data, error } = await supabase.from('bookings').insert([
        {
          customer_name: fullName,
          customer_phone: whatsappPhone,
          service_name: selectedService,
          booking_date: bookingDate,
          booking_time: bookingTime,
          status: 'pending',
          total_payment: 0
        }
      ]);

      if (error) {
        console.warn('Supabase Insert Notice (Fallback to Local Store):', error.message);
      }

      // 2. Also save to Zustand persistent store for instant synchronization
      addSupabaseBooking({
        customer_name: fullName,
        customer_phone: whatsappPhone,
        service_name: selectedService,
        booking_date: bookingDate,
        booking_time: bookingTime,
        status: 'pending',
        total_payment: 0
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      // 3. Construct WhatsApp Message URL
      const waText = `Halo Admin Milla Hair Studio, saya baru saja melakukan reservasi melalui website. Berikut detailnya:\n\nNama: ${fullName}\nLayanan: ${selectedService}\nTanggal: ${bookingDate}\nJam: ${bookingTime}\n\nMohon konfirmasinya.`;
      const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(waText)}`;

      // 4. Redirect User to WhatsApp API in new tab
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 800);

    } catch (err) {
      console.error('Booking submission error:', err);
      setIsSubmitting(false);
      alert('Terjadi kesalahan saat memproses booking. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-zinc-900 to-stone-950 text-white font-sans flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Container with Framer Motion Fade-Up Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-10 relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-pink-200">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Milla Hair Studio - Online Booking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
            Reservasi Hair Treatment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
            Isi formulir di bawah untuk mencatat jadwal kunjungan Anda. Pembayaran dilakukan di kasir salon saat treatment.
          </p>
        </div>

        {/* SUCCESS STATE NOTICE */}
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/20 border border-emerald-400/40 p-6 rounded-2xl text-center space-y-3"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-serif font-bold text-white">Reservasi Berhasil Dicatat!</h3>
            <p className="text-xs text-zinc-200">
              Data booking Anda telah tersimpan dengan status <span className="font-bold text-amber-300">Pending</span>. Anda sedang dialihkan ke WhatsApp Admin untuk mengonfirmasi jadwal.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(`Halo Admin Milla Hair Studio, saya baru saja melakukan reservasi melalui website. Berikut detailnya:\n\nNama: ${fullName}\nLayanan: ${selectedService}\nTanggal: ${bookingDate}\nJam: ${bookingTime}\n\nMohon konfirmasinya.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-lg"
              >
                <MessageSquare className="h-4 w-4" />
                Buka WhatsApp Admin Sekarang
              </a>
            </div>
          </motion.div>
        ) : (
          /* BOOKING FORM */
          <form onSubmit={handleSubmitBooking} className="space-y-5 text-left">
            
            {/* 1. NAMA LENGKAP */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                <User className="h-3.5 w-3.5 text-primary" />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda..."
                className="w-full text-xs p-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-zinc-400 focus:outline-none focus:border-primary focus:bg-white/15 transition-all"
                required
              />
            </div>

            {/* 2. NOMOR WHATSAPP */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="Contoh: 08123456789..."
                className="w-full text-xs p-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all font-mono"
                required
              />
            </div>

            {/* 3. PILIHAN LAYANAN (DROPDOWN) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Scissors className="h-3.5 w-3.5 text-primary" />
                Pilihan Layanan Treatment
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full text-xs p-3.5 bg-zinc-900 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                required
              >
                {services.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} - ({formatPrice(s.price)})
                  </option>
                ))}
                <option value="Balayage Korean Color & Gloss">Balayage Korean Color & Gloss (Rp 1.100.000)</option>
                <option value="Detoxifying Clay Scalp Ritual">Detoxifying Clay Scalp Ritual (Rp 450.000)</option>
                <option value="Premium Keratin Blowout Smooth">Premium Keratin Blowout Smooth (Rp 1.200.000)</option>
              </select>
            </div>

            {/* 4. TANGGAL & JAM (2 COLUMNS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Tanggal Kunjungan
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full text-xs p-3.5 bg-zinc-900 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              {/* Jam */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Jam Kedatangan
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full text-xs p-3.5 bg-zinc-900 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-primary transition-all"
                  required
                >
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t} WIB</option>
                  ))}
                </select>
              </div>

            </div>

            {/* INFORMASI PEMBAYARAN KASIR */}
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2.5 text-[11px] text-zinc-300">
              <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <span>
                Pembayaran dilakukan secara langsung di <strong className="text-white">Kasir Salon (Fisik)</strong> saat treatment selesai.
              </span>
            </div>

            {/* SUBMIT BUTTON WITH LOADING SPINNER */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary via-pink-500 to-primary hover:opacity-95 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Menyimpan Reservasi...</span>
                </>
              ) : (
                <>
                  <span>Booking Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>
        )}

      </motion.div>
    </div>
  );
}
