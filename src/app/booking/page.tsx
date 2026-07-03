'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Scissors, MapPin, Calendar, Clock, Sparkles, User as UserIcon, 
  Check, ChevronRight, ChevronLeft, ShieldCheck, Ticket, AlertTriangle 
} from 'lucide-react';
import { useMillaStore } from '@/store/useMillaStore';
import { formatPrice } from '@/lib/utils';
import QrisModal from '../../components/qris-modal';

function BookingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Preselects
  const preSelectedServiceId = searchParams.get('serviceId');
  const preSelectedStylistId = searchParams.get('stylistId');

  const { 
    branches, 
    stylists, 
    services, 
    vouchers, 
    currentUser, 
    addAppointment,
    appointments
  } = useMillaStore();

  // Wizard Steps: 1 = Branch, 2 = Stylist, 3 = Services, 4 = DateTime, 5 = Review & Pay
  const [step, setStep] = useState(1);
  
  // Selection States
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<any | null>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Payment Modal Trigger
  const [showPayment, setShowPayment] = useState(false);

  // Preselect from query parameters on load
  useEffect(() => {
    if (preSelectedServiceId) {
      const s = services.find(srv => srv.id === preSelectedServiceId);
      if (s) setSelectedServices([s]);
    }
    if (preSelectedStylistId) {
      const sty = stylists.find(s => s.id === preSelectedStylistId);
      if (sty) {
        setSelectedStylist(sty);
        const b = branches.find(br => br.id === sty.branchId);
        if (b) setSelectedBranch(b);
      }
    }
  }, [preSelectedServiceId, preSelectedStylistId, services, stylists, branches]);

  // Set default booking date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Time Slots Simulator
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  
  // Compute unavailable slots dynamically based on existing bookings
  const getUnavailableSlots = () => {
    if (!selectedStylist || !bookingDate) return [];
    return appointments
      .filter(apt => apt.stylistId === selectedStylist.id && apt.date === bookingDate && apt.status !== 'cancelled')
      .map(apt => apt.timeSlot);
  };

  const unavailableSlots = getUnavailableSlots();

  // Calculation helpers
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMins, 0);

  // Apply Voucher
  const handleApplyVoucher = () => {
    setVoucherError(null);
    const matched = vouchers.find(v => v.code.toUpperCase() === voucherCode.toUpperCase() && v.active);
    if (!matched) {
      setVoucherError('Kode voucher tidak valid atau kedaluwarsa.');
      return;
    }
    if (subtotal < matched.minPurchase) {
      setVoucherError(`Minimal belanja untuk voucher ini adalah ${formatPrice(matched.minPurchase)}`);
      return;
    }
    setAppliedVoucher(matched);
  };

  let discount = 0;
  if (appliedVoucher) {
    discount = appliedVoucher.isPercentage
      ? (subtotal * appliedVoucher.discountAmount) / 100
      : appliedVoucher.discountAmount;
  }
  const total = Math.max(0, subtotal - discount);

  // Trigger Booking Completion
  const handleOpenPayment = () => {
    if (!currentUser) {
      // Force Login with redirect parameters
      router.push('/login?redirect=booking');
      return;
    }
    if (!selectedBranch || !selectedStylist || selectedServices.length === 0 || !bookingDate || !bookingTime) {
      alert('Mohon lengkapi semua data reservasi.');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentMethod: string) => {
    if (!currentUser) return;
    
    // Add to Zustand database
    const servicesDetails = selectedServices.map(s => ({
      name: s.name,
      price: s.price,
      duration: s.durationMins
    }));

    const customerProfile = useMillaStore.getState().customers.find(c => c.userId === currentUser.id);

    addAppointment({
      customerId: customerProfile?.id || 'cust-1',
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      stylistId: selectedStylist.id,
      stylistName: selectedStylist.name,
      serviceIds: selectedServices.map(s => s.id),
      servicesDetails,
      date: bookingDate,
      timeSlot: bookingTime,
      totalPrice: total,
      depositPaid: 100000, // Rp 100.000 deposit paid
      paymentMethod,
      notes
    });

    router.push('/dashboard/customer?booking_success=true');
  };

  const handleToggleService = (service: any) => {
    if (selectedServices.some(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="w-full bg-stone-50/40 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800 flex-1">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-zinc-200 shadow-md overflow-hidden animate-fade-in-up">
        
        {/* Banner */}
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h1 className="text-lg font-bold">Online Booking System</h1>
          </div>
          <span className="text-[10px] uppercase font-semibold bg-white/20 px-3 py-1 rounded-full">
            Langkah {step} dari 5
          </span>
        </div>

        {/* Wizard Steps Bar */}
        <div className="grid grid-cols-5 bg-stone-50 text-center text-[10px] font-bold text-zinc-400 border-b border-zinc-200">
          <div className={`py-3 ${step >= 1 ? 'text-primary border-b-2 border-primary' : ''}`}>1. Cabang</div>
          <div className={`py-3 ${step >= 2 ? 'text-primary border-b-2 border-primary' : ''}`}>2. Stylist</div>
          <div className={`py-3 ${step >= 3 ? 'text-primary border-b-2 border-primary' : ''}`}>3. Layanan</div>
          <div className={`py-3 ${step >= 4 ? 'text-primary border-b-2 border-primary' : ''}`}>4. Jadwal</div>
          <div className={`py-3 ${step >= 5 ? 'text-primary border-b-2 border-primary' : ''}`}>5. Konfirmasi</div>
        </div>

        <div className="p-8 min-h-[380px]">
          
          {/* STEP 1: PILIH CABANG */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2">Pilih Cabang Milla Hair Studio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBranch(b);
                      setSelectedStylist(null); // Reset stylist if branch changes
                      setStep(2);
                    }}
                    className={`p-4 border rounded-2xl flex gap-4 text-left transition-all hover:border-primary/50 hover:shadow-sm ${
                      selectedBranch?.id === b.id ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-200'
                    }`}
                  >
                    <img src={b.image} alt={b.name} className="h-16 w-16 object-cover rounded-xl" />
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">{b.name}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1">{b.address}</p>
                      <p className="text-[10px] text-primary font-medium mt-1">⭐ {b.rating} / 5</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PILIH STYLIST */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2">Pilih Stylist Profesional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filter stylists associated with selected branch */}
                {stylists
                  .filter(s => !selectedBranch || s.branchId === selectedBranch.id)
                  .map((sty) => (
                    <button
                      key={sty.id}
                      onClick={() => {
                        setSelectedStylist(sty);
                        setStep(3);
                      }}
                      className={`p-4 border rounded-2xl flex gap-4 text-left transition-all hover:border-primary/50 hover:shadow-sm ${
                        selectedStylist?.id === sty.id ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-200'
                      }`}
                    >
                      <img src={sty.avatar} alt={sty.name} className="h-16 w-16 object-cover rounded-full" />
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900">{sty.name}</h3>
                        <p className="text-[10px] text-primary mt-1 font-semibold">{sty.specialty.join(', ')}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">⭐ {sty.rating} ({sty.reviewsCount} ulasan)</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 3: PILIH LAYANAN */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2">Pilih Menu Layanan Treatment</h2>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => handleToggleService(srv)}
                    className={`p-4 border rounded-2xl flex justify-between items-center cursor-pointer transition-all hover:border-primary/50 ${
                      selectedServices.some(s => s.id === srv.id) ? 'border-primary bg-stone-50' : 'border-zinc-200'
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.some(s => s.id === srv.id)}
                        onChange={() => {}} // handled by div click
                        className="rounded text-primary focus:ring-primary accent-primary h-4 w-4"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900">{srv.name}</h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{srv.description}</p>
                        <p className="text-[10px] text-zinc-400 font-medium mt-1">⏱️ Durasi: {srv.durationMins} Menit</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-zinc-950">{formatPrice(srv.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PILIH TANGGAL & JAM */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2">Pilih Tanggal & Jam Kedatangan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Input */}
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">Pilih Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs p-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
 
                {/* Time Slots Grid */}
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">Pilih Jam Kedatangan</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isUnavailable = unavailableSlots.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => !isUnavailable && setBookingTime(time)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            isUnavailable
                              ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed'
                              : bookingTime === time
                              ? 'bg-primary text-white border-primary shadow'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-stone-50'
                          }`}
                          disabled={isUnavailable}
                        >
                          {time}
                          {isUnavailable && <span className="block text-[8px] text-zinc-400 leading-none mt-0.5">Penuh</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
 
          {/* STEP 5: REVIEW & CHECKOUT */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2">Review & Pembayaran Deposit</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Summary */}
                <div className="bg-[#F5F1EA]/25 p-5 rounded-3xl border border-zinc-200 space-y-3.5 text-xs">
                  <h3 className="font-bold text-sm text-zinc-900">Ringkasan Reservasi</h3>
                  
                  <div className="space-y-2 text-zinc-600">
                    <p className="flex justify-between"><span>Cabang:</span><span className="font-semibold text-zinc-900">{selectedBranch?.name}</span></p>
                    <p className="flex justify-between"><span>Stylist:</span><span className="font-semibold text-zinc-900">{selectedStylist?.name}</span></p>
                    <p className="flex justify-between"><span>Jadwal:</span><span className="font-bold text-primary">{bookingDate} @ {bookingTime}</span></p>
                    <p className="flex justify-between"><span>Estimasi Durasi:</span><span className="font-semibold text-zinc-900">{totalDuration} Menit</span></p>
                  </div>
 
                  <div className="border-t border-zinc-200 pt-3 space-y-1">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-zinc-400 mb-1">Daftar Layanan</p>
                    {selectedServices.map(s => (
                      <p key={s.id} className="flex justify-between text-zinc-700">
                        <span>{s.name}</span>
                        <span>{formatPrice(s.price)}</span>
                      </p>
                    ))}
                  </div>
                </div>
 
                {/* Voucher Apply & Pricing */}
                <div className="space-y-4">
                  {/* Voucher code form */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Gunakan Voucher Diskon</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Masukkan KODE..."
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-800 focus:outline-none"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        className="bg-zinc-950 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                      >
                        Pakai
                      </button>
                    </div>
                    {voucherError && <p className="text-[10px] text-red-500 mt-1">{voucherError}</p>}
                    {appliedVoucher && (
                      <p className="text-[10px] text-emerald-600 mt-1 font-bold">
                        ✓ Voucher {appliedVoucher.code} Aktif (-{appliedVoucher.isPercentage ? `${appliedVoucher.discountAmount}%` : formatPrice(appliedVoucher.discountAmount)})
                      </p>
                    )}
                  </div>
 
                  {/* Booking Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Catatan Untuk Stylist (Opsional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: alergi zat pewarna, bawa hair extension..."
                      className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none"
                    />
                  </div>
 
                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs pt-2 border-t border-zinc-200">
                    <div className="flex justify-between"><span>Subtotal:</span><span>{formatPrice(subtotal)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-primary"><span>Diskon:</span><span>-{formatPrice(discount)}</span></div>}
                    <div className="flex justify-between text-sm font-bold text-zinc-950 pt-1.5 border-t border-zinc-200">
                      <span>Total Tagihan:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
 
                  {/* Deposit notice */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-zinc-200 flex gap-2 text-[10px] text-zinc-500 leading-relaxed items-start">
                    <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
                    <span>Perlu membayar **Deposit Booking Rp 100.000** menggunakan QRIS untuk mengonfirmasi jadwal. Sisa pembayaran diselesaikan di kasir salon.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
 
        </div>
 
        {/* Wizard Footer Navigation Controls */}
        <div className="bg-stone-50 p-5 border-t border-zinc-200 flex justify-between items-center gap-4">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-primary transition-colors ${
              step === 1 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </button>
 
          {step < 5 ? (
            <button
              onClick={() => {
                // Validation checks per step
                if (step === 1 && !selectedBranch) return alert('Mohon pilih cabang terlebih dahulu.');
                if (step === 2 && !selectedStylist) return alert('Mohon pilih stylist terlebih dahulu.');
                if (step === 3 && selectedServices.length === 0) return alert('Mohon pilih minimal satu layanan.');
                if (step === 4 && (!bookingDate || !bookingTime)) return alert('Mohon pilih tanggal dan jam kunjungan.');
                setStep(step + 1);
              }}
              className="bg-primary hover:bg-primary-hover text-white font-semibold text-xs px-6 py-2.5 rounded-full flex items-center gap-1 shadow-sm transition-all"
            >
              Lanjutkan
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleOpenPayment}
              className="bg-primary hover:bg-primary-hover text-white font-semibold text-xs px-8 py-3 rounded-full flex items-center gap-1 shadow transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Bayar Deposit & Konfirmasi
            </button>
          )}
        </div>
      </div>

      {/* Midtrans payment popup wrapper */}
      <QrisModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={100000} // deposit flat Rp 100.000
        customerName={currentUser?.name || 'Customer'}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

import { Suspense } from 'react';

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs text-zinc-500 font-medium">Memuat booking wizard...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
