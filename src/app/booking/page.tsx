'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scissors, Calendar, Clock, User, Phone, Sparkles, 
  CheckCircle2, ArrowRight, Loader2, MessageSquare, ShieldCheck, ChevronDown
} from 'lucide-react';
import { useMillaStore } from '@/store/useMillaStore';
import { supabase } from '@/lib/supabase';

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

  // Official Admin WhatsApp Phone Number
  const ADMIN_WA_NUMBER = '6285645121008';

  // Time Slots (Cut-off Last Order max 18:00 WIB agar tidak mepet jam tutup 19:00)
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Helper Format Tanggal Indonesia dengan Nama Hari
  const getFormattedIndonesianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };

  const formattedDateText = getFormattedIndonesianDate(bookingDate);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !whatsappPhone || !selectedService || !bookingDate || !bookingTime) {
      alert('Mohon isi semua bidang formulir reservasi.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Insert into Supabase table `bookings` with status 'pending'
      const { error } = await supabase.from('bookings').insert([
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
        console.error('Supabase Insert Error:', error.message);
        throw new Error(error.message);
      }

      // 2. Sync with Zustand store
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

      // 3. Construct WhatsApp Message URL dengan Nama Hari
      const waText = `Halo Admin Milla Hair Studio,\n\nSaya ingin melakukan reservasi perawatan rambut dengan rincian berikut:\n\n Nama: ${fullName}\n Layanan: ${selectedService}\n Tanggal: ${formattedDateText}\n Jam: ${bookingTime} WIB\n\nApakah slot tersebut masih tersedia? Mohon konfirmasinya ya. Terima kasih.`;
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
    <div className="min-h-[85vh] bg-zinc-50 text-zinc-900 font-sans flex items-center justify-center p-4 sm:p-8 py-16 sm:py-24 pb-24 md:pb-8 relative">
      
      {/* Single-Column Centered Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl bg-white border border-zinc-200 shadow-sm rounded-2xl p-5 sm:p-10 relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#926C3A]">
            <Sparkles className="h-3.5 w-3.5 text-[#926C3A]" />
            <span>Milla Hair Studio - Online Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
            Formulir Reservasi Treatment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            Isi formulir reservasi di bawah. Pembayaran dilakukan secara langsung di kasir salon saat kedatangan.
          </p>
        </div>

        {/* SUCCESS STATE NOTICE */}
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 p-6 sm:p-8 rounded-2xl text-center space-y-4"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-zinc-900">Reservasi Berhasil Dicatat</h3>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-md mx-auto">
              Data reservasi Anda telah tersimpan dengan status <span className="font-bold text-[#926C3A]">Pending</span>. Anda sedang dialihkan ke WhatsApp Admin untuk konfirmasi jadwal.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(`Halo Admin Milla Hair Studio,\n\nSaya ingin melakukan reservasi perawatan rambut dengan rincian berikut:\n\n Nama: ${fullName}\n Layanan: ${selectedService}\n Tanggal: ${formattedDateText}\n Jam: ${bookingTime} WIB\n\nApakah slot tersebut masih tersedia? Mohon konfirmasinya ya. Terima kasih.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 min-h-[48px] rounded-xl text-xs transition-all shadow-xs"
              >
                <MessageSquare className="h-4 w-4" />
                Buka WhatsApp Admin Sekarang
              </a>
            </div>
          </motion.div>
        ) : (
          /* SINGLE COLUMN CLEAN BOOKING FORM */
          <form onSubmit={handleSubmitBooking} className="space-y-4 sm:space-y-5 text-left">
            
            {/* 1. NAMA LENGKAP */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                <User className="h-3.5 w-3.5 text-[#926C3A]" />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda..."
                className="w-full text-base sm:text-sm p-3.5 min-h-[48px] bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-medium"
                required
              />
            </div>

            {/* 2. NOMOR WHATSAPP */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 08123456789..."
                maxLength={13}
                className="w-full text-base sm:text-sm p-3.5 min-h-[48px] bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-mono"
                required
              />
              <p className="text-[10px] text-zinc-400 font-normal leading-none mt-1 pl-1">
                Masukkan hanya angka saja, maksimal 13 digit.
              </p>
            </div>

            {/* 3. PILIHAN LAYANAN (DROPDOWN) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Scissors className="h-3.5 w-3.5 text-[#926C3A]" />
                Pilihan Layanan Treatment
              </label>
              <div className="relative">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full text-base sm:text-sm p-3.5 pr-9 appearance-none truncate bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-medium"
                  required
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Balayage Korean Color & Gloss">Balayage Korean Color & Gloss</option>
                  <option value="Detoxifying Clay Scalp Ritual">Detoxifying Clay Scalp Ritual</option>
                  <option value="Premium Keratin Blowout Smooth">Premium Keratin Blowout Smooth</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 4. TANGGAL & JAM (GRID 2 KOLOM DENGAN CHEVRON KUSTOM & INDONESIAN DATE PREVIEW) */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5 text-[#926C3A]" />
                  Tanggal
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-12 min-h-[48px] text-base sm:text-sm px-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-medium box-border"
                  required
                />
                {bookingDate && (
                  <div className="text-[10px] text-[#926C3A] font-bold mt-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md inline-block">
                    {formattedDateText}
                  </div>
                )}
              </div>

              {/* Jam (Custom Chevron & Anti-Truncated) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-[#926C3A]" />
                  Jam Kedatangan
                </label>
                <div className="relative">
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full h-12 min-h-[48px] text-base sm:text-sm px-3.5 pr-9 appearance-none truncate bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-medium box-border"
                    required
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t} WIB</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>

            </div>

            {/* INFORMASI PEMBAYARAN KASIR */}
            <div className="p-3.5 bg-zinc-100/80 border border-zinc-200 rounded-xl flex items-center gap-3 text-xs text-zinc-600">
              <ShieldCheck className="h-5 w-5 text-[#926C3A] flex-shrink-0" />
              <span>
                Pembayaran dilakukan di tempat setelah perawatan selesai.
              </span>
            </div>

            {/* SUBMIT BUTTON WITH LOADING SPINNER */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold py-3.5 min-h-[48px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
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
            </motion.button>

          </form>
        )}

      </motion.div>
    </div>
  );
}
