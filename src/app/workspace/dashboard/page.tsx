'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, DollarSign, Clock, CheckCircle2, XCircle, 
  Search, Plus, Check, X, Phone, Scissors, LogOut, LayoutDashboard, 
  FileSpreadsheet, AlertCircle, TrendingUp, Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useMillaStore } from '@/store/useMillaStore';
import { formatPrice } from '@/lib/utils';
import { supabase, Booking, BookingStatus } from '@/lib/supabase';
import LogoImage from '@/logosalon.png';

export default function WorkspaceDashboardPage() {
  const router = useRouter();

  const { 
    currentUser, 
    login,
    logout,
    services, 
    supabaseBookings,
    addSupabaseBooking,
    updateSupabaseBookingStatus,
    deleteSupabaseBooking,
    addAuditLog
  } = useMillaStore();

  // 1. CEGAH LOGOUT OTOMATIS SAAT REFRESH (PERSISTENT SESSION)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/workspace');
    } else {
      if (!useMillaStore.getState().currentUser) {
        login('owner@milla.com');
      }
    }
  }, [router, login]);

  // Helper re-fetch Supabase query (select 20 data terbaru)
  const reFetchBookings = async () => {
    try {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) useMillaStore.setState({ supabaseBookings: data });
    } catch (err) {
      console.warn('Supabase Re-fetch Notice:', err);
    }
  };

  // 2. LIVE SYNC SUPABASE DATA (4-SECOND POLLING INTERVAL & LIMIT 20)
  useEffect(() => {
    async function fetchLiveBookingsFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.warn('Supabase Live Fetch Error:', error.message);
        } else if (data) {
          useMillaStore.setState({ supabaseBookings: data });
        }
      } catch (err) {
        console.error('Supabase Connection Error:', err);
      }
    }

    fetchLiveBookingsFromSupabase();

    const interval = setInterval(fetchLiveBookingsFromSupabase, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const formatWhatsAppNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  if (!currentUser) return null;

  // REVENUE & METRICS STATISTICAL CALCULATIONS
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();
  const currentMonthStr = todayStr.substring(0, 7);

  // Card 1: Today's Revenue (Pendapatan Hari Ini)
  const todayRevenue = supabaseBookings
    .filter(b => b.status === 'completed' && (b.booking_date === todayStr || (b.created_at && b.created_at.startsWith(todayStr))))
    .reduce((sum, b) => sum + (Number(b.total_payment) || 0), 0);

  // Card 2: This Month's Revenue (Pendapatan Bulan Ini)
  const monthRevenue = supabaseBookings
    .filter(b => b.status === 'completed' && (b.booking_date?.startsWith(currentMonthStr) || (b.created_at && b.created_at.startsWith(currentMonthStr))))
    .reduce((sum, b) => sum + (Number(b.total_payment) || 0), 0);

  // Card 3: Active Queue (Total Antrean Aktif)
  const activeBookingsCount = supabaseBookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;

  // Card 4: Total Completed Bookings (Reservasi Selesai)
  const completedBookingsCount = supabaseBookings.filter(b => b.status === 'completed').length;

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

    const fileName = `Milla_Hair_Studio_Bookings.xlsx`;
    XLSX.writeFile(workbook, fileName);

    addAuditLog(currentUser.id, 'Export Excel XLSX', `Mengunduh file Excel ${fileName} (${filteredBookings.length} baris data)`);
  };

  // Action: Accept Booking
  const handleAcceptBooking = async (bookingId: string) => {
    updateSupabaseBookingStatus(bookingId, 'accepted');
    try {
      await supabase.from('bookings').update({ status: 'accepted' }).eq('id', bookingId);
      await reFetchBookings();
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
      await reFetchBookings();
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
      await reFetchBookings();
    } catch (err) {
      console.warn('Supabase Insert Notice:', err);
    }

    setShowAddBookingModal(false);
    setCustName('');
    setCustPhone('');
  };

  // Action: Delete Booking
  const handleDeleteBooking = async (bookingId: string) => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus data pelanggan ini? Data pendapatan akan otomatis menyesuaikan.');
    if (!isConfirmed) return;

    deleteSupabaseBooking(bookingId);
    try {
      await supabase.from('bookings').delete().eq('id', bookingId);
      await reFetchBookings();
    } catch (err) {
      console.warn('Supabase Delete Notice:', err);
    }
  };

  // Logout Handler (Clears local session)
  const handleLogoutClick = () => {
    localStorage.removeItem('isLoggedIn');
    logout();
    router.push('/workspace');
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-sans text-zinc-300 pb-20 md:pb-0">
      
      {/* 1. SIDEBAR LAYOUT (CLEAN ZINC 950 PANEL - HIDDEN ON MOBILE SCREEN) */}
      <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col justify-between hidden md:flex border-r border-zinc-900 shadow-xl flex-shrink-0">
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <Image 
                src={LogoImage} 
                alt="Milla Hair Studio" 
                width={120} 
                height={120} 
                className="h-10 w-auto object-contain filter drop-shadow-md brightness-110"
                priority
              />
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            <div className="w-full flex items-center justify-between p-3 rounded-xl bg-[#926C3A]/10 text-white shadow-xs border border-[#926C3A]/20">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 text-[#926C3A]" />
                <span>Daftar Reservasi</span>
              </div>
              {activeBookingsCount > 0 && (
                <span className="bg-[#926C3A] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom User Actions */}
        <div className="p-6 border-t border-zinc-900">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2.5 p-3 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl transition-all text-xs font-bold"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Panel Kontrol</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Reservasi Masuk
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Panel pencatatan transaksi dan penjadwalan salon.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleExportExcel}
              className="bg-[#926C3A]/10 hover:bg-[#926C3A]/20 text-[#926C3A] border border-[#926C3A]/30 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Unduh Spreadsheet</span>
            </button>
            <button
              onClick={() => setShowAddBookingModal(true)}
              className="bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Pencatatan Baru</span>
            </button>
          </div>
        </div>

        {/* WIDGET RINCIAN PENDAPATAN & METRIK (REVENUE CARDS GRID) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Pendapatan Hari Ini */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Pendapatan Hari Ini
              </span>
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {formatPrice(todayRevenue)}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span>Reservasi selesai hari ini ({todayStr})</span>
              </p>
            </div>
          </div>

          {/* Card 2: Pendapatan Bulan Ini */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#926C3A]/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Pendapatan Bulan Ini
              </span>
              <div className="h-9 w-9 rounded-xl bg-[#926C3A]/15 border border-[#926C3A]/30 text-[#926C3A] flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                {formatPrice(monthRevenue)}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                <span>Total omzet bulan berjalan</span>
              </p>
            </div>
          </div>

          {/* Card 3: Total Antrean Aktif */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Total Antrean Aktif
              </span>
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                {activeBookingsCount}
              </h3>
              <span className="text-xs text-blue-400 font-semibold">Reservasi</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Status Pending & Accepted
            </p>
          </div>

          {/* Card 4: Reservasi Selesai */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Total Reservasi Selesai
              </span>
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                {completedBookingsCount}
              </h3>
              <span className="text-xs text-purple-400 font-semibold">Selesai</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Transaksi kasir berhasil
            </p>
          </div>

        </div>

        {/* TABEL BOOKING MANAGEMENT CARD CONTAINER */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl p-5 sm:p-6 space-y-5">
          
          {/* Table Container Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
                <span>Daftar Reservasi Terbaru</span>
                <span className="text-[10px] bg-[#926C3A]/20 text-amber-400 border border-[#926C3A]/40 font-mono px-2 py-0.5 rounded-full font-sans font-semibold">
                  20 List Data Terbaru
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Kelola status kedatangan dan pembayaran pelanggan salon secara real-time.
              </p>
            </div>
          </div>

          {/* FILTER CONTROLS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 text-xs">
            
            <div>
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">
                Filter Tanggal (Hari)
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  if (e.target.value) setFilterMonth('');
                }}
                className="w-full text-base sm:text-xs p-2.5 min-h-[44px] sm:min-h-[36px] bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#926C3A]"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                Filter Bulan & Tahun
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  if (e.target.value) setFilterDate('');
                }}
                className="w-full text-base sm:text-xs p-2.5 min-h-[44px] sm:min-h-[36px] bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#926C3A]"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                Status Booking
              </label>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="w-full text-base sm:text-xs p-2.5 min-h-[44px] sm:min-h-[36px] bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#926C3A] capitalize"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending (Menunggu)</option>
                <option value="accepted">Accepted (Diterima)</option>
                <option value="completed">Completed (Selesai)</option>
                <option value="cancelled">Cancelled (Dibatalkan)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                Pencarian
              </label>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 sm:h-3.5 sm:w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nama / HP / Layanan..."
                    className="w-full text-base sm:text-xs p-2.5 pl-9 min-h-[44px] sm:min-h-[36px] bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-[#926C3A]"
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
                    className="px-3 min-h-[44px] sm:min-h-[36px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-bold rounded-lg text-[10px] transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Table Element with responsive wrapper */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-hide rounded-xl border border-zinc-800/80 bg-zinc-950/60">
            <table className="w-full min-w-[850px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[9px] tracking-wider bg-zinc-900/80">
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">No. Handphone</th>
                  <th className="p-3.5">Layanan Treatment</th>
                  <th className="p-3.5">Tanggal & Jam</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Pembayaran Kasir</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-zinc-500 font-medium">
                      Belum ada data reservasi saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-3.5 font-bold text-zinc-100 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-zinc-800 text-amber-400 font-bold flex items-center justify-center text-xs border border-zinc-700">
                          {b.customer_name ? b.customer_name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <span>{b.customer_name}</span>
                      </td>

                      <td className="p-3.5 font-mono text-zinc-300">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-zinc-500" />
                          <span>{b.customer_phone}</span>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium">
                        <span className="bg-zinc-800/90 text-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                          {b.service_name}
                        </span>
                      </td>

                      <td className="p-3.5 text-zinc-300">
                        <div className="font-semibold text-white">{b.booking_date}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Pukul {b.booking_time}</div>
                      </td>

                      {/* BADGE STATUS ENHANCEMENT */}
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          b.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : b.status === 'accepted'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : b.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            b.status === 'pending' ? 'bg-amber-400 animate-pulse' :
                            b.status === 'accepted' ? 'bg-blue-400' :
                            b.status === 'completed' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`} />
                          {b.status === 'pending' ? 'Pending' : b.status === 'accepted' ? 'Diterima' : b.status === 'completed' ? 'Selesai' : 'Batal'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right font-bold font-mono text-white">
                        {b.status === 'completed' ? (
                          <span className="text-emerald-400">{formatPrice(b.total_payment || 0)}</span>
                        ) : (
                          <span className="text-zinc-600 font-normal italic text-[11px]">-</span>
                        )}
                      </td>

                      {/* ACTION BUTTONS COLUMN */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* WhatsApp Reminder Icon Button */}
                          <a
                            href={`https://wa.me/${formatWhatsAppNumber(b.customer_phone)}?text=${encodeURIComponent(
                              `Halo Kak ${b.customer_name}, kami dari Milla Hair Studio ingin mengingatkan jadwal perawatan ${b.service_name} Anda hari ini pada pukul ${b.booking_time}. Apakah Anda masih bisa hadir sesuai jadwal? Mohon konfirmasinya ya Kak. Terima kasih.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center"
                            title="Kirim Pengingat WhatsApp"
                          >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 2.568 1.489 4.53 1.49 5.309 0 9.626-4.244 9.629-9.46.002-2.527-.979-4.904-2.761-6.69C16.262 2.709 13.897 1.72 11.4 1.72c-5.312 0-9.63 4.246-9.632 9.462-.001 1.942.502 3.102 1.408 4.675l-1.03 3.766 3.86-1.014z" />
                            </svg>
                          </a>

                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptBooking(b.id)}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition-all"
                            >
                              <Check className="h-3.5 w-3.5" /> Terima
                            </button>
                          )}

                          {b.status === 'accepted' && (
                            <button
                              onClick={() => handleOpenCompleteModal(b)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 transition-all"
                            >
                              <DollarSign className="h-3.5 w-3.5" /> Selesaikan
                            </button>
                          )}

                          {b.status === 'completed' && (
                            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Terbayar
                            </span>
                          )}

                          {b.status !== 'cancelled' && b.status !== 'completed' && (
                            <button
                              onClick={() => updateSupabaseBookingStatus(b.id, 'cancelled')}
                              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                              title="Batalkan Booking"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="px-2.5 py-1 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20 flex items-center gap-1 font-semibold text-xs"
                            title="Hapus Booking"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus</span>
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

      {/* Bottom Navigation Bar for Mobile Screen (HP) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-45 bg-zinc-950 border-t border-zinc-900 px-4 py-2.5 flex justify-around items-center text-[10px] font-bold text-zinc-500 shadow-2xl">
        <div className="flex flex-col items-center gap-1 py-1 px-3 text-white min-h-[44px] justify-center">
          <LayoutDashboard className="h-5 w-5 text-[#926C3A]" />
          <span>Bookings</span>
        </div>
        <button
          onClick={handleLogoutClick}
          className="flex flex-col items-center gap-1 py-1 px-3 text-zinc-500 hover:text-rose-400 min-h-[44px] justify-center"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>

      {/* MODAL POPUP: SELESAIKAN BOOKING */}
      {selectedBookingForComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 font-sans text-zinc-300">
          <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Selesaikan Booking & Pembayaran
              </h3>
              <button 
                onClick={() => setSelectedBookingForComplete(null)} 
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
              <p className="font-bold text-white flex justify-between">
                <span>Pelanggan: {selectedBookingForComplete.customer_name}</span>
                <span className="text-zinc-500 font-mono">{selectedBookingForComplete.customer_phone}</span>
              </p>
              <p className="text-zinc-300">Layanan: <span className="font-semibold text-[#926C3A]">{selectedBookingForComplete.service_name}</span></p>
              <p className="text-[10px] text-zinc-500">Jadwal: {selectedBookingForComplete.booking_date} Pukul {selectedBookingForComplete.booking_time}</p>
            </div>

            <form onSubmit={handleConfirmComplete} className="space-y-4 text-left text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Nominal Pembayaran Kasir (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-bold text-zinc-500 text-sm">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={nominalPayment}
                    onChange={(e) => setNominalPayment(Number(e.target.value))}
                    placeholder="Contoh: 350000"
                    className="w-full text-base font-bold pl-12 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-600 text-white font-mono transition-all"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl flex gap-2 text-[10px] text-emerald-400">
                <AlertCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  Status akan diubah menjadi Completed dan nominal dimasukkan ke dalam laporan transaksi kasir.
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForComplete(null)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
                >
                  Simpan Pembayaran
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL POPUP: CATAT BOOKING BARU */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 font-sans text-zinc-300">
          <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#926C3A]" />
                Catat Booking Manual Baru
              </h3>
              <button onClick={() => setShowAddBookingModal(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Nama Pelanggan</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Contoh: Dian Sastrowardoyo"
                  className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#926C3A]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">No. Handphone Pelanggan</label>
                <input
                  type="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="Contoh: 081122334455"
                  className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#926C3A]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Menu Layanan Treatment</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#926C3A]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - ({formatPrice(s.price)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#926C3A]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Jam Kedatangan</label>
                  <select
                    value={bTime}
                    onChange={(e) => setBTime(e.target.value)}
                    className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#926C3A]"
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
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
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
