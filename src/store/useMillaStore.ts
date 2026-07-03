'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BRANCHES, 
  STYLISTS, 
  SERVICES, 
  PRODUCTS, 
  VOUCHERS, 
  GIFT_CARDS, 
  BLOGS, 
  SUPPLIERS,
  Branch,
  Stylist,
  Service,
  Product,
  Voucher,
  GiftCard,
  Blog,
  Supplier
} from '../lib/mockData';

// Extended Interfaces for Database Models
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  role: 'customer' | 'receptionist' | 'cashier' | 'stylist' | 'manager' | 'admin' | 'super_admin' | 'owner';
  branchId?: string; // for staff
}

export interface CustomerProfile {
  id: string;
  userId: string;
  loyaltyPoints: number;
  membershipTier: 'silver' | 'gold' | 'platinum';
  allergies: string[];
  preferences: string;
  birthDate: string;
  notes: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName: string;
  stylistId: string;
  stylistName: string;
  serviceIds: string[];
  servicesDetails: { name: string; price: number; duration: number }[];
  date: string;
  timeSlot: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  totalPrice: number;
  depositPaid: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  branchId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  status: 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  stockCount: number;
  minStockAlert: number;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  branchId: string;
  quantityChanged: number;
  logType: 'stock_in' | 'stock_out' | 'transfer_in' | 'transfer_out';
  notes: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  branchId: string;
  orderDate: string;
  items: { productId: string; productName: string; quantity: number; costPrice: number }[];
  totalAmount: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  appointmentId: string;
  serviceId?: string;
  stylistId?: string;
  rating: number;
  comment: string;
  beforeImage?: string;
  afterImage?: string;
  createdAt: string;
}

export interface LoyaltyPointsLog {
  id: string;
  customerId: string;
  pointsChanged: number;
  description: string;
  type: 'earn' | 'redeem' | 'adjust';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'info' | 'appointment' | 'order' | 'marketing';
  createdAt: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  channel: 'whatsapp' | 'email' | 'push';
  triggerType: 'manual' | 'birthday' | 'rebooking' | 'winback';
  messageTemplate: string;
  statsSent: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface MillaState {
  // Session Auth
  currentUser: User | null;
  
  // Simulated PostgreSQL Data
  users: User[];
  customers: CustomerProfile[];
  branches: Branch[];
  stylists: Stylist[];
  services: Service[];
  products: Product[];
  vouchers: Voucher[];
  giftCards: GiftCard[];
  appointments: Appointment[];
  orders: Order[];
  inventory: InventoryItem[];
  inventoryLogs: InventoryLog[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  reviews: Review[];
  blogs: Blog[];
  notifications: Notification[];
  marketingCampaigns: MarketingCampaign[];
  auditLogs: AuditLog[];
  loyaltyPoints: LoyaltyPointsLog[];
  
  // Shopping Cart & POS Temporary State
  cart: CartItem[];
  
  // Actions
  login: (email: string, role?: string) => { success: boolean; error?: string };
  logout: () => void;
  registerCustomer: (name: string, email: string, phone: string, birthDate: string) => { success: boolean; user?: User };
  
  // Bookings CRUD
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status'], paymentStatus?: Appointment['paymentStatus']) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkoutCart: (shippingAddress: string, paymentMethod: string, voucherCode?: string) => Order;
  
  // POS Cashier Checkout
  posCheckout: (
    customerPhone: string,
    serviceIds: string[],
    productItems: { productId: string; quantity: number }[],
    paymentMethod: string,
    voucherCode?: string,
    giftCardCode?: string
  ) => { success: boolean; invoiceId?: string; total: number; receiptDetails: any };

  // Inventory Management
  adjustStock: (productId: string, branchId: string, delta: number, type: InventoryLog['logType'], notes: string) => void;
  transferStock: (productId: string, fromBranchId: string, toBranchId: string, quantity: number) => { success: boolean; message: string };
  createPurchaseOrder: (supplierId: string, branchId: string, items: { productId: string; quantity: number; costPrice: number }[]) => PurchaseOrder;
  receivePurchaseOrder: (poId: string) => void;
  
  // Admin & CRM
  updateCustomerProfile: (customerId: string, data: Partial<CustomerProfile>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addVoucher: (voucher: Omit<Voucher, 'id' | 'active'>) => void;
  updateVoucher: (id: string, voucher: Partial<Voucher>) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  
  // Campaigns & Audits
  triggerCampaignBroadcast: (campaignId: string) => void;
  addNotification: (userId: string, title: string, message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  addAuditLog: (userId: string, action: string, details: string) => void;
}

export const useMillaStore = create<MillaState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        { id: 'usr-1', email: 'owner@milla.com', name: 'Milla Sophia', phone: '08119999111', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', role: 'owner' },
        { id: 'usr-2', email: 'admin@milla.com', name: 'Admin Rina', phone: '08119999222', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', role: 'admin', branchId: 'br-1' },
        { id: 'usr-3', email: 'cashier@milla.com', name: 'Kasir Budi', phone: '08119999333', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', role: 'cashier', branchId: 'br-1' },
        { id: 'usr-4', email: 'elena@milla.com', name: 'Elena Rosewood', phone: '08119999444', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', role: 'stylist', branchId: 'br-1' },
        { id: 'usr-5', email: 'customer@milla.com', name: 'Aurelia Cantika', phone: '08123456789', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', role: 'customer' },
        { id: 'usr-6', email: 'rian@milla.com', name: 'Rian Wijaya', phone: '08119999555', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', role: 'stylist', branchId: 'br-1' },
      ],
      customers: [
        { id: 'cust-1', userId: 'usr-5', loyaltyPoints: 240, membershipTier: 'gold', allergies: ['Hydrogen Peroxide (>9%)'], preferences: 'Suka korean styling blow, minum teh melati hangat saat treatment.', birthDate: '1998-04-12', notes: 'Pelanggan setia Senopati' }
      ],
      branches: BRANCHES,
      stylists: STYLISTS,
      services: SERVICES,
      products: PRODUCTS,
      vouchers: VOUCHERS,
      giftCards: GIFT_CARDS,
      blogs: BLOGS,
      suppliers: SUPPLIERS,
      appointments: [
        {
          id: 'apt-1',
          customerId: 'cust-1',
          customerName: 'Aurelia Cantika',
          customerPhone: '08123456789',
          branchId: 'br-1',
          branchName: 'Milla Hair Studio - Senopati',
          stylistId: 'sty-1',
          stylistName: 'Elena Rosewood',
          serviceIds: ['srv-1', 'srv-3'],
          servicesDetails: [
            { name: 'Signature Milla Haircut & Blow', price: 350000, duration: 60 },
            { name: 'Premium Keratin Blowout Smooth', price: 1200000, duration: 120 }
          ],
          date: new Date().toISOString().split('T')[0],
          timeSlot: '14:00',
          status: 'approved',
          totalPrice: 1550000,
          depositPaid: 200000,
          paymentStatus: 'partial',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'apt-2',
          customerId: 'cust-1',
          customerName: 'Aurelia Cantika',
          customerPhone: '08123456789',
          branchId: 'br-1',
          branchName: 'Milla Hair Studio - Senopati',
          stylistId: 'sty-2',
          stylistName: 'Rian Wijaya',
          serviceIds: ['srv-5'],
          servicesDetails: [
            { name: 'Detoxifying Clay Scalp Ritual', price: 450000, duration: 45 }
          ],
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          timeSlot: '11:00',
          status: 'completed',
          totalPrice: 450000,
          depositPaid: 450000,
          paymentStatus: 'paid',
          createdAt: new Date(Date.now() - 259200000).toISOString()
        }
      ],
      orders: [
        {
          id: 'ord-1',
          customerId: 'cust-1',
          customerName: 'Aurelia Cantika',
          items: [
            { id: 'oi-1', productId: 'prod-1', productName: 'Milla Signature Caviar Elixir Shampoo', quantity: 1, price: 320000 },
            { id: 'oi-2', productId: 'prod-3', productName: 'Ultimate Argan Therapy Hair Serum', quantity: 1, price: 245000 }
          ],
          subtotal: 565000,
          discount: 56500,
          total: 508500,
          paymentMethod: 'Midtrans QRIS',
          paymentStatus: 'paid',
          status: 'shipped',
          shippingAddress: 'Apartemen Senopati Suites Tower 2 Lantai 15, Jakarta Selatan',
          trackingNumber: 'MLLA-78129038',
          createdAt: new Date(Date.now() - 43200000).toISOString()
        }
      ],
      inventory: [
        { id: 'inv-1', productId: 'prod-1', productName: 'Milla Signature Caviar Elixir Shampoo', branchId: 'br-1', stockCount: 20, minStockAlert: 5 },
        { id: 'inv-2', productId: 'prod-2', productName: 'Milla Keratin Active Hydrating Conditioner', branchId: 'br-1', stockCount: 15, minStockAlert: 5 },
        { id: 'inv-3', productId: 'prod-3', productName: 'Ultimate Argan Therapy Hair Serum', branchId: 'br-1', stockCount: 8, minStockAlert: 5 },
        { id: 'inv-4', productId: 'prod-4', productName: 'Rosemary & Ginseng Hair Tonic', branchId: 'br-1', stockCount: 2, minStockAlert: 5 }, // triggers alert
        { id: 'inv-5', productId: 'prod-5', productName: 'Luxe Restructuring Jasmine Hair Mask', branchId: 'br-1', stockCount: 10, minStockAlert: 5 },
        { id: 'inv-6', productId: 'prod-1', productName: 'Milla Signature Caviar Elixir Shampoo', branchId: 'br-2', stockCount: 12, minStockAlert: 5 },
        { id: 'inv-7', productId: 'prod-3', productName: 'Ultimate Argan Therapy Hair Serum', branchId: 'br-2', stockCount: 10, minStockAlert: 5 }
      ],
      inventoryLogs: [],
      purchaseOrders: [],
      loyaltyPoints: [
        {
          id: 'lp-1',
          customerId: 'cust-1',
          pointsChanged: 240,
          description: 'Welcome Bonus & treatment points',
          type: 'earn',
          createdAt: new Date().toISOString()
        }
      ],
      reviews: [
        {
          id: 'rev-1',
          customerId: 'cust-1',
          customerName: 'Aurelia Cantika',
          appointmentId: 'apt-2',
          stylistId: 'sty-2',
          serviceId: 'srv-5',
          rating: 5,
          comment: 'Treatment detoks kulit kepalanya segar sekali! Pijatannya Rian juga juara, hilangkan pusing seharian.',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ],
      notifications: [
        { id: 'nt-1', userId: 'usr-5', title: 'Booking Dikonfirmasi', message: 'Booking Anda pada tanggal hari ini pukul 14:00 telah disetujui oleh Elena Rosewood.', isRead: false, type: 'appointment', createdAt: new Date().toISOString() },
        { id: 'nt-2', userId: 'usr-1', title: 'Stok Menipis Alert', message: 'Stok produk "Rosemary & Ginseng Hair Tonic" di cabang Senopati tersisa 2 botol. Harap ajukan transfer stock atau PO.', isRead: false, type: 'info', createdAt: new Date().toISOString() }
      ],
      marketingCampaigns: [
        { id: 'camp-1', name: 'Spesial Ulang Tahun', description: 'Kirim diskon otomatis 15% pada hari ulang tahun customer', channel: 'whatsapp', triggerType: 'birthday', messageTemplate: 'Hai {name}, Milla Hair Studio mengucapkan selamat ulang tahun! Nikmati diskon spesial 15% untuk semua treatment menggunakan kode: MILLABDAY15. Valid s/d akhir bulan ini.', statsSent: 124, createdAt: '2026-01-10T00:00:00Z' },
        { id: 'camp-2', name: 'Win-Back Customer Pasif', description: 'Target customer yang tidak berkunjung > 60 hari', channel: 'whatsapp', triggerType: 'winback', messageTemplate: 'Hai {name}, kami merindukan Anda di Milla Hair Studio! Dapatkan promo cuci potong creambath spesial hanya Rp 250.000 (Harga normal Rp 550.000) dengan membalas pesan ini atau pesan di web menggunakan kode: MISSYOUMILLA.', statsSent: 86, createdAt: '2026-02-15T00:00:00Z' }
      ],
      auditLogs: [
        { id: 'al-1', userId: 'usr-2', userName: 'Admin Rina', action: 'Update Stock', details: 'Menyesuaikan manual stok Milla Signature Caviar Elixir Shampoo di Cabang Senopati (+5 botol)', createdAt: new Date(Date.now() - 3600000).toISOString() }
      ],
      cart: [],

      // Authentication Actions
      login: (email, role) => {
        const users = get().users;
        const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role));
        if (matched) {
          set({ currentUser: matched });
          get().addAuditLog(matched.id, 'User Login', `Berhasil masuk sebagai ${matched.role}`);
          return { success: true };
        }
        // Fallback auto-create customer to make things super smooth for user testing
        if (email.includes('@') && (!role || role === 'customer')) {
          const newUserId = 'usr-' + Date.now();
          const newUser: User = {
            id: newUserId,
            email: email,
            name: email.split('@')[0].toUpperCase(),
            phone: '0812' + Math.floor(1000000 + Math.random() * 9000000),
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            role: 'customer'
          };
          
          const newProfile: CustomerProfile = {
            id: 'cust-' + Date.now(),
            userId: newUserId,
            loyaltyPoints: 50,
            membershipTier: 'silver',
            allergies: [],
            preferences: 'Belum ada catatan preferensi.',
            birthDate: '1995-01-01',
            notes: 'Pendaftaran otomatis demo'
          };

          set(state => ({
            users: [...state.users, newUser],
            customers: [...state.customers, newProfile],
            currentUser: newUser
          }));
          
          return { success: true };
        }
        return { success: false, error: 'Email tidak terdaftar.' };
      },

      logout: () => {
        const current = get().currentUser;
        if (current) {
          get().addAuditLog(current.id, 'User Logout', 'User log out dari sesi aplikasi.');
        }
        set({ currentUser: null, cart: [] });
      },

      registerCustomer: (name, email, phone, birthDate) => {
        const users = get().users;
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false };
        }

        const newUserId = 'usr-' + Date.now();
        const newUser: User = {
          id: newUserId,
          email,
          name,
          phone,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          role: 'customer'
        };

        const newProfile: CustomerProfile = {
          id: 'cust-' + Date.now(),
          userId: newUserId,
          loyaltyPoints: 100, // welcome bonus points
          membershipTier: 'silver',
          allergies: [],
          preferences: '',
          birthDate,
          notes: 'Customer baru via pendaftaran online.'
        };

        set(state => ({
          users: [...state.users, newUser],
          customers: [...state.customers, newProfile]
        }));

        get().addAuditLog(newUserId, 'Customer Register', `Mendaftarkan akun baru: ${email}`);
        return { success: true, user: newUser };
      },

      // Bookings Action
      addAppointment: (aptData) => {
        const newId = 'apt-' + Date.now();
        
        // Find customer loyalty/membership context
        const customers = get().customers;
        const profile = customers.find(c => c.id === aptData.customerId);
        
        const newApt: Appointment = {
          ...aptData,
          id: newId,
          status: 'pending',
          paymentStatus: aptData.depositPaid >= aptData.totalPrice ? 'paid' : aptData.depositPaid > 0 ? 'partial' : 'pending',
          createdAt: new Date().toISOString()
        };

        set(state => ({
          appointments: [newApt, ...state.appointments]
        }));

        // Notify admins/owners
        get().users.forEach(u => {
          if (u.role === 'admin' || u.role === 'owner') {
            get().addNotification(u.id, 'Booking Baru Masuk', `Booking baru oleh ${aptData.customerName} di cabang ${aptData.branchName} tanggal ${aptData.date}.`, 'appointment');
          }
        });

        // Notify customer
        const user = get().users.find(u => u.id === profile?.userId);
        if (user) {
          get().addNotification(user.id, 'Booking Terkirim', `Booking Anda di ${aptData.branchName} telah terkirim dan sedang menunggu verifikasi.`, 'appointment');
        }

        get().addAuditLog(get().currentUser?.id || 'system', 'Create Appointment', `Booking baru dibuat: ${newId} senilai Rp ${aptData.totalPrice}`);
        return newApt;
      },

      updateAppointmentStatus: (id, status, paymentStatus) => {
        set(state => ({
          appointments: state.appointments.map(apt => {
            if (apt.id === id) {
              const updatedApt = { 
                ...apt, 
                status, 
                paymentStatus: paymentStatus || apt.paymentStatus 
              };

              // Side effect: If status changed to completed, process loyalty points & billing metrics
              if (status === 'completed' && apt.status !== 'completed') {
                setTimeout(() => {
                  const cust = get().customers.find(c => c.id === apt.customerId);
                  if (cust) {
                    const multiplier = cust.membershipTier === 'platinum' ? 2.00 : cust.membershipTier === 'gold' ? 1.50 : 1.00;
                    const pointsGained = Math.floor((apt.totalPrice / 10000) * multiplier);

                    // Add loyalty balance
                    set(s => ({
                      customers: s.customers.map(c => c.id === cust.id ? { ...c, loyaltyPoints: c.loyaltyPoints + pointsGained } : c),
                      loyaltyPoints: [
                        ...s.loyaltyPoints,
                        {
                          id: 'lp-' + Date.now(),
                          customerId: cust.id,
                          pointsChanged: pointsGained,
                          description: `Selesai Treatment Booking ${id}`,
                          type: 'earn',
                          createdAt: new Date().toISOString()
                        }
                      ]
                    }));

                    // Send notification to customer
                    const user = get().users.find(u => u.id === cust.userId);
                    if (user) {
                      get().addNotification(
                        user.id,
                        'Treatment Selesai! 🎉',
                        `Terima kasih telah berkunjung. Anda mendapatkan ${pointsGained} Loyalty Points dari kunjungan ini.`,
                        'appointment'
                      );
                    }
                  }
                }, 50);
              }
              return updatedApt;
            }
            return apt;
          })
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Update Appointment Status', `Booking ${id} diubah status menjadi ${status}`);
      },

      rescheduleAppointment: (id, newDate, newTime) => {
        set(state => ({
          appointments: state.appointments.map(apt => {
            if (apt.id === id) {
              const user = get().users.find(u => u.id === get().customers.find(c => c.id === apt.customerId)?.userId);
              if (user) {
                get().addNotification(
                  user.id,
                  'Reschedule Sukses',
                  `Jadwal booking ${apt.id} Anda telah berhasil dipindahkan ke tanggal ${newDate} jam ${newTime}.`,
                  'appointment'
                );
              }
              return {
                ...apt,
                date: newDate,
                timeSlot: newTime,
                status: 'pending' // reset to pending for confirmation
              };
            }
            return apt;
          })
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Reschedule Appointment', `Booking ${id} dijadwalkan ulang ke ${newDate} ${newTime}`);
      },

      // Cart Actions
      addToCart: (product, quantity) => {
        set(state => {
          const existing = state.cart.find(item => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item
              )
            };
          }
          return { cart: [...state.cart, { product, quantity }] };
        });
      },

      removeFromCart: (productId) => {
        set(state => ({
          cart: state.cart.filter(item => item.product.id !== productId)
        }));
      },

      updateCartQuantity: (productId, quantity) => {
        set(state => ({
          cart: state.cart.map(item => 
            item.product.id === productId 
              ? { ...item, quantity: Math.max(1, quantity) } 
              : item
          )
        }));
      },

      clearCart: () => set({ cart: [] }),

      checkoutCart: (shippingAddress, paymentMethod, voucherCode) => {
        const cart = get().cart;
        const current = get().currentUser;
        const customers = get().customers;
        const customerProfile = customers.find(c => c.userId === current?.id);

        if (cart.length === 0 || !customerProfile) {
          throw new Error('Keranjang belanja kosong atau customer tidak valid.');
        }

        let subtotal = 0;
        const orderItems: OrderItem[] = cart.map((item, index) => {
          subtotal += item.product.price * item.quantity;
          return {
            id: `oi-${Date.now()}-${index}`,
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price
          };
        });

        // Process voucher discount
        let discount = 0;
        if (voucherCode) {
          const voucher = get().vouchers.find(v => v.code === voucherCode && v.active);
          if (voucher && subtotal >= voucher.minPurchase) {
            discount = voucher.isPercentage 
              ? (subtotal * voucher.discountAmount) / 100 
              : voucher.discountAmount;
          }
        }

        const total = Math.max(0, subtotal - discount);
        const orderId = 'ord-' + Date.now();

        const newOrder: Order = {
          id: orderId,
          customerId: customerProfile.id,
          customerName: current?.name || 'Customer',
          items: orderItems,
          subtotal,
          discount,
          total,
          paymentMethod,
          paymentStatus: 'paid', // Simulator auto-approves
          status: 'processing',
          shippingAddress,
          trackingNumber: 'MLLA-' + Math.floor(10000000 + Math.random() * 90000000),
          createdAt: new Date().toISOString()
        };

        // Deduct inventory product stock and log
        cart.forEach(item => {
          get().adjustStock(
            item.product.id,
            'br-1', // Default branch for web purchases
            -item.quantity,
            'stock_out',
            `E-commerce checkout order ${orderId}`
          );
        });

        set(state => ({
          orders: [newOrder, ...state.orders],
          cart: [] // Clear cart
        }));

        get().addNotification(
          current?.id || '',
          'Pesanan Berhasil dibuat 🛍️',
          `Pesanan produk Anda senilai Rp ${total.toLocaleString()} sedang diproses.`,
          'order'
        );

        get().addAuditLog(current?.id || 'system', 'E-commerce Checkout', `Membuat order baru ${orderId} senilai Rp ${total}`);
        return newOrder;
      },

      // POS Cashier Checkout
      posCheckout: (customerPhone, serviceIds, productItems, paymentMethod, voucherCode, giftCardCode) => {
        const users = get().users;
        const customers = get().customers;
        const services = get().services;
        const products = get().products;
        const vouchers = get().vouchers;
        const giftCards = get().giftCards;
        const cashier = get().currentUser;

        // Find customer profile by phone number (if registered, otherwise register on-the-fly)
        let customer = customers.find(c => {
          const u = users.find(usr => usr.id === c.userId);
          return u?.phone === customerPhone;
        });

        let customerName = 'Walk-in Guest';
        let customerId = 'walkin';
        let loyaltyBalance = 0;
        let discountRate = 0;

        if (customer) {
          const u = users.find(usr => usr.id === customer?.userId);
          customerName = u?.name || 'Walk-in Guest';
          customerId = customer.id;
          loyaltyBalance = customer.loyaltyPoints;
          discountRate = customer.membershipTier === 'platinum' ? 0.15 : customer.membershipTier === 'gold' ? 0.10 : 0.05;
        }

        // Subtotal calculation
        let subtotal = 0;
        const serviceItemsDetails = serviceIds.map(sid => {
          const s = services.find(srv => srv.id === sid);
          if (s) {
            subtotal += s.price;
            return { name: s.name, price: s.price, duration: s.durationMins };
          }
          return null;
        }).filter(Boolean) as any[];

        const orderItems: OrderItem[] = productItems.map((pi, idx) => {
          const p = products.find(prod => prod.id === pi.productId);
          if (p) {
            subtotal += p.price * pi.quantity;
            return {
              id: `poi-${Date.now()}-${idx}`,
              productId: p.id,
              productName: p.name,
              quantity: pi.quantity,
              price: p.price
            };
          }
          return null;
        }).filter(Boolean) as OrderItem[];

        // Apply discount: membership discount
        let membershipDiscount = subtotal * discountRate;
        let runningTotal = subtotal - membershipDiscount;

        // Apply discount: voucher discount
        let voucherDiscount = 0;
        if (voucherCode) {
          const voucher = vouchers.find(v => v.code === voucherCode && v.active);
          if (voucher && subtotal >= voucher.minPurchase) {
            voucherDiscount = voucher.isPercentage
              ? (runningTotal * voucher.discountAmount) / 100
              : voucher.discountAmount;
          }
        }
        runningTotal = Math.max(0, runningTotal - voucherDiscount);

        // Apply discount: gift card discount
        let giftCardDiscount = 0;
        if (giftCardCode) {
          const gc = giftCards.find(g => g.code === giftCardCode && g.active);
          if (gc) {
            giftCardDiscount = Math.min(runningTotal, gc.balance);
            set(state => ({
              giftCards: state.giftCards.map(g => 
                g.code === giftCardCode 
                  ? { ...g, balance: g.balance - giftCardDiscount, active: (g.balance - giftCardDiscount) > 0 } 
                  : g
              )
            }));
          }
        }
        runningTotal = Math.max(0, runningTotal - giftCardDiscount);

        const invoiceId = 'INV-' + Date.now().toString().slice(-6);

        // Deduct inventory items
        productItems.forEach(pi => {
          get().adjustStock(
            pi.productId,
            cashier?.branchId || 'br-1',
            -pi.quantity,
            'stock_out',
            `POS checkout invoice ${invoiceId}`
          );
        });

        // Earn loyalty points if customer is registered
        if (customerId !== 'walkin' && customer) {
          const pointsEarned = Math.floor(runningTotal / 10000);
          set(state => ({
            customers: state.customers.map(c => 
              c.id === customerId 
                ? { ...c, loyaltyPoints: c.loyaltyPoints + pointsEarned } 
                : c
            ),
            loyaltyPoints: [
              ...state.loyaltyPoints,
              {
                id: 'lp-' + Date.now(),
                customerId,
                pointsChanged: pointsEarned,
                description: `POS purchase ${invoiceId}`,
                type: 'earn',
                createdAt: new Date().toISOString()
              }
            ]
          }));
        }

        const receiptDetails = {
          invoiceId,
          cashierName: cashier?.name || 'Kasir',
          customerName,
          subtotal,
          membershipDiscount,
          voucherDiscount,
          giftCardDiscount,
          total: runningTotal,
          paymentMethod,
          date: new Date().toLocaleString('id-ID'),
          services: serviceItemsDetails,
          products: orderItems
        };

        // Save appointment/record if service-only checkout
        if (serviceIds.length > 0 && customerId !== 'walkin') {
          const newApt: Appointment = {
            id: 'apt-' + Date.now(),
            customerId,
            customerName,
            customerPhone,
            branchId: cashier?.branchId || 'br-1',
            branchName: get().branches.find(b => b.id === (cashier?.branchId || 'br-1'))?.name || 'Milla Studio',
            stylistId: 'sty-1', // Default assigned
            stylistName: 'Elena Rosewood',
            serviceIds,
            servicesDetails: serviceItemsDetails,
            date: new Date().toISOString().split('T')[0],
            timeSlot: new Date().toTimeString().slice(0, 5),
            status: 'completed',
            totalPrice: runningTotal,
            depositPaid: runningTotal,
            paymentStatus: 'paid',
            paymentMethod,
            createdAt: new Date().toISOString()
          };

          set(state => ({
            appointments: [newApt, ...state.appointments]
          }));
        }

        get().addAuditLog(cashier?.id || 'system', 'POS Transaction', `Membuat invoice POS ${invoiceId} sebesar Rp ${runningTotal}`);

        return {
          success: true,
          invoiceId,
          total: runningTotal,
          receiptDetails
        };
      },

      // Stock Controls
      adjustStock: (productId, branchId, delta, type, notes) => {
        const products = get().products;
        const prod = products.find(p => p.id === productId);
        const prodName = prod?.name || 'Unknown Product';

        set(state => {
          const inventory = state.inventory;
          const matched = inventory.find(inv => inv.productId === productId && inv.branchId === branchId);

          let updatedInventory = [];
          if (matched) {
            updatedInventory = inventory.map(inv => 
              inv.productId === productId && inv.branchId === branchId
                ? { ...inv, stockCount: Math.max(0, inv.stockCount + delta) }
                : inv
            );
          } else {
            updatedInventory = [
              ...inventory,
              {
                id: 'inv-' + Date.now(),
                productId,
                productName: prodName,
                branchId,
                stockCount: Math.max(0, delta),
                minStockAlert: 5
              }
            ];
          }

          // Add to log
          const newLog: InventoryLog = {
            id: 'log-' + Date.now(),
            productId,
            productName: prodName,
            branchId,
            quantityChanged: delta,
            logType: type,
            notes,
            createdAt: new Date().toISOString()
          };

          // Update root product stock sum count
          const updatedProducts = state.products.map(p => {
            if (p.id === productId) {
              const currentStock = p.stock + delta;
              
              // Trigger low stock warning triggers
              if (currentStock < 5) {
                setTimeout(() => {
                  get().addNotification(
                    'usr-1', // Notify Owner
                    'Stok Menipis! ⚠️',
                    `Stok produk "${p.name}" tersisa ${currentStock} botol. Segera restock!`,
                    'info'
                  );
                }, 100);
              }
              return { ...p, stock: Math.max(0, currentStock) };
            }
            return p;
          });

          return {
            inventory: updatedInventory,
            inventoryLogs: [newLog, ...state.inventoryLogs],
            products: updatedProducts
          };
        });
      },

      transferStock: (productId, fromBranchId, toBranchId, quantity) => {
        const inventory = get().inventory;
        const matchedSource = inventory.find(inv => inv.productId === productId && inv.branchId === fromBranchId);

        if (!matchedSource || matchedSource.stockCount < quantity) {
          return { success: false, message: 'Stok cabang asal tidak mencukupi untuk transfer.' };
        }

        const prod = get().products.find(p => p.id === productId);
        const name = prod?.name || '';

        // Deduct from source branch
        get().adjustStock(productId, fromBranchId, -quantity, 'transfer_out', `Transfer stock ke cabang ${toBranchId}`);
        // Add to destination branch
        get().adjustStock(productId, toBranchId, quantity, 'transfer_in', `Menerima stock dari cabang ${fromBranchId}`);

        get().addAuditLog(get().currentUser?.id || 'system', 'Transfer Stock', `Transfer ${quantity} pcs produk "${name}" dari branch ${fromBranchId} ke ${toBranchId}`);

        return { success: true, message: 'Transfer stok berhasil diproses!' };
      },

      createPurchaseOrder: (supplierId, branchId, items) => {
        const suppliers = get().suppliers;
        const products = get().products;
        const sup = suppliers.find(s => s.id === supplierId);
        
        let total = 0;
        const poItems = items.map(it => {
          const p = products.find(prod => prod.id === it.productId);
          total += it.costPrice * it.quantity;
          return {
            productId: it.productId,
            productName: p?.name || 'Product',
            quantity: it.quantity,
            costPrice: it.costPrice
          };
        });

        const newPo: PurchaseOrder = {
          id: 'po-' + Date.now().toString().slice(-5),
          supplierId,
          supplierName: sup?.name || 'Supplier',
          branchId,
          orderDate: new Date().toISOString().split('T')[0],
          items: poItems,
          totalAmount: total,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        set(state => ({
          purchaseOrders: [newPo, ...state.purchaseOrders]
        }));

        get().addAuditLog(get().currentUser?.id || 'system', 'Create Purchase Order', `Membuat PO baru ${newPo.id} senilai Rp ${total}`);
        return newPo;
      },

      receivePurchaseOrder: (poId) => {
        set(state => ({
          purchaseOrders: state.purchaseOrders.map(po => {
            if (po.id === poId) {
              // Add stocks to the branch
              po.items.forEach(it => {
                get().adjustStock(
                  it.productId,
                  po.branchId,
                  it.quantity,
                  'stock_in',
                  `Received PO ${poId}`
                );
              });
              return { ...po, status: 'received' as const };
            }
            return po;
          })
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Receive PO', `Menerima kiriman barang PO ${poId}`);
      },

      // CRM customer details edits
      updateCustomerProfile: (customerId, data) => {
        set(state => ({
          customers: state.customers.map(c => c.id === customerId ? { ...c, ...data } : c)
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Update Customer CRM Profile', `Mengedit preferensi / alergi customer ${customerId}`);
      },

      // Services CRUD
      addService: (service) => {
        const newService: Service = {
          ...service,
          id: 'srv-' + Date.now()
        };
        set(state => ({
          services: [...state.services, newService]
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Add Service', `Menambahkan layanan baru: ${service.name}`);
      },

      updateService: (id, service) => {
        set(state => ({
          services: state.services.map(s => s.id === id ? { ...s, ...service } : s)
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Update Service', `Mengupdate data layanan: ${id}`);
      },

      deleteService: (id) => {
        set(state => ({
          services: state.services.filter(s => s.id !== id)
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Delete Service', `Menghapus layanan: ${id}`);
      },

      // Products CRUD
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: 'prod-' + Date.now(),
          rating: 5.0,
          reviewsCount: 0
        };
        set(state => ({
          products: [...state.products, newProduct]
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Add Product', `Menambahkan produk baru: ${product.name}`);
      },

      updateProduct: (id, product) => {
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Update Product', `Mengupdate data produk: ${id}`);
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Delete Product', `Menghapus produk: ${id}`);
      },

      // Vouchers CRUD
      addVoucher: (voucher) => {
        const newVoucher: Voucher = {
          ...voucher,
          id: 'v-' + Date.now(),
          active: true
        };
        set(state => ({
          vouchers: [...state.vouchers, newVoucher]
        }));
        get().addAuditLog(get().currentUser?.id || 'system', 'Add Voucher', `Membuat voucher baru: ${voucher.code}`);
      },

      updateVoucher: (id, voucher) => {
        set(state => ({
          vouchers: state.vouchers.map(v => v.id === id ? { ...v, ...voucher } : v)
        }));
      },

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: 'rev-' + Date.now(),
          createdAt: new Date().toISOString()
        };
        set(state => ({
          reviews: [newReview, ...state.reviews]
        }));
        get().addAuditLog(reviewData.customerId, 'Add Treatment Review', `Memberikan rating ${reviewData.rating} untuk stylist/layanan`);
      },

      // Marketing Campaign trigger simulator
      triggerCampaignBroadcast: (campaignId) => {
        const campaigns = get().marketingCampaigns;
        const camp = campaigns.find(c => c.id === campaignId);
        if (!camp) return;

        // Simulate broadcast count additions
        set(state => ({
          marketingCampaigns: state.marketingCampaigns.map(c => 
            c.id === campaignId ? { ...c, statsSent: c.statsSent + Math.floor(10 + Math.random() * 40) } : c
          )
        }));

        get().addAuditLog(get().currentUser?.id || 'system', 'Trigger Campaign Broadcast', `Mengirim broadcast campaign "${camp.name}" melalui channel ${camp.channel}`);
      },

      addNotification: (userId, title, message, type) => {
        const newNotif: Notification = {
          id: 'nt-' + Date.now() + Math.random().toString().slice(-4),
          userId,
          title,
          message,
          isRead: false,
          type,
          createdAt: new Date().toISOString()
        };
        set(state => ({
          notifications: [newNotif, ...state.notifications]
        }));
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
        }));
      },

      addAuditLog: (userId, action, details) => {
        const users = get().users;
        const user = users.find(u => u.id === userId);
        const name = user ? user.name : 'System';

        const log: AuditLog = {
          id: 'al-' + Date.now() + Math.random().toString().slice(-3),
          userId,
          userName: name,
          action,
          details,
          createdAt: new Date().toISOString()
        };

        set(state => ({
          auditLogs: [log, ...state.auditLogs]
        }));
      }
    }),
    {
      name: 'milla_salon_storage',
      partialize: (state) => ({
        users: state.users,
        customers: state.customers,
        appointments: state.appointments,
        orders: state.orders,
        inventory: state.inventory,
        inventoryLogs: state.inventoryLogs,
        purchaseOrders: state.purchaseOrders,
        reviews: state.reviews,
        vouchers: state.vouchers,
        giftCards: state.giftCards,
        notifications: state.notifications,
        marketingCampaigns: state.marketingCampaigns,
        auditLogs: state.auditLogs,
        loyaltyPoints: state.loyaltyPoints
      })
    }
  )
);
