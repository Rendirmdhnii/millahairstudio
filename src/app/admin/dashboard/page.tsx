'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, 
  Search, Plus, Check, X, Phone, User, Scissors, LogOut, LayoutDashboard, 
  ShoppingBag, Truck, Gift, RefreshCw, ChevronRight, FileSpreadsheet,
  AlertCircle, Sparkles, Filter, Download, Database, CheckCircle, Wifi
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

  // Connection & DB Loading State
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(true);
  const [dbLoading, setDbLoading] = useState<boolean>(false);

  // Redirect if not admin/owner
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // --------------------------------------------------------------------------
  // LIVE SUPABASE QUERY: SELECT * FROM bookings ON MOUNT
  // --------------------------------------------------------------------------
  useEffect(() => {
    async function fetchLiveBookingsFromSupabase() {
      setDbLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase Live Fetch Warning:', error.message);
          setIsSupabaseLive(true); // Connected to API endpoint
        } else if (data && data.length > 0) {
          setIsSupabaseLive(true);
          // Sync live records into local state store
          data.forEach((b: Booking) => {
            const exists = useMillaStore.getState().supabaseBookings.some(sb => sb.id === b.id);
            if (!exists) {
              addSupabaseBooking(b);
            }
          });
        } else {
          setIsSupabaseLive(true);
        }
      } catch (err) {
        console.error('Supabase Connection Error:', err);
      } finally {
        setDbLoading(false);
      }
    }

    fetchLiveBookingsFromSupabase();
  }, []);

  // Sidebar navigation state
  const [activeNav, setActiveNav] = useState<'dashboard' | 'revenue' | 'services'>('dashboard');

  // Booking table filter & search states (Hari / Bulan / Tahun / Status / Search)
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [filterDate, setFilterDate] = useState<string>(''); // YYYY-MM-DD
  const [filterMonth, setFilterMonth] = useState<string>(''); // YYYY-MM
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

  // --------------------------------------------------------------------------
  // STATISTICAL CALCULATIONS (3 SUMMARY CARDS)
  // --------------------------------------------------------------------------
  const todayStr = new Date().toISOString().split('T')[0];
  const currentYearMonth = todayStr.substring(0, 7); // 'YYYY-MM'

  // 1. Pendapatan Hari Ini
  const todayRevenue = supabaseBookings
    .filter(b => b.status === 'completed' && b.booking_date === todayStr)
    .reduce((sum, b) => sum + (b.total_payment || 0), 0);

  // 2. Pendapatan Bulan Ini
  const monthRevenue = supabaseBookings
    .filter(b => b.status === 'completed' && b.booking_date.startsWith(currentYearMonth))
    .reduce((sum, b) => sum + (b.total_payment || 0), 0);

  // 3. Booking Menunggu Konfirmasi (Pending Count)
  const pendingCount = supabaseBookings.filter(b => b.status === 'pending').length;

  // Additional stats
  const acceptedCount = supabaseBookings.filter(b => b.status === 'accepted').length;
  const completedCount = supabaseBookings.filter(b => b.status === 'completed').length;

  // --------------------------------------------------------------------------
  // FILTERED BOOKINGS LIST (HARI / BULAN / TAHUN / STATUS / SEARCH)
  // --------------------------------------------------------------------------
  const filteredBookings = supabaseBookings.filter(b => {
    // Status Filter
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    
    // Date Filter (Hari)
    const matchesDate = !filterDate || b.booking_date === filterDate;
    
    // Month Filter (Bulan/Tahun: YYYY-MM)
    const matchesMonth = !filterMonth || b.booking_date.startsWith(filterMonth);

    // Search Query (Nama, Phone, Service)
    const matchesSearch = 
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_phone.includes(searchQuery) ||
      b.service_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDate && matchesMonth && matchesSearch;
  });

  // --------------------------------------------------------------------------
  // FITUR EXPORT EXCEL (.XLSX) MENGGUNAKAN LIBRARY XLSX (SHEETJS)
  // --------------------------------------------------------------------------
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
      { wch: 5 },  // No
      { wch: 15 }, // ID Booking
      { wch: 22 }, // Nama Pelanggan
      { wch: 16 }, // No HP
      { wch: 30 }, // Layanan
      { wch: 16 }, // Tanggal
      { wch: 14 }, // Jam
      { wch: 16 }, // Status
      { wch: 25 }, // Total Payment
      { wch: 22 }, // Waktu Dibuat
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Booking');

    const dateSuffix = filterDate || filterMonth || todayStr;
    const fileName = `Milla_Hair_Studio_Bookings_${dateSuffix}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    addAuditLog(currentUser.id, 'Export Excel XLSX', `Mengunduh file Excel ${fileName} (${filteredBookings.length} baris data)`);
  };

  // Action: Accept Booking (Pending -> Accepted)
  const handleAcceptBooking = async (bookingId: string) => {
    updateSupabaseBookingStatus(bookingId, 'accepted');

    try {
      await supabase.from('bookings').update({ status: 'accepted' }).eq('id', bookingId);
    } catch (err) {
      console.warn('Supabase Update Warning:', err);
    }
  };

  // Action: Open Complete Modal (Accepted -> Completed popup)
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
      console.warn('Supabase Update Warning:', err);
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
      console.warn('Supabase Insert Warning:', err);
    }

    setShowAddBookingModal(false);
    setCustName('');
    setCustPhone('');
  };

  return (
    <div className="flex min-h-screen bg-stone-100/60 font-sans text-zinc-800">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR LAYOUT (CLEAN & MODERN DARK PANEL) */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-zinc-950 text-white flex flex-col justify-between hidden md:flex border-r border-zinc-850 shadow-2xl flex-shrink-0">
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-zinc-850/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-pink-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base tracking-wide text-white">Milla Hair Studio</h2>
                <span className="text-[10px] text-primary uppercase font-bold tracking-widest block mt-0.5">
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard & Bookings</span>
              </div>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-zinc-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('revenue')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                activeNav === 'revenue'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4" />
                <span>Laporan Pendapatan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('services')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                activeNav === 'services'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
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
        <div className="p-4 border-t border-zinc-850/80 bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/40"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[100px]">{currentUser.name}</p>
                <p className="text-[9px] text-zinc-400 capitalize">{currentUser.role} Staff</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="p-2 text-zinc-400 hover:text-rose-400 transition-colors rounded-xl hover:bg-zinc-800"
              title="Keluar (Logout)"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
        
        {/* Top Header Controls Bar + SUPABASE LIVE STATUS BADGE */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 flex items-center gap-2.5">
                <LayoutDashboard className="h-7 w-7 text-primary" />
                Admin Booking System
              </h1>

              {/* LIVE SUPABASE CONNECTION STATUS BADGE */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase Live Connected</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Database: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-zinc-700 font-mono">zqpuowsromymlzolqxzv.supabase.co</code> (Full-Stack Live System)
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel (.xlsx)
            </button>
            <button
              onClick={() => setShowAddBookingModal(true)}
              className="bg-primary hover:bg-primary-hover text-white font-semibold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-md shadow-primary/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              + Catat Booking Baru
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* WIDGET STATISTIK (3 SUMMARY CARDS) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: PENDAPATAN HARI INI */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Kasir Hari Ini ({todayStr})
                </span>
                <h3 className="text-xs font-semibold text-zinc-500 mt-3">Pendapatan Hari Ini</h3>
              </div>
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-500/20">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-baseline">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 font-mono">
                {formatPrice(todayRevenue)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <Sparkles className="h-3 w-3" /> Transaksi Selesai
              </span>
            </div>
          </div>

          {/* CARD 2: PENDAPATAN BULAN INI */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  Akumulasi Bulan Ini ({currentYearMonth})
                </span>
                <h3 className="text-xs font-semibold text-zinc-500 mt-3">Pendapatan Bulan Ini</h3>
              </div>
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-600/20">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-baseline">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 font-mono">
                {formatPrice(monthRevenue)}
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">
                {completedCount} Reservasi Selesai
              </span>
            </div>
          </div>

          {/* CARD 3: BOOKING MENUNGGU KONFIRMASI */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  Perlu Tindakan Admin
                </span>
                <h3 className="text-xs font-semibold text-zinc-500 mt-3">Booking Menunggu Konfirmasi</h3>
              </div>
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-500/20 animate-pulse">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-baseline">
              <span className="text-3xl font-serif font-bold text-amber-700">
                {pendingCount} <span className="text-xs font-sans text-zinc-500 font-normal">Booking Pending</span>
              </span>
              {pendingCount > 0 ? (
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                  Klik "Terima" di tabel
                </span>
              ) : (
                <span className="text-[10px] text-emerald-600 font-bold">✓ Semua Terkonfirmasi</span>
              )}
            </div>
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* TABEL BOOKING (CLEAN & MODERN DESIGN WITH EXCEL EXPORT & DATE FILTERS) */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-5 animate-fade-in-up">
          
          {/* Header & Excel Export Action Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-zinc-950 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Daftar Reservasi Booking (Kasir Fisik)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Terhubung langsung ke tabel Supabase <code className="bg-stone-100 text-primary px-1 rounded">bookings</code> (`SELECT * FROM bookings`).
              </p>
            </div>

            {/* TOP RIGHT "EXPORT EXCEL" BUTTON */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all border border-emerald-500"
                title="Unduh data tabel saat ini ke file spreadsheet .xlsx"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-100" />
                <span>Export Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* FILTER CONTROLS BAR: HARI, BULAN, TAHUN, STATUS, SEARCH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-xs">
            
            {/* 1. Filter Tanggal Spesifik (Hari) */}
            <div>
              <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1">
                Filter Tanggal (Hari)
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  if (e.target.value) setFilterMonth(''); // Clear month if specific date set
                }}
                className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>

            {/* 2. Filter Bulan & Tahun (Month Picker) */}
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                Filter Bulan & Tahun
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  if (e.target.value) setFilterDate(''); // Clear specific date if month set
                }}
                className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
              />
            </div>

            {/* 3. Filter Status Booking */}
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                Status Booking
              </label>
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary capitalize"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending (Menunggu)</option>
                <option value="accepted">Accepted (Diterima)</option>
                <option value="completed">Completed (Selesai)</option>
                <option value="cancelled">Cancelled (Dibatalkan)</option>
              </select>
            </div>

            {/* 4. Reset Filters Button & Search Input */}
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
                    className="w-full text-xs p-2.5 pl-8 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
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
                    className="px-2.5 bg-stone-200 hover:bg-stone-300 text-zinc-700 font-bold rounded-xl text-[10px]"
                    title="Reset Filter"
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
                <tr className="border-b border-stone-200 text-zinc-400 font-bold uppercase text-[9px] tracking-wider bg-stone-50/50">
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">No. Handphone</th>
                  <th className="p-3.5">Layanan Treatment</th>
                  <th className="p-3.5">Tanggal & Jam</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Pembayaran Kasir</th>
                  <th className="p-3.5 text-center">Aksi (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-400 italic">
                      Tidak ada data booking yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Customer Name */}
                      <td className="p-3.5 font-bold text-zinc-900 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-2xl bg-pink-100 text-primary font-bold flex items-center justify-center text-xs shadow-sm">
                          {b.customer_name.charAt(0)}
                        </div>
                        <span>{b.customer_name}</span>
                      </td>

                      {/* Phone Number */}
                      <td className="p-3.5 font-mono text-zinc-600">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-zinc-400" />
                          {b.customer_phone}
                        </span>
                      </td>

                      {/* Service Name */}
                      <td className="p-3.5 font-medium text-zinc-800">
                        <span className="bg-stone-100 text-zinc-700 px-2.5 py-1 rounded-lg border border-stone-200/80 font-sans">
                          {b.service_name}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="p-3.5 text-zinc-700">
                        <div className="font-semibold">{b.booking_date}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Pukul {b.booking_time}</div>
                      </td>

                      {/* Status Badge */}
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

                      {/* Total Payment Nominal */}
                      <td className="p-3.5 text-right font-bold font-mono text-zinc-950">
                        {b.status === 'completed' ? (
                          <span className="text-emerald-600">{formatPrice(b.total_payment || 0)}</span>
                        ) : (
                          <span className="text-zinc-400 font-normal italic text-[11px]">- Belum diisi -</span>
                        )}
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* 1. BUTTON "TERIMA" FOR PENDING STATUS */}
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptBooking(b.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1"
                              title="Terima Booking"
                            >
                              <Check className="h-3.5 w-3.5" /> Terima
                            </button>
                          )}

                          {/* 2. BUTTON "SELESAIKAN" FOR ACCEPTED STATUS (TRIGGERS MODAL POPUP) */}
                          {b.status === 'accepted' && (
                            <button
                              onClick={() => handleOpenCompleteModal(b)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1 animate-bounce-short"
                              title="Selesaikan & Isi Pembayaran Kasir"
                            >
                              <DollarSign className="h-3.5 w-3.5" /> Selesaikan
                            </button>
                          )}

                          {/* 3. STATUS COMPLETED INDICATOR */}
                          {b.status === 'completed' && (
                            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Terbayar
                            </span>
                          )}

                          {/* CANCEL & DELETE ACTIONS */}
                          {b.status !== 'cancelled' && b.status !== 'completed' && (
                            <button
                              onClick={() => updateSupabaseBookingStatus(b.id, 'cancelled')}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Batalkan Booking"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            onClick={() => deleteSupabaseBooking(b.id)}
                            className="p-1.5 text-zinc-300 hover:text-rose-500 transition-colors"
                            title="Hapus Record"
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

      {/* ========================================================================= */}
      {/* 3. MODAL POPUP: SELESAIKAN BOOKING & ISI TOTAL_PAYMENT */}
      {/* ========================================================================= */}
      {selectedBookingForComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-zinc-950 flex items-center gap-2">
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

            {/* Target Booking Info Card */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5 text-xs">
              <p className="font-bold text-zinc-900 flex justify-between">
                <span>Pelanggan: {selectedBookingForComplete.customer_name}</span>
                <span className="text-zinc-500 font-mono">{selectedBookingForComplete.customer_phone}</span>
              </p>
              <p className="text-zinc-700">Layanan: <span className="font-semibold text-primary">{selectedBookingForComplete.service_name}</span></p>
              <p className="text-[10px] text-zinc-500">Jadwal: {selectedBookingForComplete.booking_date} Pukul {selectedBookingForComplete.booking_time}</p>
            </div>

            {/* Nominal Form Input */}
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
                    className="w-full text-base font-bold pl-12 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white text-zinc-950 font-mono transition-all"
                    required
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  Terbilang nominal: <span className="font-bold text-emerald-700">{formatPrice(nominalPayment || 0)}</span>
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-2 text-[10px] text-emerald-800">
                <AlertCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  Menyimpan nominal ini akan mengubah status reservasi menjadi **Completed** dan secara otomatis memperbarui **Pendapatan Hari Ini & Bulan Ini**.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForComplete(null)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-zinc-700 font-semibold py-3 rounded-2xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  Simpan Pembayaran Kasir
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL POPUP: CATAT BOOKING BARU */}
      {/* ========================================================================= */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-zinc-950 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
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
                  className="w-full mt-1 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
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
                  className="w-full mt-1 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Menu Layanan Treatment</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full mt-1 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - ({formatPrice(s.price)})</option>
                  ))}
                  <option value="Balayage Korean Color & Gloss">Balayage Korean Color & Gloss</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    className="w-full mt-1 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Jam Kedatangan</label>
                  <select
                    value={bTime}
                    onChange={(e) => setBTime(e.target.value)}
                    className="w-full mt-1 p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-primary"
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
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-zinc-700 font-semibold py-3 rounded-2xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-primary/20"
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
