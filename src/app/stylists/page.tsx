'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Sparkles, ChevronRight } from 'lucide-react';
import { STYLISTS, BRANCHES } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function StylistsPage() {
  const [selectedBranch, setSelectedBranch] = useState('all');

  const filtered = selectedBranch === 'all'
    ? STYLISTS
    : STYLISTS.filter(s => s.branchId === selectedBranch);

  return (
    <div className="w-full bg-stone-50/30 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="p-2.5 rounded-full bg-stone-100 text-primary inline-flex mb-3">
            <Sparkles className="h-6 w-6" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950">Stylist Professional Kami</h1>
          <p className="text-sm text-zinc-500 font-light leading-relaxed mt-2">
            Setiap stylist Milla telah terlatih dalam memproses guntingan presisi, pewarnaan modern, dan treatment penyehatan rambut berkualitas tinggi.
          </p>
        </div>

        {/* Branch Filter Toggles */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-zinc-200 pb-6">
          <button
            onClick={() => setSelectedBranch('all')}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all",
              selectedBranch === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white hover:bg-stone-50 text-zinc-600 border border-zinc-200'
            )}
          >
            Semua Cabang
          </button>
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all",
                selectedBranch === b.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white hover:bg-stone-50 text-zinc-600 border border-zinc-200'
              )}
            >
              {b.name.split(' - ')[1]}
            </button>
          ))}
        </div>

        {/* Stylists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((stylist) => {
            const branch = BRANCHES.find(b => b.id === stylist.branchId);
            return (
              <div 
                key={stylist.id} 
                className="bg-white rounded-3xl overflow-hidden border border-zinc-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4 border border-zinc-200 p-1 bg-stone-50">
                    <img src={stylist.avatar} alt={stylist.name} className="w-full h-full object-cover rounded-full" />
                    <span className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" title="Active Scheduler" />
                  </div>
                  
                  <span className="bg-stone-100 text-stone-850 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    {branch?.name.split(' - ')[1]}
                  </span>
                  
                  <h3 className="text-xl font-bold text-zinc-950">{stylist.name}</h3>
                  <p className="text-xs text-zinc-500 font-light mt-1 mb-4 leading-relaxed max-w-[200px]">
                    Spesialisasi: {stylist.specialty.join(', ')}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-stone-50 px-3 py-1 rounded-full text-xs text-amber-500 font-bold mb-4 border border-zinc-150">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span className="text-zinc-800">{stylist.rating}</span>
                    <span className="text-zinc-400 font-light">({stylist.reviewsCount} Ulasan)</span>
                  </div>
                </div>

                {/* Experience & CTA */}
                <div className="border-t border-zinc-200 pt-4 mt-6 flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-light">Pengalaman: {stylist.experienceYears} Tahun</span>
                  <Link
                    href={`/booking?stylistId=${stylist.id}`}
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    Jadwalkan Janji
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
