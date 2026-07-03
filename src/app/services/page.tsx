'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scissors, Clock, ChevronRight } from 'lucide-react';
import { SERVICES } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';

export default function ServicesPage() {
  const [category, setCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Semua Layanan' },
    { id: 'haircut', label: 'Potong Rambut' },
    { id: 'coloring', label: 'Pewarnaan' },
    { id: 'treatment', label: 'Perawatan (Treatment)' },
    { id: 'styling', label: 'Penataan & Styling' },
  ];

  const filtered = category === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === category);

  return (
    <div className="w-full bg-stone-50/30 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="p-2.5 rounded-full bg-stone-100 text-primary inline-flex mb-3">
            <Scissors className="h-6 w-6" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950">Daftar Layanan Salon</h1>
          <p className="text-sm text-zinc-500 font-light leading-relaxed mt-2">
            Kami menawarkan rangkaian produk perawatan berkualitas tinggi dan teknik penataan rambut terkini untuk menjaga kemilau alami rambut Anda.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-zinc-200 pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                category === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white hover:bg-stone-50 text-zinc-600 border border-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((s) => (
            <div 
              key={s.id} 
              className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-48 h-48 sm:h-auto relative flex-shrink-0">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-stone-100 text-stone-850 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {s.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      {s.durationMins} Menit
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 leading-snug">{s.name}</h3>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed">{s.description}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between">
                  <span className="text-lg font-bold text-zinc-950">{formatPrice(s.price)}</span>
                  <Link
                    href={`/booking?serviceId=${s.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-white hover:bg-primary-hover px-4 py-2.5 rounded-full shadow-sm transition-all"
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
    </div>
  );
}
