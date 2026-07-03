'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Star, Clock, Copy, Check, Scissors, 
  MapPin, ChevronRight, HelpCircle, ArrowRight, Calendar, Phone
} from 'lucide-react';
import { STYLISTS, SERVICES, VOUCHERS } from '../lib/mockData';
import { formatPrice } from '../lib/utils';

export default function LandingPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // FAQ Data
  const faqs = [
    { q: 'Apakah saya perlu melakukan booking terlebih dahulu?', a: 'Sangat disarankan. Kami memprioritaskan pelanggan yang telah melakukan booking online untuk memastikan ketersediaan stylist dan mengurangi waktu tunggu Anda di salon.' },
    { q: 'Bagaimana kebijakan reschedule atau pembatalan janji temu?', a: 'Anda dapat melakukan reschedule atau pembatalan secara mandiri melalui Customer Dashboard maksimal 12 jam sebelum waktu janji temu tanpa potongan deposit.' },
    { q: 'Apakah Milla Hair Studio melayani potong rambut pria?', a: 'Ya, kami melayani haircut & styling pria dengan hasil potongan modern dan maskulin oleh pakar stylist kami.' },
    { q: 'Bahan perawatan apa yang digunakan di Milla Hair Studio?', a: 'Kami berkomitmen menggunakan produk cat rambut, keratin, dan sampo premium berkualitas tinggi yang aman untuk kulit kepala sensitif dan menjaga kelembapan rambut.' },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="w-full flex flex-col font-sans text-stone-800 bg-white">
      
      {/* 1. HERO BANNER */}
      <section className="relative w-full min-h-[85vh] flex items-center bg-stone-100 overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        {/* Background Image & Soft Filter Overlay */}
        <div className="absolute inset-0 opacity-80">
          <img 
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1600" 
            alt="Milla Hair Studio Salon Interior" 
            className="w-full h-full object-cover scale-100"
          />
        </div>
        {/* Elegant Minimalist Solid-Beige Overlay */}
        <div className="absolute inset-0 bg-stone-900/40" />
        
        <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/90 border border-stone-200 rounded-full px-4 py-1.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-stone-700 uppercase">Minimalist & Elegant Hair Studio</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
              Kecantikan Rambut Anda<br />
              <span className="text-primary-light">Adalah Seni & Dedikasi.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-stone-100 font-normal leading-relaxed max-w-2xl bg-black/20 p-4 rounded-2xl backdrop-blur-xs">
              Milla Hair Studio menghadirkan layanan penataan rambut premium yang minimalis, bersih, dan modern di Sidoarjo. Fokus kami adalah memberikan kemudahan booking janji temu serta pelayanan berkualitas tinggi yang nyaman untuk semua usia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-base px-8 py-4 rounded-full shadow transition-all duration-300"
              >
                <Calendar className="h-5 w-5" />
                Booking Sekarang
              </Link>
              
              <a 
                href="https://wa.me/6285645121008" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-base px-8 py-4 rounded-full shadow-sm transition-all duration-300"
              >
                <Phone className="h-5 w-5 text-emerald-600" />
                WhatsApp Kami
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4 max-w-lg">
              <div className="bg-white/90 p-3 rounded-2xl border border-stone-150 text-center">
                <p className="text-xl sm:text-2xl font-bold text-zinc-900">4.9 ⭐</p>
                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Google Rating</p>
              </div>
              <div className="bg-white/90 p-3 rounded-2xl border border-stone-150 text-center">
                <p className="text-xl sm:text-2xl font-bold text-zinc-900">100%</p>
                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Pelayanan Ramah</p>
              </div>
              <div className="bg-white/90 p-3 rounded-2xl border border-stone-150 text-center">
                <p className="text-xl sm:text-2xl font-bold text-zinc-900">Sidoarjo</p>
                <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Lokasi Utama</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TENTANG KAMI */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-md bg-stone-100 border border-stone-200">
              <img 
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800" 
                alt="Styling area at Milla Hair Studio" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Minimal accent badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#F5F1EA] text-zinc-800 p-6 rounded-2xl shadow-md border border-stone-200 max-w-[200px] hidden sm:block">
              <p className="text-xs font-bold text-primary tracking-widest uppercase">Kenyamanan</p>
              <p className="text-xs text-stone-600 mt-1">Interior hangat, higienis, dan ramah keluarga.</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-bold text-primary tracking-widest uppercase">Tentang Kami</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">Milla Hair Studio Sidoarjo</h2>
            </div>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Kami percaya bahwa rambut sehat dan potongan yang pas dapat memancarkan rasa percaya diri terbaik Anda. Terletak di jantung kota Sidoarjo, Milla Hair Studio didesain dengan konsep ruang yang bersih, modern, dan minimalis agar setiap pengunjung merasakan atmosfer yang tenang dan rileks.
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Seluruh perawatan dikerjakan oleh stylist terlatih dengan mengedepankan keamanan, kesopanan, serta produk berkualitas tinggi. Sistem pemesanan janji temu kami telah terintegrasi penuh secara online 24 jam untuk memastikan Anda tidak perlu mengantre lama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm px-6 py-3 rounded-full shadow"
              >
                Pesan Jadwal Kunjungan
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN SALON */}
      <section className="py-20 bg-[#F5F1EA]/30 border-t border-b border-[#F5F1EA] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary tracking-widest uppercase">Perawatan Terbaik</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Layanan Salon Kami</h2>
            <p className="text-stone-500 font-light mt-2 max-w-xl mx-auto text-sm">
              Pilih dari menu layanan spesialis kami. Harga transparan dan estimasi waktu pengerjaan tercantum jelas.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-48 w-full">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-white/90 text-stone-800 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    ⏱️ {service.durationMins} Menit
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-stone-900">{service.name}</h3>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">{service.description}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-base font-bold text-zinc-950">{formatPrice(service.price)}</span>
                    <Link
                      href={`/booking?serviceId=${service.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      Booking
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STYLIST KAMI */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-primary tracking-widest uppercase">Tim Profesional</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Stylist Milla Hair Studio</h2>
          <p className="text-stone-500 font-light mt-2 max-w-xl mx-auto text-sm">
            Temui stylist ahli kami yang siap membantu merekomendasikan gaya rambut terbaik yang cocok untuk Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STYLISTS.map((stylist) => (
            <div 
              key={stylist.id} 
              className="bg-[#F7F7F7] rounded-2xl overflow-hidden p-4 border border-stone-200 flex flex-col justify-between text-center group hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-stone-100">
                <img 
                  src={stylist.avatar} 
                  alt={stylist.name} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900">{stylist.name}</h4>
                <p className="text-[10px] text-stone-500 leading-relaxed min-h-[30px]">
                  {stylist.specialty.slice(0, 2).join(' • ')}
                </p>
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-500 pt-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-stone-800">{stylist.rating}</span>
                  <span className="text-stone-400">({stylist.reviewsCount})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex justify-between items-center text-[10px] text-stone-500">
                <span>Pengalaman: {stylist.experienceYears} Thn</span>
                <Link
                  href={`/booking?stylistId=${stylist.id}`}
                  className="text-primary font-bold hover:underline"
                >
                  Pilih
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GALLERY HASIL TREATMENT */}
      <section className="py-20 bg-[#F7F7F7] border-t border-b border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-primary tracking-widest uppercase">Portofolio Kerja</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Gallery Hasil Treatment</h2>
            <p className="text-stone-500 font-light mt-2 max-w-xl mx-auto text-sm">
              Inspirasi potongan, spa ritual, warna, dan styling yang diproses langsung oleh tim Milla Hair Studio.
            </p>
          </div>

          {/* Clean minimal grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-200 relative group">
              <img src="https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=400" alt="Smoothing results" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-white text-xs font-bold">Smoothing Treatment</span>
              </div>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-200 relative group">
              <img src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=400" alt="Hair Coloring Balayage" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-white text-xs font-bold">Hair Coloring & Wave</span>
              </div>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-200 relative group">
              <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400" alt="Signature Haircut" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-white text-xs font-bold">Signature Haircut</span>
              </div>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-stone-200 relative group">
              <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400" alt="Hair Spa Therapy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <span className="text-white text-xs font-bold">Scalp Massage & Hair Spa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONI PELANGGAN */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-primary tracking-widest uppercase">Ulasan Jujur</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Testimoni Pelanggan</h2>
          <p className="text-stone-500 font-light mt-2 max-w-xl mx-auto text-sm">
            Apa kata mereka tentang pengalaman berkunjung dan melakukan perawatan rambut di Milla Hair Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-150 space-y-4">
            <div className="flex gap-1 text-amber-500">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              "Tempatnya bersih banget, pelayanannya sopan sekali dari awal masuk. Saya mencoba Hair Cut & Wash, dikasih pijatan kepala juga. Hasil potongannya rapi, modern, dan sesuai request saya."
            </p>
            <div className="border-t border-stone-200/60 pt-3">
              <p className="text-xs font-bold text-stone-900">Arini Shafa</p>
              <p className="text-[10px] text-stone-400">Pelanggan Setia • Sidoarjo</p>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-150 space-y-4">
            <div className="flex gap-1 text-amber-500">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              "Booking online gampang banget lewat HP, terus dapet notifikasi WhatsApp konfirmasi. Pas dateng langsung dilayani gak pake antre. Smoothing-nya rapi, lembut banget hasilnya."
            </p>
            <div className="border-t border-stone-200/60 pt-3">
              <p className="text-xs font-bold text-stone-900">Citra Lestari</p>
              <p className="text-[10px] text-stone-400">Anggota Member Gold • Buduran</p>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-150 space-y-4">
            <div className="flex gap-1 text-amber-500">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-500" />)}
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              "Keratin Treatment-nya recommended. Rambut saya yang rusak gara-gara bleaching jadi halus berkilau lagi. Elena stylistnya telaten banget ngejelasin cara merawat rambut pasca treatment."
            </p>
            <div className="border-t border-stone-200/60 pt-3">
              <p className="text-xs font-bold text-stone-900">Dewi Sartika</p>
              <p className="text-[10px] text-stone-400">Pelanggan Baru • Gedangan</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-20 bg-stone-50 border-t border-b border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs font-bold text-primary tracking-widest uppercase">Paling Sering Ditanyakan</p>
            <h2 className="text-3xl font-bold text-stone-900 mt-1">FAQ Milla Hair Studio</h2>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-5 flex justify-between items-center text-sm font-bold text-stone-850 hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    {faq.q}
                  </span>
                  <span className="text-primary font-bold text-base">{activeFaq === index ? '−' : '+'}</span>
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-2 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LOKASI GOOGLE MAPS */}
      <section className="py-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-primary tracking-widest uppercase">Lokasi Kami</p>
          <h2 className="text-3xl font-bold text-stone-900 mt-1">Petunjuk Google Maps</h2>
        </div>

        <div className="w-full h-96 rounded-3xl overflow-hidden shadow-md border border-stone-200 bg-stone-50 relative flex justify-center items-center">
          {/* Simple Interactive map representation pointing to the specific address in Sidoarjo */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4022830869766!2d112.7235084!3d-7.420658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e1329a43a0f7%3A0xe54d6824982f6e52!2sJank%20Jank%20Chicken%20Sidoarjo!5e0!3m2!1sid!2sid!4v1687500000000!5m2!1sid!2sid" 
            className="w-full h-full border-none"
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* 9. KONTAK & JAM OPERASIONAL */}
      <section className="py-20 bg-stone-900 text-white px-4 sm:px-6 lg:px-8 border-t border-stone-850">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <p className="text-xs font-bold text-primary tracking-widest uppercase">Hubungi Kami Langsung</p>
            <h3 className="text-3xl sm:text-4xl font-bold">Informasi Kontak & Jam Kerja</h3>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              Punya pertanyaan seputar perawatan rambut atau ingin melakukan konsultasi sebelum memesan? Silakan hubungi admin kami melalui nomor WhatsApp di bawah, atau kunjungi salon kami selama jam operasional.
            </p>
            
            <div className="space-y-4 pt-2 text-sm text-stone-300">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <p>Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Pagerwojo, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur 61219</p>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <p>0856-4512-1008 (Hotline WhatsApp / Telepon)</p>
              </div>
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p><strong>Buka Setiap Hari:</strong></p>
                  <p>Senin - Minggu | 09.30 - 20.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-800 p-8 rounded-3xl border border-stone-700 flex flex-col justify-center space-y-6">
            <h4 className="text-lg font-bold text-white">Butuh Layanan Cepat?</h4>
            <p className="text-xs text-stone-300">
              Gunakan booking online kami yang real-time untuk memesan jadwal kunjungan Anda. Sistem kami mendeteksi tabrakan jadwal otomatis (anti double booking) demi efisiensi janji temu Anda.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/booking"
                className="w-full text-center bg-primary hover:bg-primary-hover text-white py-3 rounded-full text-sm font-semibold shadow transition-colors"
              >
                Booking Janji Temu Sekarang
              </Link>
              <a
                href="https://wa.me/6285645121008"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-full text-sm font-semibold transition-colors"
              >
                Tanya Lewat WhatsApp Admin
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
