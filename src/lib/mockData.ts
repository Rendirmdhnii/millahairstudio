export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  rating: number;
  image: string;
}

export interface Stylist {
  id: string;
  name: string;
  branchId: string;
  specialty: string[];
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  avatar: string;
  status: 'active' | 'inactive';
  weeklySchedule: {
    day: string; // e.g., 'Monday', 'Tuesday'
    startTime: string;
    endTime: string;
    isOff: boolean;
  }[];
}

export interface Service {
  id: string;
  name: string;
  category: 'haircut' | 'styling' | 'coloring' | 'treatment' | 'skincare' | 'nails';
  durationMins: number;
  price: number;
  image: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'shampoo' | 'conditioner' | 'tonic' | 'vitamin' | 'mask' | 'skincare' | 'styling';
  price: number;
  stock: number;
  image: string;
  description: string;
  rating: number;
  reviewsCount: number;
}

export interface Voucher {
  id: string;
  code: string;
  discountAmount: number;
  isPercentage: boolean;
  minPurchase: number;
  expiryDate: string;
  active: boolean;
  description: string;
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  expiryDate: string;
  active: boolean;
}

export interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export const BRANCHES: Branch[] = [
  {
    id: 'br-1',
    name: 'Milla Hair Studio - Sidoarjo (HQ)',
    city: 'Sidoarjo',
    address: 'Timur Jank Jank, Jl. Kav. DPR I No.26, Nggrekmas, Pagerwojo, Kecamatan Buduran, Kabupaten Sidoarjo, Jawa Timur 61219',
    phone: '0856-4512-1008',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'br-2',
    name: 'Milla Hair Studio - Sidoarjo Kota',
    city: 'Sidoarjo',
    address: 'Jl. Pahlawan No. 45, Sidoarjo Kota, Sidoarjo 61212',
    phone: '0856-4512-1008',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
  },
];

const STANDARD_SCHEDULE = [
  { day: 'Monday', startTime: '09:30', endTime: '20:00', isOff: false },
  { day: 'Tuesday', startTime: '09:30', endTime: '20:00', isOff: false },
  { day: 'Wednesday', startTime: '09:30', endTime: '20:00', isOff: false },
  { day: 'Thursday', startTime: '09:30', endTime: '20:00', isOff: false },
  { day: 'Friday', startTime: '09:30', endTime: '20:00', isOff: false },
  { day: 'Saturday', startTime: '09:30', endTime: '20:00', isOff: false },
  { day: 'Sunday', startTime: '09:30', endTime: '20:00', isOff: false },
];

export const STYLISTS: Stylist[] = [
  {
    id: 'sty-1',
    name: 'Elena Rosewood',
    branchId: 'br-1',
    specialty: ['Hair Styling Expert', 'Keratin Treatment Specialist', 'Hair Spa Therapy'],
    rating: 4.9,
    reviewsCount: 142,
    experienceYears: 8,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    weeklySchedule: STANDARD_SCHEDULE,
  },
  {
    id: 'sty-2',
    name: 'Rian Wijaya',
    branchId: 'br-1',
    specialty: ['Hair Cut Artisan', 'Smoothing expert', 'Hair Wash Specialist'],
    rating: 4.8,
    reviewsCount: 98,
    experienceYears: 6,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    weeklySchedule: STANDARD_SCHEDULE,
  },
  {
    id: 'sty-3',
    name: 'Yuka Tanada',
    branchId: 'br-2',
    specialty: ['Hair Coloring Artist', 'Smoothing Expert', 'Keratin Treatment'],
    rating: 4.9,
    reviewsCount: 115,
    experienceYears: 7,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    weeklySchedule: STANDARD_SCHEDULE,
  },
  {
    id: 'sty-4',
    name: 'Marcus Vance',
    branchId: 'br-2',
    specialty: ['Hair Cut specialist', 'Hair Wash', 'Hair Styling Expert'],
    rating: 4.7,
    reviewsCount: 84,
    experienceYears: 10,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    weeklySchedule: STANDARD_SCHEDULE,
  },
  {
    id: 'sty-5',
    name: 'Sarah Clarissa',
    branchId: 'br-1',
    specialty: ['Hair Spa Specialist', 'Hair Coloring Artist', 'Keratin Therapy'],
    rating: 4.9,
    reviewsCount: 156,
    experienceYears: 9,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    status: 'active',
    weeklySchedule: STANDARD_SCHEDULE,
  },
];

export const SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Hair Cut',
    category: 'haircut',
    durationMins: 45,
    price: 120000,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
    description: 'Potong rambut modis oleh stylist profesional, termasuk cuci rambut dan pijat kepala rileks.',
  },
  {
    id: 'srv-2',
    name: 'Hair Spa',
    category: 'treatment',
    durationMins: 60,
    price: 150000,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600',
    description: 'Perawatan rambut mendalam untuk menutrisi akar, mengurangi rontok, dan memberikan keharuman tahan lama.',
  },
  {
    id: 'srv-3',
    name: 'Hair Coloring',
    category: 'coloring',
    durationMins: 120,
    price: 450000,
    image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=600',
    description: 'Pewarnaan rambut penuh menggunakan produk berkualitas tinggi yang aman untuk batang rambut.',
  },
  {
    id: 'srv-4',
    name: 'Smoothing',
    category: 'treatment',
    durationMins: 150,
    price: 400000,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    description: 'Pelurusan rambut intensif menghasilkan rambut lurus alami yang lembut, berkilau, dan mudah diatur.',
  },
  {
    id: 'srv-5',
    name: 'Keratin Treatment',
    category: 'treatment',
    durationMins: 120,
    price: 500000,
    image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600',
    description: 'Restorasi keratin protein untuk melapisi batang rambut yang rusak atau kering akibat bleaching/styling.',
  },
  {
    id: 'srv-6',
    name: 'Hair Wash',
    category: 'styling',
    durationMins: 30,
    price: 60000,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    description: 'Cuci bersih rambut dengan sampo premium dan pengeringan blow dry untuk tampilan segar.',
  },
  {
    id: 'srv-7',
    name: 'Hair Styling',
    category: 'styling',
    durationMins: 45,
    price: 80000,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
    description: 'Penataan rambut pesta, catok lurus, curl/curly wave, atau sanggul modern sesuai keinginan Anda.',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Milla Signature Caviar Elixir Shampoo',
    category: 'shampoo',
    price: 320000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=400',
    description: 'Premium shampoo infused with black caviar extract and biotin. Revitalizes dry scalp and fortifies hair follicles to reduce fallouts.',
    rating: 4.9,
    reviewsCount: 78,
  },
  {
    id: 'prod-2',
    name: 'Milla Keratin Active Hydrating Conditioner',
    category: 'conditioner',
    price: 290000,
    stock: 32,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=400',
    description: 'Deeply nourishing conditioner rich in keratin proteins, argan oil, and panthenol. Leaves hair soft, shiny, and tangle-free.',
    rating: 4.8,
    reviewsCount: 54,
  },
  {
    id: 'prod-3',
    name: 'Ultimate Argan Therapy Hair Serum',
    category: 'vitamin',
    price: 245000,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400',
    description: 'Lightweight styling serum to lock in moisture, block out frizz, and shield hair from heat damage up to 230°C.',
    rating: 4.9,
    reviewsCount: 112,
  },
  {
    id: 'prod-4',
    name: 'Rosemary & Ginseng Hair Tonic',
    category: 'tonic',
    price: 195000,
    stock: 5, // Triggers low stock alert
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=400',
    description: 'Stimulating hair tonic designed to improve blood circulation on the scalp, promote new growth, and eliminate oiliness.',
    rating: 4.7,
    reviewsCount: 42,
  },
  {
    id: 'prod-5',
    name: 'Luxe Restructuring Jasmine Hair Mask',
    category: 'mask',
    price: 380000,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400',
    description: 'Intense reconstructive treatment mask with pure jasmine absolute oil and amino acids for heavily bleached or damaged hair.',
    rating: 4.9,
    reviewsCount: 61,
  },
];

export const VOUCHERS: Voucher[] = [
  {
    id: 'v-1',
    code: 'MILLAVIP',
    discountAmount: 150000,
    isPercentage: false,
    minPurchase: 500000,
    expiryDate: '2026-12-31',
    active: true,
    description: 'Diskon Rp 150.000 untuk minimal transaksi Rp 500.000',
  },
  {
    id: 'v-2',
    code: 'FIRSTGLOW',
    discountAmount: 20,
    isPercentage: true,
    minPurchase: 200000,
    expiryDate: '2026-12-31',
    active: true,
    description: 'Diskon 20% khusus booking pertama Anda',
  },
  {
    id: 'v-3',
    code: 'ROSEGOLDFEST',
    discountAmount: 75000,
    isPercentage: false,
    minPurchase: 300000,
    expiryDate: '2026-09-30',
    active: true,
    description: 'Diskon Rp 75.000 spesial perayaan Grand Opening Milla',
  },
];

export const GIFT_CARDS: GiftCard[] = [
  { id: 'gc-1', code: 'MGC-50K-XYZ', balance: 50000, expiryDate: '2027-01-01', active: true },
  { id: 'gc-2', code: 'MGC-100K-ABC', balance: 100000, expiryDate: '2027-01-01', active: true },
  { id: 'gc-3', code: 'MGC-250K-VIP', balance: 250000, expiryDate: '2027-06-01', active: true },
];

export const BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: '5 Tren Warna Rambut Luxury di Tahun 2026',
    summary: 'Dari Rose Gold yang memikat hingga Caramel Balayage yang elegan. Simak tren warna rambut terbaik untuk menonjolkan kecantikan Anda.',
    content: 'Tahun 2026 membawa gelombang kreativitas baru dalam dunia pewarnaan rambut. Di Milla Hair Studio, kami mengamati peningkatan minat yang besar pada warna-warna multidimensi yang terlihat mewah namun mudah dirawat. Balayage dengan transisi warna rose gold lembut, platinum ashy, hingga cokelat karamel hangat menjadi pilihan utama para wanita urban. Teknik AirTouch juga semakin diminati karena menghasilkan gradasi yang sangat halus tanpa merusak akar rambut...',
    image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=800',
    date: '15 Juni 2026',
    author: 'Elena Rosewood (Art Director)',
    readTime: '4 menit baca',
  },
  {
    id: 'blog-2',
    title: 'Pentingnya Perawatan Kulit Kepala (Scalp Therapy)',
    summary: 'Rambut indah berawal dari kulit kepala yang sehat. Kenali tanda-tanda kulit kepala stres dan cara mengatasinya dengan ritual spa yang tepat.',
    content: 'Seringkali kita hanya fokus pada kelembutan batang rambut dan melupakan tempat rambut tumbuh: kulit kepala. Penumpukan sisa produk styling, minyak berlebih, dan polusi udara dapat menyumbat folikel rambut, menyebabkan ketombe, kerontokan, hingga rambut kusam. Melalui artikel ini, kami mengulas bagaimana Detoxifying Clay Scalp Ritual dapat merangsang pertumbuhan rambut yang sehat melalui stimulasi sirkulasi darah dan pembersihan mendalam...',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800',
    date: '10 Juni 2026',
    author: 'Rian Wijaya (Hair Therapist)',
    readTime: '3 menit baca',
  },
  {
    id: 'blog-3',
    title: 'Tips Memilih Gaya Rambut Sesuai Bentuk Wajah Anda',
    summary: 'Gaya rambut yang tepat dapat menyamarkan sudut wajah yang keras atau mempertegas kelebihan Anda. Berikut panduan dari pakar gaya rambut kami.',
    content: 'Apakah Anda memiliki bentuk wajah bulat, oval, kotak, atau hati? Setiap bentuk wajah memiliki karakteristik unik yang dapat dioptimalkan dengan potongan rambut yang pas. Wajah bulat sangat cocok dengan potongan shaggy layer atau bob asimetris yang memberikan ilusi memanjang. Sementara pemilik wajah kotak dapat memilih soft waves untuk melembutkan garis rahang yang tegas. Di Milla Hair Studio, kami menyediakan AI Face Shape Detector yang membantu Anda menganalisis bentuk wajah secara instan sebelum melakukan konsultasi langsung dengan stylist kami...',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800',
    date: '02 Juni 2026',
    author: 'Sarah Clarissa (Senior Stylist)',
    readTime: '5 menit baca',
  },
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'PT L\'Oreal Luxury Indonesia',
    contactName: 'Budi Santoso',
    phone: '+62 21-5555-888',
    email: 'budi.santoso@loreal-luxury.id',
    address: 'Gedung AIA Central Lt. 24, Jl. Jend. Sudirman, Jakarta Pusat',
  },
  {
    id: 'sup-2',
    name: 'Kerastase Paris Authorized Distributor',
    contactName: 'Amanda Putri',
    phone: '+62 812-9999-8888',
    email: 'amanda@kerastase-distributor.co.id',
    address: 'Kawasan Industri Pulogadung Blok B9, Jakarta Timur',
  },
];
