'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Check, Star, ShoppingCart } from 'lucide-react';
import { useMillaStore } from '@/store/useMillaStore';
import { PRODUCTS } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [successId, setSuccessId] = useState<string | null>(null);

  const { addToCart } = useMillaStore();

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'shampoo', label: 'Shampoo' },
    { id: 'conditioner', label: 'Conditioner' },
    { id: 'vitamin', label: 'Hair Vitamin' },
    { id: 'tonic', label: 'Hair Tonic' },
    { id: 'mask', label: 'Hair Mask' }
  ];

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setSuccessId(product.id);
    setTimeout(() => setSuccessId(null), 2500);
  };

  const filtered = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-stone-50/30 py-16 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="p-2.5 bg-stone-100 text-primary rounded-full inline-flex">
            <ShoppingBag className="h-6 w-6" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950">Katalog Produk Perawatan</h1>
          <p className="text-sm text-zinc-500 font-light leading-relaxed">
            Dapatkan produk kecantikan dan perawatan rambut premium resmi yang kami gunakan di salon untuk melanjutkan perawatan rambut sehat berkilau Anda di rumah.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-zinc-200 shadow-xs">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  category === cat.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-zinc-50 hover:bg-stone-50 text-zinc-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari hair care serum, tonic..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-60 w-full bg-stone-50">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                {prod.stock < 5 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Stok Menipis ({prod.stock})
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">{prod.category}</p>
                  <h3 className="text-sm font-bold text-zinc-900 leading-snug">{prod.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{prod.rating}</span>
                    <span className="text-zinc-400 font-light">({prod.reviewsCount} Ulasan)</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-150 flex items-center justify-between">
                  <span className="text-base font-bold text-zinc-950">{formatPrice(prod.price)}</span>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                      successId === prod.id
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-primary text-white hover:bg-primary-hover shadow-xs'
                    }`}
                  >
                    {successId === prod.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        Masuk!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Beli
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
