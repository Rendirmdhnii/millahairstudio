import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Milla Hair Studio',
  description: 'Sistem Admin Dashboard Milla Hair Studio - Catat Jadwal, Status Booking, dan Laporan Pendapatan Kasir Fisik',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100/60 font-sans text-zinc-800 antialiased flex flex-col">
      {children}
    </div>
  );
}
