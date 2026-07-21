'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Scissors, Calendar, Clock, DollarSign, Target, Award, 
  Check, FileText, CheckCircle2, AlertCircle, Edit3, X 
} from 'lucide-react';
import { useMillaStore, Appointment } from '../../../store/useMillaStore';
import { formatPrice } from '../../../lib/utils';

export default function StylistDashboard() {
  const router = useRouter();
  
  const { 
    currentUser, 
    appointments, 
    stylists, 
    updateAppointmentStatus,
    addAuditLog
  } = useMillaStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'stylist') {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Attendance checking simulator
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Treatment notes editor states
  const [editAptId, setEditAptId] = useState<string | null>(null);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [treatmentFormula, setTreatmentFormula] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);

  if (!currentUser) return null;

  // Find stylist profile matching user
  const stylistProfile = stylists.find(s => s.avatar.includes(currentUser.avatar) || s.name.toLowerCase().includes(currentUser.name.toLowerCase()));
  if (!stylistProfile) return <div className="p-8 text-center text-xs text-red-500">Profil Stylist tidak ditemukan.</div>;

  const myAppointments = appointments.filter(apt => apt.stylistId === stylistProfile.id);
  const completedApts = myAppointments.filter(apt => apt.status === 'completed');

  // Calculations: 10% commission on completed jobs
  const totalRevenue = completedApts.reduce((sum, apt) => sum + apt.totalPrice, 0);
  const totalCommission = totalRevenue * 0.10;
  const targetGoal = 15000000; // Rp 15.000.000 target
  const targetPercent = Math.min(100, (totalRevenue / targetGoal) * 100);

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString('id-ID');
    setIsCheckedIn(true);
    setCheckInTime(time);
    addAuditLog(currentUser.id, 'Stylist Check-in', `Melakukan absensi masuk pada jam ${time}`);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    addAuditLog(currentUser.id, 'Stylist Check-out', `Melakukan absensi pulang`);
  };

  const handleOpenNotes = (apt: Appointment) => {
    setEditAptId(apt.id);
    setTreatmentNotes(apt.notes || '');
    setTreatmentFormula('');
  };

  const saveTreatmentNotes = () => {
    if (editAptId) {
      // Append formula to notes
      const finalNotes = `${treatmentNotes} | Formula Pewarnaan: ${treatmentFormula || 'N/A'}`;
      
      // Update appointment notes in store directly by editing state
      useMillaStore.setState(state => ({
        appointments: state.appointments.map(apt => 
          apt.id === editAptId ? { ...apt, notes: finalNotes } : apt
        )
      }));

      setEditAptId(null);
      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 3000);
      addAuditLog(currentUser.id, 'Save Treatment Notes', `Menyimpan formula & catatan treatment untuk booking ${editAptId}`);
    }
  };

  return (
    <div className="w-full bg-pink-50/10 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800 flex-1">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. STYLIST SUMMARY HEADER */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-16 w-16 object-cover rounded-full border-2 border-primary" />
            <div>
              <h2 className="text-lg font-serif font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-primary font-medium">{stylistProfile.specialty.join(' • ')}</p>
              <p className="text-[10px] text-zinc-400 mt-1">⭐ {stylistProfile.rating} Google Rating ({stylistProfile.reviewsCount} review)</p>
            </div>
          </div>

          {/* Attendance Action */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center flex flex-col items-center gap-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">Absensi Hari Ini</span>
            {isCheckedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-bold">Terabsen ({checkInTime})</span>
                <button
                  onClick={handleCheckOut}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[10px] font-bold px-3 py-1 rounded-lg border border-red-500/30 transition-colors"
                >
                  Absen Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={handleCheckIn}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-6 py-2 rounded-full shadow transition-all"
              >
                Absen Masuk
              </button>
            )}
          </div>
        </div>

        {/* 2. STATS GRID & PERFORMANCE TARGET METERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Commission box */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Komisi Kunjungan Bulan Ini</span>
              <h4 className="text-xl font-bold text-zinc-950 font-serif mt-1">{formatPrice(totalCommission)}</h4>
              <p className="text-[10px] text-zinc-500 mt-1">10% komisi dari total jasa potong/warna</p>
            </div>
          </div>

          {/* Target meter */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-3.5 col-span-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Target className="h-4 w-4 text-primary" />
                Target Penjualan Treatment Bulanan
              </span>
              <span className="text-xs font-bold text-primary">{formatPrice(totalRevenue)} / {formatPrice(targetGoal)}</span>
            </div>
            <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000" 
                style={{ width: `${targetPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-400">
              Capai target penjualan Rp 15jt untuk mendapatkan bonus ekstra komisi +5% dari manajer cabang.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* APPOINTMENT LISTS (LEFT 2 COLUMNS) */}
          <div className="lg:col-span-2 space-y-6">
            {noteSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs text-center font-medium animate-pulse">
                Catatan treatment dan formula kimia berhasil disimpan ke riwayat medis customer!
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Jadwal Appointment Saya
              </h3>

              {myAppointments.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">Belum ada jadwal kunjungan ditugaskan ke Anda.</p>
              ) : (
                <div className="space-y-4">
                  {myAppointments.map((apt) => (
                    <div 
                      key={apt.id} 
                      className="border border-pink-50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-pink-50/5/10"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            apt.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : apt.status === 'cancelled'
                              ? 'bg-red-50 text-red-500 border border-red-100'
                              : 'bg-primary/10 text-primary border border-primary/20'
                          }`}>
                            {apt.status === 'pending' ? 'Menunggu Approval' : apt.status}
                          </span>
                          <span className="text-[10px] text-zinc-400">ID: {apt.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900">{apt.customerName}</h4>
                        <p className="text-[10px] text-zinc-500">Telp: {apt.customerPhone}</p>
                        <p className="text-[10px] text-zinc-500">
                          Treatment: {apt.servicesDetails.map(s => s.name).join(', ')}
                        </p>
                        <p className="text-xs font-semibold text-primary flex items-center gap-1 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {apt.date} @ {apt.timeSlot}
                        </p>
                        {apt.notes && (
                          <p className="text-[10px] bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-100 mt-2 font-mono">
                            Catatan Client: {apt.notes}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 w-full sm:w-auto">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'approved')}
                            className="w-full sm:w-auto bg-primary text-white hover:bg-primary-hover font-semibold px-4 py-2 rounded-xl text-xs flex justify-center items-center gap-1 shadow-sm"
                          >
                            Setujui Reservasi
                          </button>
                        )}
                        {apt.status === 'approved' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed', 'paid')}
                            className="w-full sm:w-auto bg-emerald-500 text-white hover:bg-emerald-600 font-semibold px-4 py-2 rounded-xl text-xs flex justify-center items-center gap-1 shadow-sm"
                          >
                            Selesaikan Kunjungan
                          </button>
                        )}
                        {apt.status === 'completed' && (
                          <button
                            onClick={() => handleOpenNotes(apt)}
                            className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold px-4 py-2 rounded-xl text-xs flex justify-center items-center gap-1"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Tulis Catatan Treatment
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MEDICAL HISTORY / STAFF TIPS (RIGHT 1 COLUMN) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Daftar Client Tetap & Catatan Medis
              </h3>
              
              <div className="space-y-3.5 text-xs text-zinc-600 font-light">
                <p>
                  Selalu cek **catatan alergi** dan preferensi pelanggan sebelum mencampurkan zat hidrogen peroksida atau keratin kimiawi untuk mewarnai rambut.
                </p>
                <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-2xl">
                  <strong>Penting:</strong> Aurelia Cantika memiliki alergi hidrogen peroksida kadar tinggi (&gt;9%). Gunakan developer 20 vol kebawah.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DIALOG FORM: WRITE TREATMENT NOTES */}
        {editAptId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-pink-50 pb-3">
                <h3 className="text-lg font-serif font-bold text-zinc-900">Catatan Formula Treatment</h3>
                <button onClick={() => setEditAptId(null)} className="p-1 hover:bg-pink-100 rounded-full text-zinc-400">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 text-left">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Catatan Hasil & Rekomendasi</label>
                  <textarea
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                    rows={3}
                    placeholder="Contoh: Rambut dipotong layer tipis, disarankan creambath spa 2 minggu lagi..."
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Formula Bahan Kimia (Warna/Bleach)</label>
                  <input
                    type="text"
                    value={treatmentFormula}
                    onChange={(e) => setTreatmentFormula(e.target.value)}
                    placeholder="Contoh: Bleach Majirel L'Oreal + Dev 20 vol (1:1.5) + Rose Gold Tone"
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setEditAptId(null)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-full text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={saveTreatmentNotes}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-full text-xs animate-pulse"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
