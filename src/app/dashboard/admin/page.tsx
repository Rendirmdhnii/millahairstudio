'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, Settings, Scissors, ShoppingBag, Gift, Truck, 
  Trash2, Edit3, Plus, Download, RefreshCw, Layers, CheckCircle2 
} from 'lucide-react';
import { useMillaStore } from '../../../store/useMillaStore';
import { formatPrice, exportToCSVMock } from '../../../lib/utils';

export default function AdminDashboard() {
  const router = useRouter();

  const { 
    currentUser, 
    services, 
    products, 
    inventory, 
    vouchers,
    suppliers,
    purchaseOrders,
    addService, 
    updateService, 
    deleteService,
    addProduct, 
    updateProduct, 
    deleteProduct,
    addVoucher,
    transferStock,
    createPurchaseOrder,
    receivePurchaseOrder,
    addAuditLog
  } = useMillaStore();

  // Redirect if not admin/owner
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'owner')) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Tab views: 'services' | 'products' | 'inventory' | 'vouchers'
  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'inventory' | 'vouchers'>('services');

  // Form states - Service
  const [showSrvModal, setShowSrvModal] = useState(false);
  const [srvName, setSrvName] = useState('');
  const [srvPrice, setSrvPrice] = useState(150000);
  const [srvDuration, setSrvDuration] = useState(60);
  const [srvCategory, setSrvCategory] = useState<'haircut'|'styling'|'coloring'|'treatment'>('haircut');
  const [srvDesc, setSrvDesc] = useState('');

  // Form states - Product
  const [showProdModal, setShowProdModal] = useState(false);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState(250000);
  const [pStock, setPStock] = useState(10);
  const [pCategory, setPCategory] = useState<'shampoo'|'conditioner'|'vitamin'|'mask'>('shampoo');
  const [pDesc, setPDesc] = useState('');

  // Form states - Stock Transfer
  const [tfProduct, setTfProduct] = useState('');
  const [tfFromBranch, setTfFromBranch] = useState('br-1');
  const [tfToBranch, setTfToBranch] = useState('br-2');
  const [tfQty, setTfQty] = useState(5);
  const [tfMsg, setTfMsg] = useState<string | null>(null);

  // Form states - PO
  const [poSupplier, setPoSupplier] = useState('');
  const [poBranch, setPoBranch] = useState('br-1');
  const [poProduct, setPoProduct] = useState('');
  const [poQty, setPoQty] = useState(10);
  const [poCost, setPoCost] = useState(120000);
  const [poSuccess, setPoSuccess] = useState(false);

  // Form states - Voucher
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [vCode, setVCode] = useState('');
  const [vAmount, setVAmount] = useState(50000);
  const [vMin, setVMin] = useState(150000);
  const [vDesc, setVDesc] = useState('');

  if (!currentUser) return null;

  // CSV Exports
  const handleExportServices = () => {
    const headers = ['ID', 'Nama Layanan', 'Kategori', 'Durasi (Menit)', 'Harga'];
    const rows = services.map(s => [s.id, s.name, s.category, s.durationMins, s.price]);
    exportToCSVMock(headers, rows, 'Layanan_Milla_Studio');
    addAuditLog(currentUser.id, 'Export Services CSV', 'Mengekspor daftar seluruh layanan ke CSV');
  };

  const handleExportProducts = () => {
    const headers = ['ID', 'Nama Produk', 'Kategori', 'Harga', 'Stok Total'];
    const rows = products.map(p => [p.id, p.name, p.category, p.price, p.stock]);
    exportToCSVMock(headers, rows, 'Produk_Milla_Studio');
    addAuditLog(currentUser.id, 'Export Products CSV', 'Mengekspor daftar e-commerce produk ke CSV');
  };

  // Submit operations
  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      name: srvName,
      price: srvPrice,
      durationMins: srvDuration,
      category: srvCategory,
      description: srvDesc,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400'
    });
    setShowSrvModal(false);
    // Reset
    setSrvName('');
    setSrvPrice(150000);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: pName,
      price: pPrice,
      stock: pStock,
      category: pCategory,
      description: pDesc,
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=400'
    });
    setShowProdModal(false);
    // Reset
    setPName('');
    setPPrice(250000);
  };

  const handleExecuteTransfer = () => {
    if (!tfProduct) return alert('Pilih produk terlebih dahulu.');
    if (tfFromBranch === tfToBranch) return alert('Cabang asal dan tujuan tidak boleh sama.');
    
    const res = transferStock(tfProduct, tfFromBranch, tfToBranch, tfQty);
    setTfMsg(res.message);
    setTimeout(() => setTfMsg(null), 4000);
  };

  const handleCreatePO = () => {
    if (!poSupplier || !poProduct) return alert('Pilih supplier dan produk.');
    const p = products.find(prod => prod.id === poProduct);
    if (!p) return;

    createPurchaseOrder(poSupplier, poBranch, [
      { productId: poProduct, quantity: poQty, costPrice: poCost }
    ]);
    
    setPoSuccess(true);
    setTimeout(() => setPoSuccess(false), 3000);
  };

  const handleSubmitVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    addVoucher({
      code: vCode.toUpperCase(),
      discountAmount: vAmount,
      isPercentage: false,
      minPurchase: vMin,
      expiryDate: '2026-12-31',
      description: vDesc
    });
    setShowVoucherModal(false);
    setVCode('');
  };

  return (
    <div className="w-full bg-pink-50/10 py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800 flex-1">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-950 flex items-center gap-2">
              <Settings className="h-7 w-7 text-primary" />
              Admin Console Panel
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Mengelola layanan menu, katalog produk, inventori cabang, PO supplier, dan voucher promosi.</p>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExportServices}
              className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Download className="h-4 w-4" />
              Export Layanan (CSV)
            </button>
            <button
              onClick={handleExportProducts}
              className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Download className="h-4 w-4" />
              Export Produk (CSV)
            </button>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex bg-white border border-pink-100 rounded-2xl p-1 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'services' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            Menu Layanan ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'products' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            Katalog Produk ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'inventory' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            Inventori & Transfer Stok
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors ${
              activeTab === 'vouchers' ? 'bg-primary text-white' : 'text-zinc-600 hover:bg-pink-50/50'
            }`}
          >
            Voucher Promosi ({vouchers.length})
          </button>
        </div>

        {/* TAB CONTENTS */}
        
        {/* 1. SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-pink-50 pb-3">
              <h3 className="text-base font-bold font-serif text-zinc-900 flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" />
                Daftar Layanan Salon
              </h3>
              <button
                onClick={() => setShowSrvModal(true)}
                className="bg-primary text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Tambah Layanan Baru
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-pink-100 text-zinc-400 font-bold uppercase text-[9px] tracking-wider bg-pink-50/20">
                    <th className="p-3">Nama Layanan</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Durasi</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50/50">
                  {services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-pink-50/10">
                      <td className="p-3 font-semibold text-zinc-900">{srv.name}</td>
                      <td className="p-3 text-zinc-500 capitalize">{srv.category}</td>
                      <td className="p-3 text-center font-medium">{srv.durationMins} Menit</td>
                      <td className="p-3 font-bold text-zinc-950">{formatPrice(srv.price)}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteService(srv.id)}
                          className="p-1 hover:text-red-500 text-zinc-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-pink-50 pb-3">
              <h3 className="text-base font-bold font-serif text-zinc-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Daftar E-commerce Produk
              </h3>
              <button
                onClick={() => setShowProdModal(true)}
                className="bg-primary text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Tambah Produk Baru
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-pink-100 text-zinc-400 font-bold uppercase text-[9px] tracking-wider bg-pink-50/20">
                    <th className="p-3">Nama Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Stok Gudang</th>
                    <th className="p-3">Harga Retail</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50/50">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-pink-50/10">
                      <td className="p-3 font-semibold text-zinc-900">{prod.name}</td>
                      <td className="p-3 text-zinc-500 capitalize">{prod.category}</td>
                      <td className={`p-3 text-center font-bold ${prod.stock < 5 ? 'text-red-500 animate-pulse' : 'text-zinc-700'}`}>
                        {prod.stock} Pcs
                      </td>
                      <td className="p-3 font-bold text-zinc-950">{formatPrice(prod.price)}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1 hover:text-red-500 text-zinc-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. INVENTORY TAB (STOCK TRANSFERS & SUPPLIER PO) */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
            
            {/* TRANSFER STOCK ANTAR CABANG */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                Transfer Stok Antar Cabang
              </h3>

              {tfMsg && (
                <div className="p-3 bg-pink-50 text-primary border border-pink-100 rounded-2xl text-[10px] text-center font-medium animate-pulse">
                  {tfMsg}
                </div>
              )}

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Pilih Produk</label>
                  <select
                    value={tfProduct}
                    onChange={(e) => setTfProduct(e.target.value)}
                    className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Cabang Asal (From)</label>
                    <select
                      value={tfFromBranch}
                      onChange={(e) => setTfFromBranch(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    >
                      <option value="br-1">Senopati (JKT)</option>
                      <option value="br-2">Graha Famili (SBY)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Cabang Tujuan (To)</label>
                    <select
                      value={tfToBranch}
                      onChange={(e) => setTfToBranch(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    >
                      <option value="br-2">Graha Famili (SBY)</option>
                      <option value="br-1">Senopati (JKT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Jumlah Kuantitas (Qty)</label>
                  <input
                    type="number"
                    min="1"
                    value={tfQty}
                    onChange={(e) => setTfQty(parseInt(e.target.value))}
                    className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <button
                  onClick={handleExecuteTransfer}
                  className="w-full bg-zinc-950 text-white font-semibold py-3 rounded-full hover:bg-zinc-800 transition-colors"
                >
                  Eksekusi Transfer Stok
                </button>
              </div>
            </div>

            {/* SUPPLIER PURCHASE ORDERS RESTOCK */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-zinc-900 border-b border-pink-50 pb-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Purchase Order Supplier (PO Restock)
              </h3>

              {poSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-[10px] text-center font-medium animate-pulse">
                  ✓ Purchase Order Restock baru berhasil diajukan ke supplier. Menunggu pengiriman barang.
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Pilih Supplier</label>
                    <select
                      value={poSupplier}
                      onChange={(e) => setPoSupplier(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    >
                      <option value="">-- Pilih --</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Cabang Tujuan</label>
                    <select
                      value={poBranch}
                      onChange={(e) => setPoBranch(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    >
                      <option value="br-1">Senopati (JKT)</option>
                      <option value="br-2">Graha Famili (SBY)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Pilih Produk Restok</label>
                    <select
                      value={poProduct}
                      onChange={(e) => setPoProduct(e.target.value)}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    >
                      <option value="">-- Pilih --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Qty Order</label>
                    <input
                      type="number"
                      value={poQty}
                      onChange={(e) => setPoQty(parseInt(e.target.value))}
                      className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Harga Modal Satuan (Cost Price)</label>
                  <input
                    type="number"
                    value={poCost}
                    onChange={(e) => setPoCost(parseInt(e.target.value))}
                    className="w-full mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>

                <button
                  onClick={handleCreatePO}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-full shadow transition-all"
                >
                  Ajukan Purchase Order (Restok)
                </button>
              </div>
            </div>

            {/* ACTIVE PO ORDER LOGS TABLE */}
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-3 col-span-2 text-xs">
              <h4 className="font-serif font-bold text-sm text-zinc-900 border-b border-pink-50 pb-2">Status Purchase Orders Restock</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-pink-50 text-[9px] uppercase tracking-wider font-bold text-zinc-400">
                      <th className="p-2">PO ID</th>
                      <th className="p-2">Supplier</th>
                      <th className="p-2">Item</th>
                      <th className="p-2">Total Biaya</th>
                      <th className="p-2">Status PO</th>
                      <th className="p-2 text-center">Aksi Penerimaan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-center text-zinc-400">Belum ada PO diajukan.</td></tr>
                    ) : (
                      purchaseOrders.map(po => (
                        <tr key={po.id} className="border-b border-pink-50/50">
                          <td className="p-2 font-mono font-bold">{po.id}</td>
                          <td className="p-2 text-zinc-500">{po.supplierName}</td>
                          <td className="p-2 font-medium">{po.items[0]?.productName} (x{po.items[0]?.quantity})</td>
                          <td className="p-2 font-bold">{formatPrice(po.totalAmount)}</td>
                          <td className="p-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              po.status === 'received' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {po.status}
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            {po.status === 'pending' && (
                              <button
                                onClick={() => receivePurchaseOrder(po.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] px-2.5 py-1 rounded-lg"
                              >
                                Terima Barang
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 4. VOUCHERS TAB */}
        {activeTab === 'vouchers' && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-pink-50 pb-3">
              <h3 className="text-base font-bold font-serif text-zinc-900 flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Kupon & Voucher Promosi
              </h3>
              <button
                onClick={() => setShowVoucherModal(true)}
                className="bg-primary text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Buat Kupon Voucher Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vouchers.map(v => (
                <div key={v.id} className="p-4 border border-dashed border-pink-200 rounded-3xl bg-pink-50/10 text-center relative">
                  <span className={`absolute top-3 right-3 text-[8px] font-bold px-2 py-0.5 rounded-full ${v.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-zinc-100'}`}>
                    {v.active ? 'Aktif' : 'Expired'}
                  </span>
                  <h4 className="text-base font-mono font-bold text-zinc-950 tracking-widest uppercase">{v.code}</h4>
                  <p className="text-xs text-zinc-600 font-semibold mt-1">{v.description}</p>
                  <p className="text-[9px] text-zinc-400 mt-2">Minimal Belanja: {formatPrice(v.minPurchase)} • Valid s/d {v.expiryDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL DIALOG: SERVICES CREATION FORM */}
      {showSrvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-zinc-900">Tambah Layanan Salon Baru</h3>
            <form onSubmit={handleSubmitService} className="space-y-3.5 text-left">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Nama Layanan</label>
                <input
                  type="text"
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="Contoh: Layer Cut & Styling"
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(parseInt(e.target.value))}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Harga Layanan (Rp)</label>
                  <input
                    type="number"
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(parseInt(e.target.value))}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Kategori Layanan</label>
                <select
                  value={srvCategory}
                  onChange={(e: any) => setSrvCategory(e.target.value)}
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                >
                  <option value="haircut">Potong Rambut (Haircut)</option>
                  <option value="coloring">Pewarnaan (Coloring)</option>
                  <option value="treatment">Perawatan (Treatment)</option>
                  <option value="styling">Penataan Waves (Styling)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Deskripsi Ringkas</label>
                <input
                  type="text"
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  placeholder="Deskripsi singkat pengerjaan..."
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSrvModal(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-full text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-full text-xs"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: PRODUCTS CREATION FORM */}
      {showProdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-zinc-900">Tambah Produk Retail Baru</h3>
            <form onSubmit={handleSubmitProduct} className="space-y-3.5 text-left">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Nama Produk</label>
                <input
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="Contoh: Ginseng Hair Tonic"
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Stok Awal</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(parseInt(e.target.value))}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    value={pPrice}
                    onChange={(e) => setPPrice(parseInt(e.target.value))}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Kategori Produk</label>
                <select
                  value={pCategory}
                  onChange={(e: any) => setPCategory(e.target.value)}
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                >
                  <option value="shampoo">Shampoo</option>
                  <option value="conditioner">Conditioner</option>
                  <option value="vitamin">Hair Vitamin</option>
                  <option value="mask">Hair Mask</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Deskripsi Ringkas</label>
                <input
                  type="text"
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Fungsi dan cara pemakaian..."
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProdModal(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-full text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-full text-xs"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: VOUCHERS CREATION FORM */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-fade-in-up">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-zinc-900">Buat Kupon Voucher Baru</h3>
            <form onSubmit={handleSubmitVoucher} className="space-y-3.5 text-left">
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Kode Kupon (Code)</label>
                <input
                  type="text"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  placeholder="Contoh: SUMMERGLOW"
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Besar Diskon (Rp)</label>
                  <input
                    type="number"
                    value={vAmount}
                    onChange={(e) => setVAmount(parseInt(e.target.value))}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={vMin}
                    onChange={(e) => setVMin(parseInt(e.target.value))}
                    className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Deskripsi Ringkas</label>
                <input
                  type="text"
                  value={vDesc}
                  onChange={(e) => setVDesc(e.target.value)}
                  placeholder="Keterangan potongan diskon..."
                  className="w-full text-xs mt-1 p-3 bg-zinc-50 border border-zinc-200 rounded-xl"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVoucherModal(false)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 rounded-full text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-full text-xs"
                >
                  Terbitkan Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
