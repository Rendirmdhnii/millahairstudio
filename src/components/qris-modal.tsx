'use client';

import { useState, useEffect } from 'react';
import { QrCode, CreditCard, Landmark, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { formatPrice } from '../lib/utils';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customerName: string;
  onSuccess: (method: string) => void;
}

export default function QrisModal({
  isOpen,
  onClose,
  amount,
  customerName,
  onSuccess
}: QrisModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');
  const [step, setStep] = useState<'pay' | 'success'>('pay');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!isOpen) return;
    setStep('pay');
    setTimeLeft(300);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || step === 'success') return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isOpen, step]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSimulatePayment = () => {
    setStep('success');
    setTimeout(() => {
      onSuccess(paymentMethod === 'qris' ? 'Midtrans QRIS' : paymentMethod === 'va' ? 'Virtual Account' : 'Credit Card');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 flex flex-col">
        {/* Header */}
        <div className="bg-primary p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">Midtrans Secure Sandbox</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {step === 'pay' ? (
            <>
              {/* Order Info */}
              <div className="text-center mb-6">
                <p className="text-xs text-zinc-400">Total Tagihan Pelanggan</p>
                <h3 className="text-3xl font-bold text-zinc-950 mt-1">{formatPrice(amount)}</h3>
                <p className="text-xs text-primary font-medium mt-1">Atas Nama: {customerName}</p>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-3 gap-2 bg-stone-50 p-1 rounded-xl mb-6 border border-zinc-200">
                <button
                  onClick={() => setPaymentMethod('qris')}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all ${
                    paymentMethod === 'qris' ? 'bg-primary text-white shadow-sm' : 'text-zinc-600 hover:bg-white/40'
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  QRIS
                </button>
                <button
                  onClick={() => setPaymentMethod('va')}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all ${
                    paymentMethod === 'va' ? 'bg-primary text-white shadow-sm' : 'text-zinc-600 hover:bg-white/40'
                  }`}
                >
                  <Landmark className="h-4 w-4" />
                  Transfer VA
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all ${
                    paymentMethod === 'card' ? 'bg-primary text-white shadow-sm' : 'text-zinc-600 hover:bg-white/40'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  CC/Debit
                </button>
              </div>

              {/* Payment Details */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-zinc-200 rounded-2xl bg-stone-50 min-h-[220px]">
                {paymentMethod === 'qris' && (
                  <div className="flex flex-col items-center text-center">
                    {/* Simulated QR Code Graphic */}
                    <div className="p-3 bg-white border border-zinc-200 rounded-2xl shadow-md mb-3 flex flex-col items-center justify-center">
                      <div className="w-40 h-40 bg-zinc-950 p-2 flex flex-wrap justify-between content-between gap-1 relative">
                        {/* QR Corners */}
                        <div className="w-12 h-12 border-4 border-white bg-zinc-950" />
                        <div className="w-12 h-12 border-4 border-white bg-zinc-950" />
                        <div className="w-12 h-12 border-4 border-white bg-zinc-950" />
                        <div className="absolute inset-4 border border-dashed border-white/20 flex items-center justify-center">
                          <span className="text-[10px] text-primary font-bold tracking-widest">MILLA</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">Scan QRIS menggunakan GoPay, OVO, ShopeePay, atau Mobile Banking</p>
                    <p className="text-[10px] text-zinc-400 mt-2">
                      Sisa waktu pembayaran: <span className="text-primary font-semibold">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                    </p>
                  </div>
                )}

                {paymentMethod === 'va' && (
                  <div className="w-full space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                      <p className="text-xs text-zinc-400">Nomor Virtual Account (Mandiri)</p>
                      <h4 className="text-lg font-bold text-zinc-800 tracking-widest mt-1">89012 08123456789</h4>
                      <p className="text-[10px] text-zinc-400 mt-2">Cara Pembayaran: Salin nomor VA di atas, lalu bayar melalui M-Banking atau ATM Transfer.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                      <p className="text-xs text-zinc-400">Nomor Virtual Account (BCA)</p>
                      <h4 className="text-lg font-bold text-zinc-800 tracking-widest mt-1">3901 08123456789</h4>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="w-full space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-3">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">Nomor Kartu Kredit</label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          className="w-full text-sm font-semibold mt-1 p-2 border border-zinc-200 rounded focus:outline-none"
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">Masa Berlaku</label>
                          <input
                            type="text"
                            placeholder="12/29"
                            className="w-full text-sm font-semibold mt-1 p-2 border border-zinc-200 rounded focus:outline-none"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full text-sm font-semibold mt-1 p-2 border border-zinc-200 rounded focus:outline-none"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulation Trigger Button */}
              <button
                onClick={handleSimulatePayment}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 rounded-full mt-6 shadow transition-all"
              >
                Bayar Sekarang (Simulasi)
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce mb-4" />
              <h3 className="text-xl font-bold text-zinc-900">Pembayaran Sukses!</h3>
              <p className="text-xs text-zinc-500 mt-2 px-6">
                Midtrans gateway telah berhasil memverifikasi pembayaran Anda. Status transaksi diubah menjadi lunas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
