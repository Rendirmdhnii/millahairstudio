'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Trash2, Plus, Minus, Ticket, MapPin, 
  CreditCard, CheckCircle2, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useMillaStore } from '@/store/useMillaStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const [address, setAddress] = useState('Apartemen Senopati Suites Tower 2 Lantai 15, Jakarta Selatan');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [checkedOutOrder, setCheckedOutOrder] = useState<any | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'success'>('cart');

  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    vouchers, 
    checkoutCart,
    currentUser
  } = useMillaStore();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

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

  // Calculations
  let discount = 0;
  if (appliedVoucher) {
    discount = appliedVoucher.isPercentage
      ? (subtotal * appliedVoucher.discountAmount) / 100
      : appliedVoucher.discountAmount;
  }
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = () => {
    if (!currentUser) {
      router.push('/login?redirect=cart');
      return;
    }
    if (cart.length === 0) return;

    try {
      const order = checkoutCart(address, 'Midtrans QRIS / GoPay', appliedVoucher?.code);
      setCheckedOutOrder(order);
      setCheckoutStep('success');
    } catch (e: any) {
      setVoucherError(e.message || 'Checkout gagal.');
    }
  };

  if (checkoutStep === 'success' && checkedOutOrder) {
    return (
      <div className="w-full bg-pink-50/10 py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-sans text-zinc-800">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-pink-100 shadow-xl text-center space-y-6 animate-fade-in-up">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
          
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-zinc-950">Pesanan Diterima!</h1>
            <p className="text-xs text-zinc-500">
              Terima kasih telah berbelanja. Paket produk Anda sedang kami persiapkan untuk pengiriman.
            </p>
          </div>

          <div className="bg-pink-50/30 p-4 rounded-2xl border border-pink-100/50 space-y-2 text-xs text-left">
            <div className="flex justify-between font-medium">
              <span>Order ID:</span>
              <span className="font-bold text-zinc-900">{checkedOutOrder.id}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Nomor Resi Pelacakan:</span>
              <span className="font-bold text-primary">{checkedOutOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Metode Pembayaran:</span>
              <span>{checkedOutOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between font-bold text-zinc-950 pt-2 border-t border-pink-100">
              <span>Total Bayar:</span>
              <span>{formatPrice(checkedOutOrder.total)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              href="/dashboard/customer"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition-all block text-sm"
            >
              Lacak Pesanan Di Dashboard
            </Link>
            <Link
              href="/products"
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-full transition-all block text-xs"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-pink-50/10 py-16 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-zinc-950 mb-8 flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary" />
          Keranjang Belanja Produk
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-pink-100 shadow-sm space-y-4">
            <p className="text-zinc-500 font-light">Keranjang belanja Anda kosong. Silakan tambahkan produk perawatan dari marketplace.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 bg-primary text-white font-semibold px-6 py-3 rounded-full text-xs shadow hover:scale-102 transition-all"
            >
              Kunjungi Marketplace Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Products List (Left 2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.product.id} 
                  className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm flex gap-4 items-center justify-between"
                >
                  <img src={item.product.image} alt={item.product.name} className="h-16 w-16 object-cover rounded-xl" />
                  
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-bold text-zinc-900 leading-tight">{item.product.name}</h3>
                    <p className="text-[10px] text-zinc-400 capitalize">{item.product.category}</p>
                    <p className="text-xs font-semibold text-primary">{formatPrice(item.product.price)}</p>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-full px-2.5 py-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-zinc-200 rounded-full transition-colors text-zinc-600"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-zinc-800 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-zinc-200 rounded-full transition-colors text-zinc-600"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Delete Action */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2.5 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Billing & Order checkout summary (Right 1 column) */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-5">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3">Ringkasan Belanja</h3>

              {/* Voucher Code */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Gunakan Voucher Diskon</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Masukkan KODE..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-9 pr-3 py-2 text-xs text-zinc-800 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleApplyVoucher}
                    className="bg-zinc-950 text-white font-semibold text-xs px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    Pakai
                  </button>
                </div>
                {voucherError && <p className="text-[10px] text-red-500 mt-1">{voucherError}</p>}
                {appliedVoucher && (
                  <p className="text-[10px] text-emerald-600 mt-1 font-bold">
                    Voucher {appliedVoucher.code} Aktif (-{appliedVoucher.isPercentage ? `${appliedVoucher.discountAmount}%` : formatPrice(appliedVoucher.discountAmount)})
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="space-y-1.5 pt-2 border-t border-pink-50">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Alamat Pengiriman Paket
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-800 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 pt-4 border-t border-pink-50 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal Produk:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Diskon Voucher:</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500">
                  <span>Ongkos Kirim (Flat):</span>
                  <span className="text-emerald-600 font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-dotted border-zinc-200">
                  <span>Total Tagihan:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Secure sandbox alert */}
              <div className="p-3 bg-pink-50/40 rounded-2xl border border-pink-100 flex items-start gap-2 text-[10px] text-zinc-500 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Simulasi aman: Checkout langsung memproses order e-commerce lunas dan otomatis memotong data inventori produk.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-1.5"
              >
                Bayar & Selesaikan Order
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
