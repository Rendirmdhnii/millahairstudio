'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, Eye, Trash2, Search, ArrowLeft, X, 
  Calendar, Clock, AlertTriangle, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { useMillaStore } from '@/store/useMillaStore';
import { formatPrice } from '@/lib/utils';
import { supabase, Booking } from '@/lib/supabase';
import LogoImage from '@/logosalon.png';

export default function CustomersCRMPage() {
  const router = useRouter();

  const { 
    currentUser, 
    login, 
    logout, 
    supabaseBookings, 
    deleteSupabaseBooking, 
    addAuditLog 
  } = useMillaStore();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State: Detail & Delete
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState<string | null>(null);
  const [customerToDeletePhone, setCustomerToDeletePhone] = useState<string | null>(null);

  // Check login session
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/workspace');
    } else if (!useMillaStore.getState().currentUser) {
      login('owner@milla.com');
    }
  }, [router, login]);

  // Fetch Live Customer Data from Supabase
  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const fallback = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        if (fallback.data && fallback.data.length > 0) data = fallback.data;
      }

      if (data) {
        useMillaStore.setState({ supabaseBookings: data });
      }
    } catch (err) {
      console.error('Fetch customer data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // Handle Delete Customer Data
  const handleConfirmDeleteCustomer = async () => {
    if (!customerToDeletePhone) return;
    try {
      const toDelete = supabaseBookings.filter(b => b.customer_phone === customerToDeletePhone);
      for (const b of toDelete) {
        await supabase.from('reservations').delete().eq('id', b.id);
        await supabase.from('bookings').delete().eq('id', b.id);
        deleteSupabaseBooking(b.id);
      }
      addAuditLog(currentUser?.id || 'system', 'Hapus Pelanggan CRM', `Menghapus data pelanggan nomor ${customerToDeletePhone}`);
      setCustomerToDeletePhone(null);
      alert('Data pelanggan berhasil dihapus dari database.');
      await fetchCustomerData();
    } catch (err) {
      console.error('Delete customer error:', err);
      alert('Gagal menghapus data pelanggan dari database.');
    }
  };

  // Group unique customer list by phone number
  const uniquePhones = Array.from(new Set(supabaseBookings.map(b => b.customer_phone)));
  
  const filteredPhones = uniquePhones.filter(phone => {
    const customerBookings = supabaseBookings.filter(b => b.customer_phone === phone);
    const customerName = customerBookings[0]?.customer_name || '';
    return (
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery)
    );
  });

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-16">
      
      {/* BRAND TOP HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/workspace/dashboard')}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dasbor Admin</span>
            </button>
            <div className="h-5 w-[1px] bg-gray-200 hidden sm:block"></div>
            <Image 
              src={LogoImage} 
              alt="Milla Hair Studio" 
              width={140} 
              height={40} 
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCustomerData}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                logout();
                router.push('/workspace');
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* TITLE BANNER */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#926C3A] font-bold text-xs uppercase tracking-wider mb-1">
              <Users className="h-4 w-4" />
              <span>Sistem Manajemen Hubungan Pelanggan (CRM)</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Data Pelanggan & Histori Booking
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Kelola data pelanggan salon terdaftar, riwayat reservasi, dan hak akses data.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama / WA pelanggan..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-medium"
            />
          </div>
        </div>

        {/* CUSTOMER LIST TABLE & MOBILE CARDS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 sm:p-6">
          
          {/* MOBILE CARDS */}
          <div className="flex md:hidden flex-col gap-3 w-full">
            {filteredPhones.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-xs font-medium shadow-xs">
                {loading ? 'Memuat data pelanggan...' : 'Belum ada data pelanggan tercatat.'}
              </div>
            ) : (
              filteredPhones.map((phone) => {
                const customerBookings = supabaseBookings.filter(b => b.customer_phone === phone);
                const lastBooking = customerBookings[0];
                return (
                  <div key={phone} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{lastBooking?.customer_name || 'Pelanggan Salon'}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{phone}</p>
                      </div>
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        VIP Member
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
                      <span className="text-gray-500">Total Reservasi:</span>
                      <span className="bg-gray-100 text-gray-800 border border-gray-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                        {customerBookings.length} Kali
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedCustomerPhone(phone)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-[#926C3A] border border-amber-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => setCustomerToDeletePhone(phone)}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block w-full overflow-x-auto pb-4 scrollbar-hide rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[750px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 font-bold uppercase text-[9px] tracking-wider bg-gray-50">
                  <th className="p-3.5">Nama Pelanggan</th>
                  <th className="p-3.5">No. Handphone WA</th>
                  <th className="p-3.5">Status Keanggotaan</th>
                  <th className="p-3.5 text-center">Total Reservasi</th>
                  <th className="p-3.5 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {filteredPhones.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                      {loading ? 'Memuat data dari database...' : 'Belum ada data pelanggan tercatat.'}
                    </td>
                  </tr>
                ) : (
                  filteredPhones.map((phone) => {
                    const customerBookings = supabaseBookings.filter(b => b.customer_phone === phone);
                    const lastBooking = customerBookings[0];
                    return (
                      <tr key={phone} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5 font-bold text-gray-900">
                          {lastBooking?.customer_name || 'Pelanggan Salon'}
                        </td>
                        <td className="p-3.5 font-mono text-gray-700">{phone}</td>
                        <td className="p-3.5">
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            VIP Member
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-gray-900 font-mono">
                          {customerBookings.length} Kali
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedCustomerPhone(phone)}
                              title="Lihat Detail Riwayat Booking"
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#926C3A] border border-amber-200 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Detail</span>
                            </button>
                            <button
                              onClick={() => setCustomerToDeletePhone(phone)}
                              title="Hapus Data Pelanggan"
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* MODAL POPUP: DETAIL RIWAYAT BOOKING PELANGGAN */}
      {selectedCustomerPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 font-sans text-gray-800">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-gray-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-900">
                  Riwayat Booking Pelanggan
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  No. WA: {selectedCustomerPhone}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCustomerPhone(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {supabaseBookings.filter(b => b.customer_phone === selectedCustomerPhone).length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs font-medium">
                  Belum ada riwayat booking untuk pelanggan ini.
                </div>
              ) : (
                supabaseBookings
                  .filter(b => b.customer_phone === selectedCustomerPhone)
                  .map((b) => (
                    <div key={b.id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-900 text-sm">{b.service_name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          b.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : b.status === 'accepted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : b.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#926C3A]" />
                          <span>{b.booking_date}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5 text-[#926C3A]" />
                          <span>{b.booking_time} WIB</span>
                        </div>
                      </div>
                      {b.status === 'completed' && (
                        <div className="text-right font-bold font-mono text-emerald-700 pt-1 border-t border-gray-200/60">
                          Total: {formatPrice(b.total_payment || 0)}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedCustomerPhone(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POPUP: KONFIRMASI HAPUS PELANGGAN */}
      {customerToDeletePhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 font-sans text-gray-800">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-gray-200 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                Hapus Data Pelanggan?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data pelanggan dengan nomor WA <span className="font-bold text-gray-800 font-mono">{customerToDeletePhone}</span> dari database? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setCustomerToDeletePhone(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteCustomer}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs shadow-xs transition-all"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
