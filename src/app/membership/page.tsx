'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, CheckCircle, Gift, Sparkles, Star, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function MembershipPage() {
  const [referralName, setReferralName] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const [referred, setReferred] = useState(false);

  const tiers = [
    {
      name: 'Silver VIP Member',
      minSpend: 'Rp 2.000.000 / Tahun',
      points: '1x Poin multiplier',
      benefits: [
        'Diskon 5% untuk semua menu treatment',
        'Voucher ulang tahun Rp 50.000',
        'Akses antrean reservasi reguler',
      ],
      color: 'bg-zinc-100 border-zinc-200 text-zinc-800'
    },
    {
      name: 'Gold VIP Member',
      minSpend: 'Rp 5.000.000 / Tahun',
      points: '1.5x Poin multiplier',
      benefits: [
        'Diskon 10% untuk semua menu treatment',
        'Voucher ulang tahun Rp 100.000',
        'Prioritas waiting-list booking utama',
        'Free 1x Hair Wash & Blow bulanan',
      ],
      color: 'bg-amber-50/50 border-amber-200 text-amber-800'
    },
    {
      name: 'Platinum VIP Member',
      minSpend: 'Rp 10.000.000 / Tahun',
      points: '2x Poin multiplier',
      benefits: [
        'Diskon 15% untuk semua menu treatment & retail produk',
        'Voucher ulang tahun Rp 250.000',
        'Akses VIP lounge (minuman & cemilan gratis)',
        'Gratis konsultasi kulit kepala dengan dokter spesialis',
        'Pintu antrean prioritas 24/7',
      ],
      color: 'bg-purple-50/30 border-purple-200 text-purple-800'
    }
  ];

  const handleReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (referralName && referralEmail) {
      setReferred(true);
      setReferralName('');
      setReferralEmail('');
      setTimeout(() => setReferred(false), 4000);
    }
  };

  return (
    <div className="w-full bg-pink-50/10 py-16 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="p-2 rounded-full bg-pink-100 text-primary inline-flex mb-3">
            <Award className="h-6 w-6" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950">Program Membership VIP Milla</h1>
          <p className="text-sm text-zinc-500 font-light leading-relaxed mt-2">
            Bergabunglah dalam keanggotaan eksklusif kami dan nikmati diskon khusus, penukaran loyalty point, serta keuntungan luxury treatment bintang lima.
          </p>
        </div>

        {/* Membership Tiers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((t, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl border p-6 shadow-sm flex flex-col justify-between ${t.color}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-serif font-bold">{t.name}</h3>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Minimal Transaksi Tahunan</p>
                  <p className="text-base font-bold text-zinc-900 mt-0.5">{t.minSpend}</p>
                </div>

                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Loyalty Points Earned</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{t.points}</p>
                </div>

                <div className="pt-4 border-t border-dashed border-zinc-200 space-y-2">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Keuntungan Eksklusif:</p>
                  <ul className="text-xs space-y-2 font-light">
                    {t.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex gap-2 items-start">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Points Rewards Info */}
        <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-zinc-900">Cara Kerja Poin Reward & Tukar Hadiah</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              Setiap kali Anda memesan treatment senilai Rp 10.000, Anda akan mendapatkan 1 Loyalty Point (berlaku kelipatan). Poin dikumpulkan dan dapat ditukar dengan potongan harga belanja, treatment gratis, atau ditukarkan menjadi Gift Card eksklusif.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-4">
              <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                <span className="block text-zinc-400 text-[10px] uppercase">100 Poin</span>
                <span className="text-primary font-bold mt-1 block">Potongan Rp 25.000</span>
              </div>
              <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                <span className="block text-zinc-400 text-[10px] uppercase">300 Poin</span>
                <span className="text-primary font-bold mt-1 block">Free Creambath Spa</span>
              </div>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden shadow">
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600" 
              alt="VIP Rewards Treatment" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Referral Program */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-8 shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-left">
              <span className="p-2 bg-white/20 text-white rounded-full inline-flex">
                <Users className="h-5 w-5" />
              </span>
              <h3 className="text-2xl font-serif font-bold">Undang Teman & Dapatkan Hadiah</h3>
              <p className="text-xs text-pink-50 leading-relaxed font-light">
                Dapatkan bonus **50 Loyalty Points** untuk Anda dan teman Anda ketika mereka melakukan pendaftaran akun pertama kali menggunakan link referral khusus Anda.
              </p>
            </div>

            <form onSubmit={handleReferral} className="bg-white/10 p-5 rounded-2xl border border-white/20 space-y-3">
              <div>
                <label className="text-[9px] text-pink-100 uppercase tracking-wider block font-bold">Nama Teman</label>
                <input
                  type="text"
                  value={referralName}
                  onChange={(e) => setReferralName(e.target.value)}
                  placeholder="Contoh: Cantika"
                  className="w-full text-xs mt-1 p-3 bg-zinc-950/20 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] text-pink-100 uppercase tracking-wider block font-bold">Email Teman</label>
                <input
                  type="email"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  placeholder="Contoh: cantika@gmail.com"
                  className="w-full text-xs mt-1 p-3 bg-zinc-950/20 border border-white/30 rounded-xl text-white placeholder-white/40 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-primary font-bold py-2.5 rounded-full hover:bg-pink-50 transition-colors text-xs"
              >
                Kirim Undangan Referral
              </button>
              {referred && (
                <p className="text-[10px] text-white text-center mt-1 animate-pulse font-medium">
                  Undangan terkirim! Email undangan rujukan sedang dikirim.
                </p>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
