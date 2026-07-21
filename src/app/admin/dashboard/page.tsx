'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, 
  Search, Plus, Check, X, Phone, Scissors, LogOut, LayoutDashboard, 
  FileSpreadsheet, AlertCircle, Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useMillaStore } from '@/store/useMillaStore';
import { formatPrice } from '@/lib/utils';
import { supabase, Booking, BookingStatus } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();

  const { 
    currentUser, 
    logout,
    services, 
    supabaseBookings,
    addSupabaseBooking,
    updateSupabaseBookingStatus,
    deleteSupabaseBooking,
    addAuditLog
  } = useMillaStore();

  // Redirect if not admin/owner
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
      router.push('/admin');
    }
  }, [currentUser, router]);

  // LIVE SUPABASE QUERY: SELECT * FROM bookings ON MOUNT
  useEffect(() => {
    async function fetchLiveBookingsFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase Live Fetch Notice:', error.message);
        } else if (data && data.length > 0) {
          data.forEach((b: Booking) => {
            const exists = useMillaStore.getState().supabaseBookings.some(sb => sb.id === b.id);
            if (!exists) {
              addSupabaseBooking(b);
            }
          });
        }
      } catch (err) {
        console.error('Supabase Connection Error:', err);
      }
    }

    fetchLiveBookingsFromSupabase();
  }, []);

  // Sidebar navigation state
  const [activeNav, setActiveNav] = useState<'dashboard' | 'revenue' | 'services'>('dashboard');

  // Booking table filter & search states
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State: Complete Booking & Fill Total Payment
  const [selectedBookingForComplete, setSelectedBookingForComplete] = useState<Booking | null>(null);
  const [nominalPayment, setNominalPayment] = useState<number>(350000);

  // Modal State: Manual Add Booking
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [serviceName, setServiceName] = useState(services[0]?.name || 'Signature Milla Haircut & Blow');
  const [bDate, setBDate] = useState(new Date().toISOString().split('T')[0]);
  const [bTime, setBTime] = useState('14:00');

  if (!currentUser) return null;

  // STATISTICAL CALCULATIONS
  const todayStr = new Date().toISOString().split('T')[0];
  const currentYearMonth = todayStr.substring(0, 7);

  const todayRevenue = supabaseBookings
    .filter(b => b.status === 'completed' && b.booking_date === todayStr)
    .reduce((sum, b) => sum + (b.total_payment || 0), 0);

  const monthRevenue = supabaseBookings
    .filter(b => b.status === 'completed' && b.booking_date.startsWith(currentYearMonth))
    .reduce((sum, b) => sum + (b.total_payment || 0), 0);

  const pendingCount = supabaseBookings.filter(b => b.status === 'pending').length;
  const completedCount = supabaseBookings.filter(b => b.status === 'completed').length;

  // FILTERED BOOKINGS LIST
  const filteredBookings = supabaseBookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesDate = !filterDate || b.booking_date === filterDate;
    const matchesMonth = !filterMonth || b.booking_date.startsWith(filterMonth);

    const matchesSearch = 
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_phone.includes(searchQuery) ||
      b.service_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDate && matchesMonth && matchesSearch;
  });

  // FITUR EXPORT EXCEL (.XLSX)
  const handleExportExcel = () => {
    if (filteredBookings.length === 0) {
      alert('Tidak ada data booking untuk diekspor.');
      return;
    }

    const excelData = filteredBookings.map((b, index) => ({
      'No': index + 1,
      'ID Booking': b.id,
      'Nama Pelanggan': b.customer_name,
      'No. Handphone': b.customer_phone,
      'Layanan Treatment': b.service_name,
      'Tanggal Kunjungan': b.booking_date,
      'Jam Kedatangan': b.booking_time,
      'Status Booking': b.status.toUpperCase(),
      'Total Pembayaran Kasir (Rp)': b.total_payment || 0,
      'Waktu Dibuat': new Date(b.created_at).toLocaleString('id-ID')
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 15 }, { wch: 22 }, { wch: 16 }, { wch: 30 },
      { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 25 }, { wch: 22 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Booking');

    const dateSuffix = filterDate || filterMonth || todayStr;
    const fileName = `Milla_Hair_Studio_Bookings_${dateSuffix}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    addAuditLog(currentUser.id, 'Export Excel XLSX', `Mengunduh file Excel ${fileName} (${filteredBookings.length} baris data)`);
  };

  // Action: Accept Booking
  const handleAcceptBooking = async (bookingId: string) => {
    updateSupabaseBookingStatus(bookingId, 'accepted');
    try {
      await supabase.from('bookings').update({ status: 'accepted' }).eq('id', bookingId);
    } catch (err) {
      console.warn('Supabase Update Notice:', err);
    }
  };

  // Action: Open Complete Modal
  const handleOpenCompleteModal = (booking: Booking) => {
    setSelectedBookingForComplete(booking);
    const matched = services.find(s => s.name.toLowerCase() === booking.service_name.toLowerCase());
    setNominalPayment(matched ? matched.price : 350000);
  };

  // Action: Confirm Complete Booking & Save total_payment
  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForComplete) return;

    const bId = selectedBookingForComplete.id;
    const payment = Number(nominalPayment);

    updateSupabaseBookingStatus(bId, 'completed', payment);

    try {
      await supabase.from('bookings').update({ status: 'completed', total_payment: payment }).eq('id', bId);
    } catch (err) {
      console.warn('Supabase Update Notice:', err);
    }

    setSelectedBookingForComplete(null);
  };

  // Action: Submit Manual Booking Form
  const handleCreateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !serviceName || !bDate || !bTime) {
      alert('Mohon lengkapi formulir booking.');
      return;
    }

    const newBooking = {
      customer_name: custName,
      customer_phone: custPhone,
      service_name: serviceName,
      booking_date: bDate,
      booking_time: bTime,
      status: 'pending' as BookingStatus,
      total_payment: 0
    };

    addSupabaseBooking(newBooking);

    try {
      await supabase.from('bookings').insert([newBooking]);
    } catch (err) {
      console.warn('Supabase Insert Notice:', err);
    }

    setShowAddBookingModal(false);
    setCustName('');
    setCustPhone('');
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      
      {/* 1. SIDEBAR LAYOUT (CLEAN ZINC 900 PANEL) */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col justify-between hidden md:flex border-r border-zinc-800 shadow-xl flex-shrink-0">
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#C5A880] flex items-center justify-center text-white shadow-xs">
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base tracking-wide text-white">Milla Hair Studio</h2>
                <span className="text-[10px] text-[#C5A880] uppercase font-bold tracking-widest block mt-0.5">
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-[#C5A880] text-white shadow-xs font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard & Bookings</span>
              </div>
              {pendingCount > 0 && (
                <span className="bg-amber-400 text-zinc-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('revenue')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeNav === 'revenue'
                  ? 'bg-[#C5A880] text-white shadow-xs font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4" />
                <span>Laporan Pendapatan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('services')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeNav === 'services'
                  ? 'bg-[#C5A880] text-white shadow-xs font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Scissors className="h-4 w-4" />
                <span>Menu Layanan Salon</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom User Info & Logout Button */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#C5A880]/40"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[100px]">{currentUser.name}</p>
                <p className="text-[9px] text-zinc-400 capitalize">{currentUser.role} Staff</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                router.push('/admin');
              }}
              className="p-2 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-zinc-800"
              title="Keluar (Logout)"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 flex items-center gap-2.5">
                <LayoutDashboard className="h-7 w-7 text-[#C5A880]" />
                Admin Booking System
              </h1>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Live Connected</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Database Live: <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 font-mono">zqpuowsromymlzolqxzv.supabase.co</code>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel (.xlsx)
            </button>
            <button
              onClick={() => setShowAddBookingModal(true)}
              className="bg-[#C5A880] hover:bg-[#b59870] text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              + Catat Booking Baru
            </button>
          </div>
        </div>

        {/* 3 SUMMARY WIDGET CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: PENDAPATAN HARI INI */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Kasir Hari Ini ({todayStr})
                </span>
                <h3 className="text-xs font-semibold text-zinc-500 mt-3">Pendapatan Hari Ini</h3>
              </div>
              <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-baseline">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 font-mono">
                {formatPrice(todayRevenue)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <Sparkles className="h-3 w-3" /> Transaksi Selesai
              </span>
            </div>
          </div>

          {/* CARD 2: PENDAPATAN BULAN INI */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] bg-amber-50 border border-[#C5A880]/30 px-3 py-1 rounded-full">
                  Akumulasi Bulan Ini ({currentYearMonth})
                </span>
                <h3 className="text-xs font-semibold text-zinc-500 mt-3">Pendapatan Bulan Ini</h3>
              </div>
              <div className="p-3 bg-[#C5A880] text-white rounded-xl shadow-xs">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-baseline">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 font-mono">
                {formatPrice(monthRevenue)}
              </span>
              <span className="text-[10px] text-[#C5A880] font-bold">
                {completedCount} Reservasi Selesai
              </span>
            </div>
          </div>

          {/* CARD 3: BOOKING MENUNGGU KONFIRMASI */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                  Perlu Tindakan Admin
                </span>
                <h3 className="text-xs font-semibold text-zinc-500 mt-3">Booking Menunggu Konfirmasi</h3>
              </div>
              <div className="p-3 bg-rose-500 text-white rounded-xl shadow-xs">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-baseline">
              <span className="text-3xl font-serif font-bold text-rose-700">
                {pendingCount} <span className="text-xs font-sans text-zinc-500 font-normal">Booking Pending</span>
              </span>
              {pendingCount > 0 ? (
                <span className="text-[10px] text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-full">
                  Klik "Terima" di tabel
                </span>
              ) : (
                <span className="text-[10px] text-emerald-600 font-bold">Terkonfirmasi</span>
              )}
            </div>
          </div>

        </div>

        {/* TABEL BOOKING MANAGEMENT */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-5">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-zinc-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#C5A880]" />
                Daftar Reservasi Booking (Kasir Fisik)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Terhubung langsung ke database Supabase live <code className="bg-zinc-100 text-[#C5A880] px-1 rounded">bookings</code>.
              </p>
            </div>

            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all border border-emerald-500"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-100" />
              <span>Export Excel (.xlsx)</span>
            </button>
          </div>

          {/* FILTER CONTROLS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
            
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1">
                Filter Tanggal (Hari)
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  if (e.target.value) setFilterMonth('');
                }}
                className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                Filter Bulan & Tahun
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  if (e.target.value) setFilterDate('');
                }}
                className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                Status Booking
              </label>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-[#C5A880] capitalize"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending (Menunggu)</option>
                <option value="accepted">Accepted (Diterima)</option>
                <option value="completed">Completed (Selesai)</option>
                <option value="cancelled">Cancelled (Dibatalkan)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                Cari & Reset
              </label>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nama / HP..."
                    className="w-full text-xs p-2.5 pl-8 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                {(filterDate || filterMonth || statusFilter !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilterDate('');
                      setFilterMonth('');
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="px-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold rounded-lg text-[10px]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Table Element */}
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[9px] tracking-wider bg-zinc-100/80">
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">No. Handphone</th>
                  <th className="p-3.5">Layanan Treatment</th>
                  <th className="p-3.5">Tanggal & Jam</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Pembayaran Kasir</th>
                  <th className="p-3.5 text-center">Aksi (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-400 italic">
                      Tidak ada data booking yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-3.5 font-bold text-zinc-900 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-zinc-100 text-[#C5A880] font-bold flex items-center justify-center text-xs border border-zinc-200">
                          {b.customer_name.charAt(0)}
                        </div>
                        <span>{b.customer_name}</span>
                      </td>

                      <td className="p-3.5 font-mono text-zinc-600">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-zinc-400" />
                          {b.customer_phone}
                        </span>
                      </td>

                      <td className="p-3.5 font-medium text-zinc-800">
                        <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg border border-zinc-200">
                          {b.service_name}
                        </span>
                      </td>

                      <td className="p-3.5 text-zinc-700">
                        <div className="font-semibold">{b.booking_date}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Pukul {b.booking_time}</div>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          b.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : b.status === 'accepted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : b.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {b.status === 'pending' && <Clock className="h-3 w-3 text-amber-600" />}
                          {b.status === 'accepted' && <Check className="h-3 w-3 text-blue-600" />}
                          {b.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                          {b.status === 'cancelled' && <XCircle className="h-3 w-3 text-rose-600" />}
                          {b.status === 'pending' ? 'Pending' : b.status === 'accepted' ? 'Diterima' : b.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right font-bold font-mono text-zinc-900">
                        {b.status === 'completed' ? (
                          <span className="text-emerald-600">{formatPrice(b.total_payment || 0)}</span>
                        ) : (
                          <span className="text-zinc-400 font-normal italic text-[11px]">- Belum diisi -</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptBooking(b.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1"
                            >
                              <Check className="h-3.5 w-3.5" /> Terima
                            </button>
                          )}

                          {b.status === 'accepted' && (
                            <button
                              onClick={() => handleOpenCompleteModal(b)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1"
                            >
                              <DollarSign className="h-3.5 w-3.5" /> Selesaikan
                            </button>
                          )}

                          {b.status === 'completed' && (
                            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Terbayar
                            </span>
                          )}

                          {b.status !== 'cancelled' && b.status !== 'completed' && (
                            <button
                              onClick={() => updateSupabaseBookingStatus(b.id, 'cancelled')}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            onClick={() => deleteSupabaseBooking(b.id)}
                            className="p-1.5 text-zinc-300 hover:text-rose-500 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      {/* MODAL POPUP: SELESAIKAN BOOKING */}
      {selectedBookingForComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-zinc-200 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-zinc-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Selesaikan Booking & Pembayaran Kasir
              </h3>
              <button 
                onClick={() => setSelectedBookingForComplete(null)} 
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5 text-xs">
              <p className="font-bold text-zinc-900 flex justify-between">
                <span>Pelanggan: {selectedBookingForComplete.customer_name}</span>
                <span className="text-zinc-500 font-mono">{selectedBookingForComplete.customer_phone}</span>
              </p>
              <p className="text-zinc-700">Layanan: <span className="font-semibold text-[#C5A880]">{selectedBookingForComplete.service_name}</span></p>
              <p className="text-[10px] text-zinc-500">Jadwal: {selectedBookingForComplete.booking_date} Pukul {selectedBookingForComplete.booking_time}</p>
            </div>

            <form onSubmit={handleConfirmComplete} className="space-y-4 text-left text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Nominal Total Payment Kasir (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-bold text-zinc-400 text-sm">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={nominalPayment}
                    onChange={(e) => setNominalPayment(Number(e.target.value))}
                    placeholder="Contoh: 350000"
                    className="w-full text-base font-bold pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:border-emerald-500 text-zinc-900 font-mono transition-all"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2 text-[10px] text-emerald-800">
                <AlertCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  Status akan diubah menjadi Completed dan nominal dimasukkan ke dalam laporan transaksi kasir.
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForComplete(null)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-3 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-xs"
                >
                  Simpan Pembayaran Kasir
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL POPUP: CATAT BOOKING BARU */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-zinc-200 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-zinc-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#C5A880]" />
                Catat Booking Manual Baru
              </h3>
              <button onClick={() => setShowAddBookingModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Nama Pelanggan</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Contoh: Dian Sastrowardoyo"
                  className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#C5A880]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">No. Handphone Pelanggan</label>
                <input
                  type="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="Contoh: 081122334455"
                  className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#C5A880]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Menu Layanan Treatment</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#C5A880]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - ({formatPrice(s.price)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Jam Kedatangan</label>
                  <select
                    value={bTime}
                    onChange={(e) => setBTime(e.target.value)}
                    className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#C5A880]"
                  >
                    {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBookingModal(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-3 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#C5A880] hover:bg-[#b59870] text-white font-bold py-3 rounded-xl text-xs shadow-xs"
                >
                  Simpan Reservasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
