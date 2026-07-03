'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Check } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <div className="w-full bg-stone-50/30 py-16 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="p-2.5 bg-stone-100 text-primary rounded-full inline-flex">
            <MessageCircle className="h-6 w-6" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950">Hubungi Kami</h1>
          <p className="text-sm text-zinc-500 font-light leading-relaxed">
            Punya pertanyaan mengenai perawatan rambut, kemitraan, masukan layanan, atau butuh bantuan janji temu khusus? Kami siap melayani Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details & Info */}
          <div className="space-y-8 bg-white p-8 rounded-3xl border border-zinc-200 shadow-xs">
            <h3 className="text-xl font-bold text-zinc-900 border-b border-zinc-150 pb-3">Informasi Kontak</h3>
            
            <div className="space-y-6 text-sm font-normal">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-900">Alamat Salon</p>
                  <p className="text-zinc-500 mt-1">Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Pagerwojo, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur 61219</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-900">Jam Operasional</p>
                  <p className="text-zinc-500 mt-1">Setiap Hari: 09.30 - 20.00 WIB (Termasuk Hari Libur)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-900">Hotline WhatsApp / Telepon</p>
                  <p className="text-zinc-500 mt-1">0856-4512-1008 (HQ Sidoarjo)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-zinc-900">Email Hubungan Pelanggan</p>
                  <p className="text-zinc-500 mt-1">support@millahairstudio.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form message */}
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 border-b border-zinc-150 pb-3">Kirim Pesan Masukan</h3>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Nama Lengkap Anda</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Aurelia"
                  className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Alamat Email Anda</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: aurelia@gmail.com"
                  className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Pesan Masukan / Pertanyaan</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tulis tanggapan atau masukan Anda di sini..."
                  className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-full shadow transition-all flex justify-center items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                Kirim Pesan Sekarang
              </button>
              {sent && (
                <div className="p-3.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xs text-center font-medium flex items-center justify-center gap-1.5 animate-pulse">
                  <Check className="h-4 w-4" />
                  Pesan berhasil dikirim! Tim Admin Milla akan segera menghubungi Anda.
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
