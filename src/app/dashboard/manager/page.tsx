'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Calendar, Clock, RefreshCw, Scissors, 
  ShoppingBag, Check, Plus, AlertCircle 
} from 'lucide-react';
import { useMillaStore } from '../../../store/useMillaStore';
import { formatPrice } from '../../../lib/utils';

export default function ManagerDashboard() {
  const router = useRouter();

  const { 
    currentUser, 
    branches, 
    stylists, 
    inventory, 
    addAuditLog 
  } = useMillaStore();

  // Redirect if not manager/admin/owner
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'manager' && currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Form scheduler
  const [success, setSuccess] = useState(false);
  const [stylistDuty, setStylistDuty] = useState('sty-1');
  const [dutyStartTime, setDutyStartTime] = useState('10:00');
  const [dutyEndTime, setDutyEndTime] = useState('20:00');

  if (!currentUser) return null;

  const myBranchId = currentUser.branchId || 'br-1';
  const myBranch = branches.find(b => b.id === myBranchId);
  const branchStylists = stylists.filter(s => s.branchId === myBranchId);
  
  // Inventory low stock checks
  const lowStockItems = inventory.filter(inv => inv.branchId === myBranchId && inv.stockCount < inv.minStockAlert);

  const handleUpdateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    
    const matchedStylist = stylists.find(s => s.id === stylistDuty);
    addAuditLog(currentUser.id, 'Update Stylist Duty Hours', `Mengubah jam dinas kerja ${matchedStylist?.name} menjadi ${dutyStartTime} - ${dutyEndTime}`);
  };

  return (
    <div className="w-full bg-pink-50/10 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800 flex-1">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <p className="text-xs uppercase tracking-wider text-pink-100 font-semibold">Dashboard Kepala Cabang</p>
          <h2 className="text-2xl font-serif font-bold mt-1 text-white">{myBranch?.name}</h2>
          <p className="text-xs text-pink-50/80 mt-1 font-light">{myBranch?.address}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* STAFF SCHEDULE MANAGER (LEFT 2 COLUMNS) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Scheduler form */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Atur Jam Dinas Kerja Stylist Cabang
              </h3>

              {success && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs text-center font-medium animate-pulse">
                  ✓ Jadwal jam kerja stylist berhasil diperbarui! Sinkronisasi otomatis ke kalender booking online customer.
                </div>
              )}

              <form onSubmit={handleUpdateSchedule} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Pilih Stylist</label>
                    <select
                      value={stylistDuty}
                      onChange={(e) => setStylistDuty(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    >
                      {branchStylists.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Jam Masuk (Start)</label>
                    <input
                      type="time"
                      value={dutyStartTime}
                      onChange={(e) => setDutyStartTime(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Jam Pulang (End)</label>
                    <input
                      type="time"
                      value={dutyEndTime}
                      onChange={(e) => setDutyEndTime(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-full shadow transition-all"
                >
                  Perbarui Jam Dinas Kerja
                </button>
              </form>
            </div>

            {/* Stylists list details */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                Daftar Stylist Cabang Aktif
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {branchStylists.map(s => (
                  <div key={s.id} className="p-4 border border-pink-50 bg-pink-50/5/10 rounded-2xl flex gap-3 items-center">
                    <img src={s.avatar} alt={s.name} className="h-10 w-10 object-cover rounded-full" />
                    <div>
                      <h4 className="font-bold text-zinc-900">{s.name}</h4>
                      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-0.5">{s.specialty.join(', ')}</p>
                      <p className="text-[10px] text-primary font-medium mt-1">⭐ {s.rating} • {s.experienceYears} Thn Pengalaman</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* LOW STOCK INVENTORY WARNER (RIGHT 1 COLUMN) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Alert Stok Tipis (&lt;5)
              </h3>

              <div className="space-y-3 text-xs">
                {lowStockItems.length === 0 ? (
                  <p className="text-zinc-400 italic">Semua stok produk aman di atas batas minimum.</p>
                ) : (
                  lowStockItems.map(inv => (
                    <div key={inv.id} className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-2xl flex justify-between items-center">
                      <span className="font-semibold">{inv.productName}</span>
                      <span className="font-bold">{inv.stockCount} Pcs</span>
                    </div>
                  ))
                )}
                
                <div className="pt-4 border-t border-pink-50 text-[10px] text-zinc-400 leading-relaxed">
                  💡 Ajukan permohonan transfer stok di **Admin Console Panel** untuk mengirimkan sediaan barang dari Cabang Surabaya ke Cabang Senopati.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
