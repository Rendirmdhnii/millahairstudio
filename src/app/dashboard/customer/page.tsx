'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User as UserIcon, Calendar, Clock, Gift, Award, ShoppingBag, 
  Star, Edit3, Trash2, Camera, CheckCircle, RefreshCw, MessageSquare 
} from 'lucide-react';
import { useMillaStore, Appointment } from '../../../store/useMillaStore';
import { formatPrice } from '../../../lib/utils';

function CustomerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSuccessBanner = searchParams.get('booking_success');

  const { 
    currentUser, 
    appointments, 
    customers, 
    orders, 
    vouchers,
    updateAppointmentStatus, 
    rescheduleAppointment,
    addReview,
    reviews
  } = useMillaStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'customer') {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Find customer profile
  const customerProfile = customers.find(c => c.userId === currentUser?.id);

  // States for reviews
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAptId, setReviewAptId] = useState<string | null>(null);
  const [reviewStylistId, setReviewStylistId] = useState<string | null>(null);
  const [reviewServiceId, setReviewServiceId] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // States for reschedule
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('14:00');

  if (!currentUser || !customerProfile) return null;

  const myAppointments = appointments.filter(apt => apt.customerId === customerProfile.id);
  const myOrders = orders.filter(ord => ord.customerId === customerProfile.id);

  const handleCancelBooking = (id: string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan jadwal kunjungan ini?')) {
      updateAppointmentStatus(id, 'cancelled', 'refunded');
    }
  };

  const handleOpenReschedule = (apt: Appointment) => {
    setRescheduleAptId(apt.id);
    setNewDate(apt.date);
    setNewTime(apt.timeSlot);
  };

  const submitReschedule = () => {
    if (rescheduleAptId && newDate && newTime) {
      rescheduleAppointment(rescheduleAptId, newDate, newTime);
      setRescheduleAptId(null);
    }
  };

  const handleOpenReview = (apt: Appointment) => {
    setReviewAptId(apt.id);
    setReviewStylistId(apt.stylistId);
    setReviewServiceId(apt.serviceIds[0] || null);
    setReviewComment('');
    setReviewRating(5);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewAptId) {
      addReview({
        customerId: customerProfile.id,
        customerName: currentUser.name,
        appointmentId: reviewAptId,
        stylistId: reviewStylistId || undefined,
        serviceId: reviewServiceId || undefined,
        rating: reviewRating,
        comment: reviewComment,
        beforeImage: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=200',
        afterImage: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=200'
      });
      
      setReviewAptId(null);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    }
  };

  return (
    <div className="w-full bg-stone-50/30 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800 flex-1">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Success booking notification */}
        {showSuccessBanner && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-3xl flex items-center gap-3 animate-pulse">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <div className="text-xs">
              <span className="font-bold">Reservasi Berhasil Dibuat!</span> Pembayaran deposit Anda telah diverifikasi oleh sistem. Kunjungan baru terdaftar di riwayat booking Anda di bawah.
            </div>
          </div>
        )}

        {/* 1. PROFILE OVERVIEW HEADER */}
        <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-16 w-16 object-cover rounded-full border-2 border-white" />
            <div>
              <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-stone-100">{currentUser.email}</p>
              <p className="text-[10px] text-stone-100 mt-0.5">{currentUser.phone}</p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-100 uppercase tracking-widest font-semibold">
              <Award className="h-4 w-4" />
              Membership VIP
            </div>
            <p className="text-xl font-bold capitalize mt-1 text-white">{customerProfile.membershipTier}</p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-100 uppercase tracking-widest font-semibold">
              <Gift className="h-4 w-4" />
              Loyalty Points
            </div>
            <p className="text-xl font-bold mt-1 text-white">{customerProfile.loyaltyPoints} Poin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: BOOKINGS & ORDERS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* RIWAYAT BOOKING RESERVASI */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-150 pb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Jadwal Kunjungan Salon (Booking)
              </h3>

              {myAppointments.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">Belum ada pemesanan jadwal salon aktif.</p>
              ) : (
                <div className="space-y-4">
                  {myAppointments.map((apt) => (
                    <div 
                       key={apt.id} 
                       className="border border-zinc-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50/40"
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
                            {apt.status === 'pending' ? 'Menunggu Persetujuan' : apt.status}
                          </span>
                          <span className="text-[10px] text-zinc-400">ID: {apt.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900">{apt.branchName}</h4>
                        <p className="text-xs text-zinc-600 font-medium">Stylist: {apt.stylistName}</p>
                        <p className="text-[10px] text-zinc-500">
                          Layanan: {apt.servicesDetails.map(s => s.name).join(', ')}
                        </p>
                        <p className="text-xs font-semibold text-primary flex items-center gap-1 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {apt.date} @ {apt.timeSlot}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 w-full sm:w-auto">
                        {apt.status === 'approved' && (
                          <>
                            <button
                              onClick={() => handleOpenReschedule(apt)}
                              className="flex-1 sm:flex-none bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold px-3 py-1.5 rounded-xl text-xs flex justify-center items-center gap-1"
                            >
                              <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelBooking(apt.id)}
                              className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 font-semibold px-3 py-1.5 rounded-xl text-xs flex justify-center items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Batal
                            </button>
                          </>
                        )}
                        {apt.status === 'completed' && !reviews.some(r => r.appointmentId === apt.id) && (
                          <button
                            onClick={() => handleOpenReview(apt)}
                            className="w-full sm:w-auto bg-primary text-white hover:bg-primary-hover font-semibold px-4 py-2 rounded-xl text-xs flex justify-center items-center gap-1 shadow-sm"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Beri Ulasan
                          </button>
                        )}
                        {apt.status === 'completed' && reviews.some(r => r.appointmentId === apt.id) && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                            Diulas
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BELANJA PRODUK / E-COMMERCE ORDERS */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-150 pb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Pesanan Produk Saya (Marketplace)
              </h3>

              {myOrders.length === 0 ? (
                <p className="text-xs text-zinc-400 py-6 text-center">Belum ada riwayat pesanan produk online.</p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="border border-zinc-150 rounded-2xl p-4 space-y-3 bg-stone-50/20"
                    >
                      <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400 border-b border-zinc-100 pb-2">
                        <span>Tanggal: {new Date(ord.createdAt).toLocaleDateString('id-ID')}</span>
                        <span>Order ID: {ord.id}</span>
                      </div>
                      
                      {/* Products */}
                      <div className="space-y-1">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex justify-between text-xs font-semibold text-zinc-800">
                            <span>{it.productName} (x{it.quantity})</span>
                            <span>{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status and tracking resi */}
                      <div className="pt-2 border-t border-zinc-150 flex flex-wrap justify-between items-center gap-3 text-xs">
                        <div>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase">No. Resi Pengiriman (J&T Express)</p>
                          <p className="text-primary font-bold">{ord.trackingNumber}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full uppercase">
                            {ord.status === 'processing' ? 'Dipacking' : ord.status}
                          </span>
                          <span className="font-bold text-zinc-950">{formatPrice(ord.total)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 1 COLUMN: CRM / PREFERENCES & VOUCHERS */}
          <div className="space-y-6">
            
            {/* CATATAN PREFERENSI & ALERGI (CRM) */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-150 pb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Catatan Treatment & Alergi
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Catatan Alergi Zat Pewarna</p>
                  <p className="p-3 bg-red-50/50 text-red-700 border border-red-150 rounded-2xl font-semibold mt-1">
                    {customerProfile.allergies.length > 0 
                      ? customerProfile.allergies.join(', ')
                      : 'Tidak ada alergi tercatat.'}
                  </p>
                </div>
                
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Preferensi Layanan (Customer Preferences)</p>
                  <p className="p-3 bg-stone-50 text-zinc-600 border border-stone-100 rounded-2xl mt-1 leading-relaxed">
                    {customerProfile.preferences || 'Belum ada preferensi tercatat.'}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-zinc-150 text-[10px] text-zinc-500 leading-relaxed">
                  Catatan alergi dan preferensi di atas dibaca secara realtime oleh stylist saat memproses pengerjaan rambut Anda di salon demi keamanan maksimal.
                </div>
              </div>
            </div>

            {/* VOUCHER SAYA */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-150 pb-3 flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Voucher Diskon Saya
              </h3>

              <div className="space-y-3">
                {vouchers.map(v => (
                  <div key={v.id} className="p-3 border border-dashed border-zinc-200 rounded-2xl bg-stone-50 text-center">
                    <span className="text-xs font-bold text-zinc-800 tracking-wider block">{v.code}</span>
                    <span className="text-[10px] text-zinc-400 block mt-1">{v.description}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* MODAL DIALOG: RESCHEDULE SCHEDULER */}
        {rescheduleAptId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-zinc-200 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-zinc-900">Reschedule Kunjungan</h3>
              <p className="text-xs text-zinc-500">Pilih tanggal baru dan jam kedatangan Anda. Kami akan memperbarui status reservasi.</p>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Pilih Tanggal Baru</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Pilih Jam</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  >
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="19:00">19:00</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setRescheduleAptId(null)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-full text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={submitReschedule}
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-full text-xs"
                >
                  Simpan Jadwal Baru
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DIALOG: FEEDBACK REVIEW SUBMISSION */}
        {reviewAptId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-zinc-250 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-zinc-900">Beri Rating & Review Kunjungan</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
                {/* Star selectors */}
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-1">Pilih Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`h-6 w-6 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Text Area */}
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Komentar & Pengalaman</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Ceritakan pengalaman treatment atau keramahtamahan stylist..."
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                    required
                  />
                </div>

                {/* Before-after photo uploads (simulated) */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 border border-dashed border-zinc-200 rounded-2xl bg-stone-50 flex flex-col items-center gap-1.5 cursor-pointer">
                    <Camera className="h-5 w-5 text-primary" />
                    <span>Upload Foto Before</span>
                    <span className="text-[9px] text-zinc-400 italic">Disimulasikan otomatis</span>
                  </div>
                  <div className="p-3 border border-dashed border-zinc-200 rounded-2xl bg-stone-50 flex flex-col items-center gap-1.5 cursor-pointer">
                    <Camera className="h-5 w-5 text-primary" />
                    <span>Upload Foto After</span>
                    <span className="text-[9px] text-zinc-400 italic">Disimulasikan otomatis</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewAptId(null)}
                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-full text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-full text-xs"
                  >
                    Kirim Review Ke Publik
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function CustomerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs text-zinc-500 font-medium">Memuat Dashboard Customer...</div>}>
      <CustomerDashboardContent />
    </Suspense>
  );
}
