'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Search, Plus, Minus, User as UserIcon, 
  Trash2, Scissors, HelpCircle, DollarSign, CreditCard, Sparkles, Check 
} from 'lucide-react';
import { useMillaStore } from '../../../store/useMillaStore';
import { formatPrice } from '../../../lib/utils';
import Receipt from '../../../components/receipt';
import QrisModal from '../../../components/qris-modal';

export default function CashierDashboard() {
  const router = useRouter();

  const { 
    currentUser, 
    services, 
    products, 
    vouchers, 
    giftCards,
    users, 
    customers, 
    posCheckout 
  } = useMillaStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'cashier' && currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // POS State
  const [customerPhone, setCustomerPhone] = useState('08123456789'); // default Aurelia phone
  const [customerInfo, setCustomerInfo] = useState<any | null>(null);

  // Cart lists: elements are IDs
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [productCart, setProductCart] = useState<{ productId: string; quantity: number }[]>([]);

  // Promo modifiers
  const [voucherCode, setVoucherCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Checkout results
  const [showQris, setShowQris] = useState(false);
  const [qrisAmount, setQrisAmount] = useState(0);
  const [printedReceipt, setPrintedReceipt] = useState<any | null>(null);

  // Search Customer on-the-fly when typing phone
  useEffect(() => {
    const matchedUser = users.find(u => u.phone === customerPhone && u.role === 'customer');
    if (matchedUser) {
      const matchedProfile = customers.find(c => c.userId === matchedUser.id);
      if (matchedProfile) {
        setCustomerInfo({
          name: matchedUser.name,
          membershipTier: matchedProfile.membershipTier,
          loyaltyPoints: matchedProfile.loyaltyPoints,
          discountRate: matchedProfile.membershipTier === 'platinum' ? 0.15 : matchedProfile.membershipTier === 'gold' ? 0.10 : 0.05
        });
        return;
      }
    }
    setCustomerInfo(null);
  }, [customerPhone, users, customers]);

  if (!currentUser) return null;

  // Add Item actions
  const handleAddService = (id: string) => {
    setSelectedServices(prev => [...prev, id]);
  };

  const handleRemoveService = (idx: number) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddProduct = (productId: string) => {
    setProductCart(prev => {
      const matched = prev.find(p => p.productId === productId);
      if (matched) {
        return prev.map(p => p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateProductQty = (productId: string, delta: number) => {
    setProductCart(prev => 
      prev.map(p => {
        if (p.productId === productId) {
          const newQty = Math.max(1, p.quantity + delta);
          return { ...p, quantity: newQty };
        }
        return p;
      })
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setProductCart(prev => prev.filter(p => p.productId !== productId));
  };

  // Pricing calculations
  const calculateBilling = () => {
    let subtotal = 0;
    
    selectedServices.forEach(sid => {
      const s = services.find(srv => srv.id === sid);
      if (s) subtotal += s.price;
    });

    productCart.forEach(pc => {
      const p = products.find(prod => prod.id === pc.productId);
      if (p) subtotal += p.price * pc.quantity;
    });

    const discountRate = customerInfo?.discountRate || 0;
    const membershipDiscount = subtotal * discountRate;
    let runningTotal = subtotal - membershipDiscount;

    let voucherDiscount = 0;
    if (voucherCode) {
      const v = vouchers.find(vou => vou.code.toUpperCase() === voucherCode.toUpperCase() && vou.active);
      if (v && subtotal >= v.minPurchase) {
        voucherDiscount = v.isPercentage ? (runningTotal * v.discountAmount) / 100 : v.discountAmount;
      }
    }
    runningTotal = Math.max(0, runningTotal - voucherDiscount);

    let giftCardDiscount = 0;
    if (giftCardCode) {
      const gc = giftCards.find(g => g.code.toUpperCase() === giftCardCode.toUpperCase() && g.active);
      if (gc) giftCardDiscount = Math.min(runningTotal, gc.balance);
    }
    runningTotal = Math.max(0, runningTotal - giftCardDiscount);

    return {
      subtotal,
      membershipDiscount,
      voucherDiscount,
      giftCardDiscount,
      total: runningTotal
    };
  };

  const bill = calculateBilling();

  const handleTriggerCheckout = () => {
    if (selectedServices.length === 0 && productCart.length === 0) {
      alert('Keranjang belanja POS kosong.');
      return;
    }

    if (paymentMethod === 'Midtrans QRIS') {
      setQrisAmount(bill.total);
      setShowQris(true);
    } else {
      processPosCheckout(paymentMethod);
    }
  };

  const processPosCheckout = (method: string) => {
    const result = posCheckout(
      customerPhone,
      selectedServices,
      productCart,
      method,
      voucherCode || undefined,
      giftCardCode || undefined
    );

    if (result.success && result.receiptDetails) {
      setPrintedReceipt(result.receiptDetails);
      // Reset POS state
      setSelectedServices([]);
      setProductCart([]);
      setVoucherCode('');
      setGiftCardCode('');
    }
  };

  return (
    <div className="w-full bg-pink-50/10 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800 flex-1">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CUSTOMER & ADDING ITEMS GRID (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SEARCH CUSTOMER HP */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Identifikasi Pelanggan (CRM Search)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Nomor Handphone Customer</label>
                <div className="relative mt-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Masukkan No HP Pelanggan..."
                    className="w-full text-xs p-3 pl-10 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none"
                  />
                </div>
              </div>

              {/* CRM Live Status card info */}
              <div className="p-4 bg-pink-50/20 border border-pink-100 rounded-2xl flex flex-col justify-center text-xs">
                {customerInfo ? (
                  <div className="space-y-1">
                    <p className="font-bold text-zinc-900 flex justify-between">
                      <span>Nama: {customerInfo.name}</span>
                      <span className="text-primary uppercase">{customerInfo.membershipTier} Member</span>
                    </p>
                    <p className="text-[10px] text-zinc-500">Loyalty Points: {customerInfo.loyaltyPoints} Poin</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Diskon Member VIP {Math.round(customerInfo.discountRate * 100)}% Terpasang</p>
                  </div>
                ) : (
                  <p className="text-zinc-400 font-light italic">
                    Customer tidak terdaftar. Billing akan diproses di bawah akun "Walk-in Guest" tanpa diskon keanggotaan.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ITEM ADDERS SELECTION MENU (SERVICES & PRODUCTS) */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              Tambah Layanan & Produk ke Kasir
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Services list */}
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">Layanan (Services)</label>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {services.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleAddService(s.id)}
                      className="w-full p-2.5 border border-zinc-100 rounded-xl hover:bg-pink-50/20 text-left flex justify-between items-center text-xs transition-colors"
                    >
                      <span className="font-semibold text-zinc-850 max-w-[70%]">{s.name}</span>
                      <span className="font-bold text-zinc-900">{formatPrice(s.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Products list */}
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">Produk (Retails)</label>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAddProduct(p.id)}
                      className="w-full p-2.5 border border-zinc-100 rounded-xl hover:bg-pink-50/20 text-left flex justify-between items-center text-xs transition-colors"
                      disabled={p.stock <= 0}
                    >
                      <span className="font-semibold text-zinc-850 max-w-[70%]">{p.name} {p.stock < 5 ? `(Stok ${p.stock})` : ''}</span>
                      <span className="font-bold text-zinc-900">{formatPrice(p.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: POS BILL CART SUMMARY & PRINTER (1 column) */}
        <div className="space-y-6">
          
          {/* ACTIVE POS CART */}
          <div className="bg-zinc-950 text-white rounded-3xl p-6 shadow-xl space-y-4 border border-zinc-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-zinc-800 pb-3">Keranjang Aktif POS</h3>
            
            {/* Cart Elements */}
            <div className="space-y-3.5 max-h-[200px] overflow-y-auto pr-1 text-xs">
              {selectedServices.length === 0 && productCart.length === 0 ? (
                <p className="text-zinc-500 py-6 text-center italic">Belum ada item ditambahkan.</p>
              ) : (
                <>
                  {/* Selected Services list details */}
                  {selectedServices.map((sid, index) => {
                    const s = services.find(srv => srv.id === sid);
                    if (!s) return null;
                    return (
                      <div key={`srv-${index}`} className="flex justify-between items-center gap-2">
                        <span className="text-zinc-300 font-light truncate max-w-[65%]">{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{formatPrice(s.price)}</span>
                          <button onClick={() => handleRemoveService(index)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Selected Products list details */}
                  {productCart.map((pc, index) => {
                    const p = products.find(prod => prod.id === pc.productId);
                    if (!p) return null;
                    return (
                      <div key={`prod-${index}`} className="flex justify-between items-center gap-2">
                        <span className="text-zinc-300 font-light truncate max-w-[45%]">{p.name}</span>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <button onClick={() => handleUpdateProductQty(p.id, -1)} className="p-0.5 hover:bg-zinc-800 rounded">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-bold text-white text-[11px]">{pc.quantity}</span>
                          <button onClick={() => handleUpdateProductQty(p.id, 1)} className="p-0.5 hover:bg-zinc-800 rounded">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{formatPrice(p.price * pc.quantity)}</span>
                          <button onClick={() => handleRemoveProduct(p.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Calculations and Billing discounts */}
            <div className="border-t border-zinc-850 pt-4 space-y-2 text-xs text-zinc-400">
              {/* Promo Inputs */}
              <div className="grid grid-cols-2 gap-2 pb-2">
                <input
                  type="text"
                  placeholder="Kode Voucher..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-[10px] text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Gift Card..."
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-[10px] text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-zinc-200">{formatPrice(bill.subtotal)}</span>
              </div>
              {bill.membershipDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Diskon Member VIP:</span>
                  <span>-{formatPrice(bill.membershipDiscount)}</span>
                </div>
              )}
              {bill.voucherDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Voucher Promo:</span>
                  <span>-{formatPrice(bill.voucherDiscount)}</span>
                </div>
              )}
              {bill.giftCardDiscount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Diskon Gift Card:</span>
                  <span>-{formatPrice(bill.giftCardDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>TOTAL:</span>
                <span className="text-primary text-base">{formatPrice(bill.total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">Pilih Pembayaran</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Cash">Cash (Tunai)</option>
                <option value="Midtrans QRIS">QRIS Payment Gateway</option>
                <option value="Bank Transfer">Bank Transfer (VA)</option>
                <option value="E-Wallet">E-Wallet (GoPay/OVO)</option>
              </select>
            </div>

            <button
              onClick={handleTriggerCheckout}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-full mt-4 shadow-lg flex justify-center items-center gap-1.5 hover:shadow-primary/20 transition-all text-xs"
            >
              <CreditCard className="h-4 w-4" />
              Selesaikan Transaksi Kasir
            </button>
          </div>

          {/* PRINT VIEW OF PROCESSED RECEIPT */}
          {printedReceipt && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-[10px] text-center font-medium animate-pulse flex items-center justify-center gap-1">
                <Check className="h-4 w-4" />
                Selesai! Invoice {printedReceipt.invoiceId} berhasil tercatat dan dicetak.
              </div>
              <Receipt details={printedReceipt} />
            </div>
          )}

        </div>
      </div>

      <QrisModal
        isOpen={showQris}
        onClose={() => setShowQris(false)}
        amount={qrisAmount}
        customerName={customerInfo?.name || 'Walk-in Guest'}
        onSuccess={(method) => {
          setShowQris(false);
          processPosCheckout(method);
        }}
      />
    </div>
  );
}
