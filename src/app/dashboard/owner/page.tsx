'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Award, Settings, 
  Database, ShieldCheck, Mail, Send, Radio, Calendar, ScrollText, Play 
} from 'lucide-react';
import { useMillaStore } from '../../../store/useMillaStore';
import { formatPrice } from '../../../lib/utils';

export default function OwnerDashboard() {
  const router = useRouter();

  const { 
    currentUser, 
    appointments, 
    users, 
    customers, 
    branches, 
    stylists, 
    marketingCampaigns,
    triggerCampaignBroadcast,
    auditLogs,
    addAuditLog
  } = useMillaStore();

  // Redirect if not owner
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'owner') {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Tab views: 'overview' | 'campaigns' | 'audits' | 'settings'
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'audits' | 'settings'>('overview');

  // simulated settings configs
  const [whatsappApiKey, setWhatsappApiKey] = useState('milla-sandbox-key-928310');
  const [emailSmtp, setEmailSmtp] = useState('smtp.mailgun.org');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  if (!currentUser) return null;

  // 1. CALCULATE REVENUE METRICS
  const completedApts = appointments.filter(apt => apt.status === 'completed');
  const totalRevenue = completedApts.reduce((sum, apt) => sum + apt.totalPrice, 0);
  const totalBookingsCount = appointments.length;
  const activeCustomersCount = customers.length;

  // 2. STAFF PERFORMANCE METRICS
  const getStaffRankings = () => {
    const stylistEarnings: { [name: string]: { revenue: number; jobs: number; rating: number } } = {};
    
    // Seed stylists
    stylists.forEach(s => {
      stylistEarnings[s.name] = { revenue: 0, jobs: 0, rating: s.rating };
    });

    completedApts.forEach(apt => {
      if (stylistEarnings[apt.stylistName]) {
        stylistEarnings[apt.stylistName].revenue += apt.totalPrice;
        stylistEarnings[apt.stylistName].jobs += 1;
      }
    });

    return Object.entries(stylistEarnings)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const staffRanks = getStaffRankings();

  // 3. RECHARTS FINANCIAL CHART DATA
  // Monthly Revenue simulation data for 2026
  const monthlySalesData = [
    { month: 'Jan', Pendapatan: 45000000, Kunjungan: 120 },
    { month: 'Feb', Pendapatan: 52000000, Kunjungan: 140 },
    { month: 'Mar', Pendapatan: 61000000, Kunjungan: 165 },
    { month: 'Apr', Pendapatan: 78000000, Kunjungan: 198 },
    { month: 'Mei', Pendapatan: 89000000, Kunjungan: 210 },
    { month: 'Jun', Pendapatan: totalRevenue + 95000000, Kunjungan: completedApts.length + 230 }
  ];

  // Branch Performance data simulation
  const branchPerformanceData = branches.map((b, idx) => {
    const baseRevenue = [85000000, 56000000, 42000000, 38000000];
    return {
      name: b.name.split(' - ')[1],
      Sales: baseRevenue[idx] || 20000000
    };
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
    addAuditLog(currentUser.id, 'Update Settings', 'Memperbarui API Gateway Kunci SMTP & WhatsApp');
  };

  const handleBackupDatabase = () => {
    alert('Simulasi Backup Sukses! File sql schema dan data state ter-download aman ke lokal cache.');
    addAuditLog(currentUser.id, 'Backup Database', 'Melakukan ekspor backup database state lengkap');
  };

  return (
    <div className="w-full bg-pink-50/10 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800 flex-1">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-950 flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-primary" />
              Owner Financial Console
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Multi-branch performance monitoring, staff rankings, marketing automations, and audit logs trails.</p>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex bg-white border border-pink-100 rounded-2xl p-1 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'overview' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            Dashboard Analytics
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'campaigns' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            Marketing Automation
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'audits' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            Audit System Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'settings' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            System Settings
          </button>
        </div>

        {/* 1. ANALYTICS OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Core Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-pink-50 text-primary">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Total Pendapatan Bersih</span>
                  <h4 className="text-2xl font-serif font-bold text-zinc-950 mt-1">{formatPrice(totalRevenue + 424000000)}</h4>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Lunas terverifikasi</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-pink-50 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Total Kunjungan Treatment</span>
                  <h4 className="text-2xl font-serif font-bold text-zinc-950 mt-1">{totalBookingsCount + 1063} Kunjungan</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Layanan booking terjadwal aktif</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-pink-50 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Customer Terdaftar VIP</span>
                  <h4 className="text-2xl font-serif font-bold text-zinc-950 mt-1">{activeCustomersCount + 348} Member</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Loyalty points tracker aktif</p>
                </div>
              </div>
            </div>

            {/* Recharts Financial Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Line Sales Chart */}
              <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3">Trend Penjualan Bulanan (2026)</h3>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySalesData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#B76E79" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#B76E79" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFF0F5" />
                      <XAxis dataKey="month" stroke="#B76E79" />
                      <YAxis stroke="#B76E79" />
                      <Tooltip />
                      <Area type="monotone" dataKey="Pendapatan" stroke="#B76E79" fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Branch Comparison Chart */}
              <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3">Kontribusi Penjualan Cabang (IDR)</h3>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFF0F5" />
                      <XAxis dataKey="name" stroke="#B76E79" />
                      <YAxis stroke="#B76E79" />
                      <Tooltip formatter={(value) => formatPrice(value as number)} />
                      <Bar dataKey="Sales" fill="#B76E79" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Staff Rankings Table */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Staff / Stylist Performance Rankings
              </h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-pink-100 text-[9px] uppercase tracking-wider font-bold text-zinc-400">
                      <th className="p-3">Rank</th>
                      <th className="p-3">Nama Stylist</th>
                      <th className="p-3 text-center">Jumlah Job Selesai</th>
                      <th className="p-3">Kontribusi Omzet</th>
                      <th className="p-3">Rating Keahlian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50/50">
                    {staffRanks.map((s, idx) => (
                      <tr key={idx} className="hover:bg-pink-50/10">
                        <td className="p-3 font-bold text-zinc-400">#{idx + 1}</td>
                        <td className="p-3 font-semibold text-zinc-900">{s.name}</td>
                        <td className="p-3 text-center font-medium">{s.jobs} Jobs</td>
                        <td className="p-3 font-bold text-zinc-950">{formatPrice(s.revenue)}</td>
                        <td className="p-3 text-amber-500 font-bold">⭐ {s.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. MARKETING CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-pink-50 pb-3">
              <h3 className="text-base font-bold font-serif text-zinc-900 flex items-center gap-2">
                <Radio className="h-5 w-5 text-primary" />
                WhatsApp & Email Marketing Automation
              </h3>
            </div>

            <p className="text-xs text-zinc-500 max-w-xl font-light">
              Milla Marketing Engine mengirimkan notifikasi penawaran otomatis berdasarkan segmentasi database customer. Klik tombol broadcast untuk menstimulasikan pengiriman pesan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketingCampaigns.map(camp => (
                <div key={camp.id} className="p-5 border border-pink-100 rounded-3xl bg-pink-50/10 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="bg-primary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Channel: {camp.channel}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold">Terkirim: {camp.statsSent} Kontak</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900">{camp.name}</h4>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed">{camp.description}</p>
                    <div className="bg-white p-3 rounded-2xl border border-pink-100 text-[10px] font-mono text-zinc-600 leading-relaxed">
                      Template: "{camp.messageTemplate}"
                    </div>
                  </div>

                  <button
                    onClick={() => triggerCampaignBroadcast(camp.id)}
                    className="w-full bg-zinc-950 text-white font-semibold py-2.5 rounded-full text-xs mt-6 flex justify-center items-center gap-1 hover:bg-zinc-800"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    Kirim Broadcast Promo (Simulasi)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. AUDIT LOGS TAB */}
        {activeTab === 'audits' && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4 animate-fade-in-up">
            <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              Sistem Audit Security Logs (RLS & Action Tracker)
            </h3>
            <p className="text-xs text-zinc-500 font-light max-w-xl">
              Audit log memantau segala aktivitas RLS Supabase dan action state cashier/admin demi kepatuhan regulasi keamanan data internal.
            </p>
            
            <div className="overflow-x-auto text-[11px] font-mono">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-pink-100 text-[9px] uppercase tracking-wider font-bold text-zinc-400 bg-pink-50/20">
                    <th className="p-3">Waktu</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Aksi (Action)</th>
                    <th className="p-3">Detil Perubahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50/50">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-pink-50/10">
                      <td className="p-3 text-zinc-400">{new Date(log.createdAt).toLocaleString('id-ID')}</td>
                      <td className="p-3 font-semibold text-zinc-800">{log.userName}</td>
                      <td className="p-3 text-primary font-bold">{log.action}</td>
                      <td className="p-3 text-zinc-600 font-light">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. SYSTEM SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-6 animate-fade-in-up">
            <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Konfigurasi Integrasi Gateway Milla
            </h3>

            {settingsSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs text-center font-medium animate-pulse">
                ✓ Pengaturan API gateway dan SMTP mailer berhasil diperbarui!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">SMTP Mail Server Host</label>
                  <input
                    type="text"
                    value={emailSmtp}
                    onChange={(e) => setEmailSmtp(e.target.value)}
                    className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">WhatsApp API Key Gateway</label>
                  <input
                    type="text"
                    value={whatsappApiKey}
                    onChange={(e) => setWhatsappApiKey(e.target.value)}
                    className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Database Backup simulation button */}
              <div className="p-6 bg-pink-50/20 border border-pink-100 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                    <Database className="h-4.5 w-4.5 text-primary animate-bounce" />
                    Backup & Ekspor Database State
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1 max-w-sm font-light">
                    Mencadangkan seluruh tabel users, orders, appointments, dan log ke file cadangan JSON terkompresi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBackupDatabase}
                  className="bg-zinc-950 text-white font-semibold py-3 px-6 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  Ekspor Backup DB
                </button>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-pink-50">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-8 rounded-full shadow transition-all"
                >
                  Simpan Konfigurasi Integrasi
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
