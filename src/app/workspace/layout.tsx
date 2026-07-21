import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace | Milla Hair Studio',
  description: 'Internal Management Workspace - Catat Jadwal, Status Booking, dan Laporan Pendapatan Kasir Fisik',
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-800 antialiased flex flex-col">
      {children}
    </div>
  );
}
