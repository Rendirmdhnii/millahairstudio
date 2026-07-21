'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

  // Helper local date string (YYYY-MM-DD)
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();
  const currentMonthStr = todayStr.substring(0, 7);

  // Real-Time Live Timestamp State
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const updateLiveTimestamp = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
    setLastUpdated(formatted);
  };

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

  // Helper re-fetch Supabase query
  const reFetchBookings = async () => {
    try {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      if (data) useMillaStore.setState({ supabaseBookings: data });
      updateLiveTimestamp();
    } catch (err) {
      console.warn('Supabase Re-fetch Notice:', err);
    }
  };

  // 2. LIVE SYNC SUPABASE DATA (4-SECOND POLLING INTERVAL & TIMESTAMP UPDATE)
  useEffect(() => {
    async function fetchLiveBookingsFromSupabase() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) {
          console.warn('Supabase Live Fetch Error:', error.message);
        } else if (data) {
          useMillaStore.setState({ supabaseBookings: data });
        }
        updateLiveTimestamp();
      } catch (err) {
        console.error('Supabase Connection Error:', err);
      }
    }

    fetchLiveBookingsFromSupabase();

    const interval = setInterval(fetchLiveBookingsFromSupabase, 4000);
    return () => clearInterval(interval);
  }, []);

  // Active Navigation Tab State
  const [activeTab, setActiveTab] = useState<'reservations' | 'customers' | 'services' | 'settings'>('reservations');

  // Booking table filter & search states (Default Filter: Today's Date)
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [filterDate, setFilterDate] = useState<string>(todayStr);
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State ("Muat Lebih Banyak" / Load More)
  const [displayLimit, setDisplayLimit] = useState<number>(10);

  // Modal State: Complete Booking & Fill Total Payment
  const [selectedBookingForComplete, setSelectedBookingForComplete] = useState<Booking | null>(null);
  const [nominalPayment, setNominalPayment] = useState<number>(350000);

  // Modal State: Manual Add Booking
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [serviceName, setServiceName] = useState(services[0]?.name || 'Signature Milla Haircut & Blow');
  const [bDate, setBDate] = useState(todayStr);
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

  // FILTERED BOOKINGS LIST (Defaults to Today's Date unless cleared)
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

  // Paginated visible items
  const visibleBookings = filteredBookings.slice(0, displayLimit);

  // HANDLERS FOR STATUS UPDATES WITH SUPABASE
  const handleAcceptBooking = async (id: string) => {
    try {
      updateSupabaseBookingStatus(id, 'accepted');
      addAuditLog(currentUser?.id || 'system', 'Terima Booking', `Menerima booking ID: ${id}`);
      await supabase.from('bookings').update({ status: 'accepted' }).eq('id', id);
      await reFetchBookings();
    } catch (err) {
      console.warn('Supabase Accept Notice:', err);
    }
  };

  const handleOpenCompleteModal = (booking: Booking) => {
    setSelectedBookingForComplete(booking);
    const matchedService = services.find(s => s.name === booking.service_name);
    setNominalPayment(matchedService ? matchedService.price : 350000);
  };

  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForComplete) return;

    const id = selectedBookingForComplete.id;
    const payment = Number(nominalPayment) || 0;

    try {
      updateSupabaseBookingStatus(id, 'completed', payment);
      addAuditLog(currentUser?.id || 'system', 'Selesaikan Booking', `Menyelesaikan booking ID: ${id} dengan total bayar Rp ${payment.toLocaleString()}`);

      await supabase.from('bookings').update({ 
        status: 'completed',
        total_payment: payment 
      }).eq('id', id);

      setSelectedBookingForComplete(null);
      await reFetchBookings();
    } catch (err) {
      console.warn('Supabase Complete Notice:', err);
    }
  };

  const handleCreateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !serviceName || !bDate || !bTime) {
      alert('Mohon isi semua data reservasi.');
      return;
    }

    try {
      const { data, error } = await supabase.from('bookings').insert([
        {
          customer_name: custName,
          customer_phone: custPhone,
          service_name: serviceName,
          booking_date: bDate,
          booking_time: bTime,
          status: 'pending',
          total_payment: 0
        }
      ]).select();

      if (error) {
        console.error('Manual Booking Insert Error:', error.message);
      }

      addSupabaseBooking({
        customer_name: custName,
        customer_phone: custPhone,
        service_name: serviceName,
        booking_date: bDate,
        booking_time: bTime,
        status: 'pending',
        total_payment: 0
      });

      setShowAddBookingModal(false);
      setCustName('');
      setCustPhone('');
      await reFetchBookings();
    } catch (err) {
      console.error('Manual booking creation failed:', err);
    }
  };

  const handleExportExcel = () => {
    if (filteredBookings.length === 0) {
      alert('Tidak ada data reservasi untuk diunduh.');
      return;
    }

    const exportData = filteredBookings.map((b, index) => ({
      No: index + 1,
      Nama_Pelanggan: b.customer_name,
      No_Handphone: b.customer_phone,
      Layanan: b.service_name,
      Tanggal: b.booking_date,
      Jam: b.booking_time,
      Status: b.status,
      Pembayaran_Kasir: b.total_payment || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservasi');
    XLSX.writeFile(workbook, `Laporan_Reservasi_Milla_Hair_Studio_${todayStr}.xlsx`);
  };

  const handleDeleteBooking = async (id: string) => {
    const isConfirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus data pelanggan ini? Data pendapatan akan otomatis menyesuaikan.'
    );

    if (!isConfirmed) return;

    try {
      deleteSupabaseBooking(id);
      addAuditLog(currentUser?.id || 'system', 'Hapus Booking', `Menghapus data booking ID: ${id}`);
      await supabase.from('bookings').delete().eq('id', id);
      await reFetchBookings();
    } catch (err) {
      console.warn('Supabase Delete Notice:', err);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('isLoggedIn');
    logout();
    router.push('/workspace');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-gray-800">
      
      {/* 1. SIDEBAR LAYOUT (CLEAN LIGHT MODE PANEL - DESKTOP ONLY) */}
      <aside className="w-64 h-full bg-white text-gray-700 flex flex-col justify-between hidden md:flex border-r border-gray-200 shadow-xs flex-shrink-0">
        <div>
          {/* Studio Brand Header (Large Logo) */}
          <div className="p-6 border-b border-gray-200">
            <div className="w-36 md:w-44 mb-1">
              <Image 
                src={LogoImage} 
                alt="Milla Hair Studio" 
                width={180} 
                height={180} 
                className="w-full h-auto object-contain filter drop-shadow-xs"
                priority
              />
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                activeTab === 'reservations'
                  ? 'bg-amber-50 text-[#926C3A] border border-amber-200/80 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <span>Daftar Reservasi</span>
              {activeBookingsCount > 0 && (
                <span className="bg-[#926C3A] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                activeTab === 'customers'
                  ? 'bg-amber-50 text-[#926C3A] border border-amber-200/80 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <span>Data Pelanggan</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                activeTab === 'services'
                  ? 'bg-amber-50 text-[#926C3A] border border-amber-200/80 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <span>Kelola Layanan</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-50 text-[#926C3A] border border-amber-200/80 font-bold shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <span>Pengaturan System</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar User Actions & Status Widget */}
        <div className="p-4 border-t border-gray-200 mt-auto flex flex-col justify-end space-y-3">
          {/* Widget Profil & Status System (Pure Typography, Light Mode) */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
            <span className="text-xs text-gray-500 block font-medium">Admin Terautentikasi</span>
            <span className="font-bold text-gray-900 text-sm block">Super Admin / Owner</span>
            <span className="text-xs text-gray-500 truncate block font-mono">
              {currentUser?.email || 'admin01@millahairstudio.com'}
            </span>
            
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Status Sistem:</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                Online
              </span>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full text-center p-3 text-rose-600 hover:bg-rose-50 border border-gray-200 rounded-xl transition-all text-xs font-bold"
          >
            Keluar Panel Kontrol
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (LIGHT MODE BG-SLATE-50 WITH INTERNAL OVERFLOW SCROLL) */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-5 bg-slate-50 text-gray-800">
        
        {/* TAB 1: DAFTAR RESERVASI */}
        {activeTab === 'reservations' && (
          <>
            {/* Top Header Bar with Live Timestamp Indicator */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                  Reservasi Masuk
                </h1>
                {/* 3. INDIKATOR WAKTU REAL-TIME */}
                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Data diperbarui:</span>
                  <span className="font-bold text-gray-700">{lastUpdated || 'Baru saja'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleExportExcel}
                  className="flex-1 sm:flex-none bg-amber-50 hover:bg-amber-100 text-[#926C3A] border border-amber-200/80 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  Unduh Spreadsheet
                </button>
                <button
                  onClick={() => setShowAddBookingModal(true)}
                  className="flex-1 sm:flex-none bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  Pencatatan Baru
                </button>
              </div>
            </div>

            {/* WIDGET RINCIAN PENDAPATAN & METRIK (KOMPAK 2X2 GRID HP, LIGHT MODE, ZERO ICONS) */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              
              {/* Card 1: Pendapatan Hari Ini */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Pendapatan Hari Ini
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-mono text-[#926C3A] tracking-tight">
                  {formatPrice(todayRevenue)}
                </h3>
                <span className="text-[10px] text-gray-400 block">
                  Reservasi selesai hari ini
                </span>
              </div>

              {/* Card 2: Pendapatan Bulan Ini */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Pendapatan Bulan Ini
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-mono text-[#926C3A] tracking-tight">
                  {formatPrice(monthRevenue)}
                </h3>
                <span className="text-[10px] text-gray-400 block">
                  Omzet bulan berjalan
                </span>
              </div>

              {/* Card 3: Total Antrean Aktif */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Total Antrean Aktif
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-mono text-gray-900 tracking-tight">
                  {activeBookingsCount} <span className="text-xs text-blue-600 font-medium">Reservasi</span>
                </h3>
                <span className="text-[10px] text-gray-400 block">
                  Status Pending & Diterima
                </span>
              </div>

              {/* Card 4: Reservasi Selesai */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Reservasi Selesai
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-mono text-gray-900 tracking-tight">
                  {completedBookingsCount} <span className="text-xs text-emerald-600 font-medium">Selesai</span>
                </h3>
                <span className="text-[10px] text-gray-400 block">
                  Transaksi kasir berhasil
                </span>
              </div>

            </div>

            {/* TABEL BOOKING MANAGEMENT CARD CONTAINER */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 sm:p-6 space-y-4">
              
              {/* Table Container Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  {/* 2. UBAH LOGIKA DATA MENJADI "RESERVASI HARI INI" */}
                  <h2 className="text-base sm:text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                    <span>Reservasi Hari Ini</span>
                    {filterDate === todayStr && (
                      <span className="bg-amber-50 text-[#926C3A] border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Hari Ini
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kelola status kedatangan dan pembayaran pelanggan salon secara real-time.
                  </p>
                </div>
              </div>

              {/* COLLAPSIBLE FILTER BUTTON & ACCORDION */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl shadow-xs hover:bg-gray-50 transition-all text-xs text-center flex items-center justify-between"
                >
                  <span>Filter & Cari Data</span>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">
                    {showFilters ? 'Sembunyikan' : 'Buka Filter'}
                  </span>
                </button>

                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs shadow-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1">
                        Filter Tanggal
                      </label>
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => {
                          setFilterDate(e.target.value);
                          if (e.target.value) setFilterMonth('');
                        }}
                        className="w-full text-base sm:text-xs p-2.5 min-h-[44px] sm:min-h-[36px] bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#926C3A]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">
                        Filter Bulan & Tahun
                      </label>
                      <input
                        type="month"
                        value={filterMonth}
                        onChange={(e) => {
                          setFilterMonth(e.target.value);
                          if (e.target.value) setFilterDate('');
                        }}
                        className="w-full text-base sm:text-xs p-2.5 min-h-[44px] sm:min-h-[36px] bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#926C3A]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">
                        Status Booking
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value)}
                        className="w-full text-base sm:text-xs p-2.5 min-h-[44px] sm:min-h-[36px] bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#926C3A] capitalize"
                      >
                        <option value="all">Semua Status</option>
                        <option value="pending">Pending (Menunggu)</option>
                        <option value="accepted">Accepted (Diterima)</option>
                        <option value="completed">Completed (Selesai)</option>
                        <option value="cancelled">Cancelled (Dibatalkan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">
                        Pencarian Nama / HP / Layanan
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Nama / HP / Layanan..."
                          className="w-full text-base sm:text-xs p-2.5 min-h-[44px] sm:min-h-[36px] bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#926C3A]"
                        />
                        {(filterDate || filterMonth || statusFilter !== 'all' || searchQuery) && (
                          <button
                            onClick={() => {
                              setFilterDate('');
                              setFilterMonth('');
                              setStatusFilter('all');
                              setSearchQuery('');
                            }}
                            className="px-3 min-h-[44px] sm:min-h-[36px] bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg text-[10px] transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 1. MOBILE CARD LIST VIEW FOR RESERVATIONS (ZERO HORIZONTAL SCROLL ON HP) */}
              <div className="flex md:hidden flex-col gap-3.5 w-full overflow-hidden">
                {visibleBookings.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-xs font-medium shadow-xs">
                    Belum ada data reservasi untuk kriteria ini.
                  </div>
                ) : (
                  visibleBookings.map((b) => (
                    <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3 w-full">
                      
                      {/* Card Header: Customer Name & Pure Text Badge */}
                      <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-2.5">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{b.customer_name}</h3>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{b.customer_phone}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                          b.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : b.status === 'accepted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : b.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {b.status === 'pending' ? 'Pending' : b.status === 'accepted' ? 'Diterima' : b.status === 'completed' ? 'Selesai' : 'Batal'}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="space-y-1 text-xs text-gray-600">
                        <p><span className="font-medium text-gray-500">Layanan:</span> <span className="font-bold text-gray-900">{b.service_name}</span></p>
                        <p><span className="font-medium text-gray-500">Jadwal:</span> <span className="font-semibold text-gray-800">{b.booking_date} Pukul {b.booking_time} WIB</span></p>
                        {b.status === 'completed' && (
                          <p><span className="font-medium text-gray-500">Total Pembayaran:</span> <span className="font-bold text-emerald-700 font-mono">{formatPrice(b.total_payment || 0)}</span></p>
                        )}
                      </div>

                      {/* Card Footer: Action Buttons (Full Width Pure Text) */}
                      <div className="pt-2 space-y-2">
                        <a
                          href={`https://wa.me/${formatWhatsAppNumber(b.customer_phone)}?text=${encodeURIComponent(
                            `Halo Kak ${b.customer_name}, kami dari Milla Hair Studio ingin mengingatkan jadwal perawatan ${b.service_name} Anda hari ini pada pukul ${b.booking_time}. Apakah Anda masih bisa hadir sesuai jadwal? Mohon konfirmasinya ya Kak. Terima kasih.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block border border-[#926C3A] text-[#926C3A] hover:bg-amber-50 font-bold py-2.5 rounded-xl text-xs text-center transition-all"
                        >
                          Hubungi WhatsApp
                        </a>

                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptBooking(b.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs text-center transition-all"
                          >
                            Terima Reservasi
                          </button>
                        )}

                        {b.status === 'accepted' && (
                          <button
                            onClick={() => handleOpenCompleteModal(b)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs text-center transition-all"
                          >
                            Selesaikan & Catat Pembayaran
                          </button>
                        )}

                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button
                            onClick={() => updateSupabaseBookingStatus(b.id, 'cancelled')}
                            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2.5 rounded-xl text-xs text-center transition-all"
                          >
                            Batalkan Booking
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="w-full bg-gray-50 hover:bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-xs text-center border border-gray-200 transition-all"
                        >
                          Hapus Data Pelanggan
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* DESKTOP TABLE VIEW (HIDDEN ON MOBILE SCREEN) */}
              <div className="hidden md:block w-full overflow-x-auto pb-4 scrollbar-hide rounded-xl border border-gray-200 bg-white">
                <table className="w-full min-w-[850px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600 font-bold uppercase text-[9px] tracking-wider bg-gray-50">
                      <th className="p-3.5">Pelanggan</th>
                      <th className="p-3.5">No. Handphone</th>
                      <th className="p-3.5">Layanan Treatment</th>
                      <th className="p-3.5">Tanggal & Jam</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Pembayaran Kasir</th>
                      <th className="p-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {visibleBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
                          Belum ada data reservasi saat ini.
                        </td>
                      </tr>
                    ) : (
                      visibleBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3.5 font-bold text-gray-900">
                            {b.customer_name}
                          </td>

                          <td className="p-3.5 font-mono text-gray-700">
                            {b.customer_phone}
                          </td>

                          <td className="p-3.5 font-medium">
                            <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200">
                              {b.service_name}
                            </span>
                          </td>

                          <td className="p-3.5 text-gray-700">
                            <div className="font-semibold text-gray-900">{b.booking_date}</div>
                            <div className="text-[10px] text-gray-500 font-mono">Pukul {b.booking_time}</div>
                          </td>

                          <td className="p-3.5 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              b.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : b.status === 'accepted'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : b.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {b.status === 'pending' ? 'Pending' : b.status === 'accepted' ? 'Diterima' : b.status === 'completed' ? 'Selesai' : 'Batal'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right font-bold font-mono text-gray-900">
                            {b.status === 'completed' ? (
                              <span className="text-emerald-700">{formatPrice(b.total_payment || 0)}</span>
                            ) : (
                              <span className="text-gray-400 font-normal italic text-[11px]">-</span>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <a
                                href={`https://wa.me/${formatWhatsAppNumber(b.customer_phone)}?text=${encodeURIComponent(
                                  `Halo Kak ${b.customer_name}, kami dari Milla Hair Studio ingin mengingatkan jadwal perawatan ${b.service_name} Anda hari ini pada pukul ${b.booking_time}. Apakah Anda masih bisa hadir sesuai jadwal? Mohon konfirmasinya ya Kak. Terima kasih.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#926C3A] border border-amber-200 text-xs font-bold transition-all"
                              >
                                WA
                              </a>

                              {b.status === 'pending' && (
                                <button
                                  onClick={() => handleAcceptBooking(b.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-xs transition-all"
                                >
                                  Terima
                                </button>
                              )}

                              {b.status === 'accepted' && (
                                <button
                                  onClick={() => handleOpenCompleteModal(b)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-xs transition-all"
                                >
                                  Selesaikan
                                </button>
                              )}

                              {b.status === 'completed' && (
                                <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                  Terbayar
                                </span>
                              )}

                              {b.status !== 'cancelled' && b.status !== 'completed' && (
                                <button
                                  onClick={() => updateSupabaseBookingStatus(b.id, 'cancelled')}
                                  className="px-2 py-1 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors"
                                >
                                  Batal
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 font-semibold text-xs transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 2. TOMBOL MUAT LEBIH BANYAK (LOAD MORE PAGINATION) */}
              {filteredBookings.length > displayLimit && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 10)}
                    className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-xs"
                  >
                    Muat Lebih Banyak ({filteredBookings.length - displayLimit} Data Tersisa)
                  </button>
                </div>
              )}

            </div>
          </>
        )}

        {/* TAB 2: DATA PELANGGAN */}
        {activeTab === 'customers' && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                Data Pelanggan Salon (CRM)
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Daftar pelanggan terdaftar dan histori akumulasi reservasi Milla Hair Studio Sidoarjo.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 sm:p-6">
              
              {/* 1. MOBILE CARD LIST UNTUK TAB PELANGGAN (NO HORIZONTAL SCROLL ON HP) */}
              <div className="flex md:hidden flex-col gap-3 w-full">
                {supabaseBookings.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-xs font-medium shadow-xs">
                    Belum ada data pelanggan tercatat.
                  </div>
                ) : (
                  Array.from(new Set(supabaseBookings.map(b => b.customer_phone))).map((phone) => {
                    const customerBookings = supabaseBookings.filter(b => b.customer_phone === phone);
                    const lastBooking = customerBookings[0];
                    return (
                      <div key={phone} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{lastBooking.customer_name}</h3>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{phone}</p>
                          </div>
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            VIP Member
                          </span>
                        </div>
                        <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
                          <span className="text-gray-500">Histori Kedatangan:</span>
                          <span className="bg-gray-100 text-gray-800 border border-gray-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                            {customerBookings.length} Kali
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* DESKTOP TABLE FOR CUSTOMERS (HIDDEN ON MOBILE SCREEN) */}
              <div className="hidden md:block w-full overflow-x-auto pb-4 scrollbar-hide rounded-xl border border-gray-200 bg-white">
                <table className="w-full min-w-[650px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600 font-bold uppercase text-[9px] tracking-wider bg-gray-50">
                      <th className="p-3.5">Nama Pelanggan</th>
                      <th className="p-3.5">No. Handphone WA</th>
                      <th className="p-3.5">Status Keanggotaan</th>
                      <th className="p-3.5 text-center">Total Reservasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {supabaseBookings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400">
                          Belum ada data pelanggan tercatat.
                        </td>
                      </tr>
                    ) : (
                      Array.from(new Set(supabaseBookings.map(b => b.customer_phone))).map((phone) => {
                        const customerBookings = supabaseBookings.filter(b => b.customer_phone === phone);
                        const lastBooking = customerBookings[0];
                        return (
                          <tr key={phone} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3.5 font-bold text-gray-900">
                              {lastBooking.customer_name}
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
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: KELOLA LAYANAN */}
        {activeTab === 'services' && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                Katalog Menu Layanan & Tarif
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Daftar menu treatment dan estimasi durasi pelayanan salon.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 sm:p-6">
              
              {/* 1. MOBILE CARD LIST UNTUK TAB LAYANAN (NO HORIZONTAL SCROLL ON HP) */}
              <div className="flex md:hidden flex-col gap-3 w-full">
                {services.map((s) => (
                  <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3 w-full">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{s.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">
                        {s.category || 'Hair Treatment'} • {s.durationMins || 60} Menit
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 font-mono text-sm block">
                        {formatPrice(s.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE FOR SERVICES (HIDDEN ON MOBILE SCREEN) */}
              <div className="hidden md:block w-full overflow-x-auto pb-4 scrollbar-hide rounded-xl border border-gray-200 bg-white">
                <table className="w-full min-w-[650px] text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600 font-bold uppercase text-[9px] tracking-wider bg-gray-50">
                      <th className="p-3.5">Nama Treatment</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Estimasi Durasi</th>
                      <th className="p-3.5 text-right">Tarif Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5 font-bold text-gray-900">
                          {s.name}
                        </td>
                        <td className="p-3.5 text-gray-600 capitalize">{s.category || 'Hair Treatment'}</td>
                        <td className="p-3.5 font-mono text-gray-600">{s.durationMins || 60} Menit</td>
                        <td className="p-3.5 text-right font-bold text-emerald-700 font-mono">
                          {formatPrice(s.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: PENGATURAN */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight">
                Pengaturan Studio & Sesi Admin
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Informasi profil salon dan status kredensial login aktif.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Profil Studio Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Profil Milla Hair Studio
                </h3>
                <div className="space-y-3 text-xs text-gray-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Nama Salon</span>
                    <span className="font-bold text-gray-900 text-sm">Milla Hair Studio Sidoarjo</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Alamat Salon</span>
                    <span>Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Buduran, Sidoarjo</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Hotline WhatsApp</span>
                    <span className="font-mono text-emerald-700 font-bold">+6285645121008</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Jam Operasional</span>
                    <span>Setiap Hari (09:30 - 20:00 WIB)</span>
                  </div>
                </div>
              </div>

              {/* Sesi Kredensial Admin Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Status Kredensial Admin
                </h3>
                <div className="space-y-3 text-xs text-gray-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Email Terautentikasi</span>
                    <span className="font-mono font-bold text-gray-900 text-sm">{currentUser?.email || 'admin01@millahairstudio.com'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Peran Akses</span>
                    <span className="bg-amber-50 text-[#926C3A] border border-amber-200 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      Owner / Super Admin
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Sesi Login</span>
                    <span className="text-emerald-700 font-bold block mt-0.5">
                      Aktif (Persisted Session)
                    </span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2.5 rounded-xl text-xs text-center transition-all"
                    >
                      Keluar dari Panel Kontrol
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. MOBILE UX: APP-LIKE BOTTOM NAVIGATION BAR (LIGHT MODE, PURE TYPOGRAPHY, ZERO ICONS) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-2 flex justify-around items-center text-xs font-bold text-gray-600 shadow-lg">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`py-2 px-3 rounded-lg transition-all ${
            activeTab === 'reservations' ? 'bg-amber-50 text-[#926C3A] font-extrabold' : 'text-gray-600'
          }`}
        >
          Reservasi
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`py-2 px-3 rounded-lg transition-all ${
            activeTab === 'customers' ? 'bg-amber-50 text-[#926C3A] font-extrabold' : 'text-gray-600'
          }`}
        >
          Pelanggan
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`py-2 px-3 rounded-lg transition-all ${
            activeTab === 'services' ? 'bg-amber-50 text-[#926C3A] font-extrabold' : 'text-gray-600'
          }`}
        >
          Layanan
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-3 rounded-lg transition-all ${
            activeTab === 'settings' ? 'bg-amber-50 text-[#926C3A] font-extrabold' : 'text-gray-600'
          }`}
        >
          Pengaturan
        </button>

        <button
          onClick={handleLogoutClick}
          className="py-2 px-3 rounded-lg text-rose-600 font-bold transition-all"
        >
          Keluar
        </button>
      </div>

      {/* MODAL POPUP: SELESAIKAN BOOKING */}
      {selectedBookingForComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 font-sans text-gray-800">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-gray-200 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                Selesaikan Booking & Pembayaran
              </h3>
              <button 
                onClick={() => setSelectedBookingForComplete(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 font-bold"
              >
                Tutup
              </button>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-gray-900 flex justify-between">
                <span>Pelanggan: {selectedBookingForComplete.customer_name}</span>
                <span className="text-gray-500 font-mono">{selectedBookingForComplete.customer_phone}</span>
              </p>
              <p className="text-gray-700">Layanan: <span className="font-bold text-[#926C3A]">{selectedBookingForComplete.service_name}</span></p>
              <p className="text-[10px] text-gray-500">Jadwal: {selectedBookingForComplete.booking_date} Pukul {selectedBookingForComplete.booking_time} WIB</p>
            </div>

            <form onSubmit={handleConfirmComplete} className="space-y-4 text-left text-xs">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Nominal Pembayaran Kasir (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={nominalPayment}
                  onChange={(e) => setNominalPayment(Number(e.target.value))}
                  placeholder="Contoh: 350000"
                  className="w-full text-base font-bold px-4 py-3 min-h-[48px] bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-600 text-gray-900 font-mono transition-all"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-medium">
                Status akan diubah menjadi Completed dan nominal dimasukkan ke dalam laporan transaksi kasir.
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForComplete(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-xs transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 font-sans text-gray-800">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-gray-200 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                Catat Booking Manual Baru
              </h3>
              <button onClick={() => setShowAddBookingModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-3.5 text-left text-xs">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Nama Pelanggan</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Contoh: Dian Sastrowardoyo"
                  className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#926C3A]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">No. Handphone Pelanggan</label>
                <input
                  type="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="Contoh: 081122334455"
                  className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#926C3A]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Menu Layanan Treatment</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#926C3A]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - ({formatPrice(s.price)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#926C3A]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Jam Kedatangan</label>
                  <select
                    value={bTime}
                    onChange={(e) => setBTime(e.target.value)}
                    className="w-full mt-1 p-3 text-base sm:text-xs min-h-[44px] bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#926C3A]"
                  >
                    {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                      <option key={t} value={t}>{t} WIB</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBookingModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold py-3 rounded-xl text-xs shadow-xs transition-all"
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
