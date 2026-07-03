'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMillaStore } from '@/store/useMillaStore';
import { RefreshCw } from 'lucide-react';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { currentUser } = useMillaStore();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Redirect based on role
    switch (currentUser.role) {
      case 'owner':
        router.push('/dashboard/owner');
        break;
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'cashier':
        router.push('/dashboard/cashier');
        break;
      case 'stylist':
        router.push('/dashboard/stylist');
        break;
      case 'manager':
        router.push('/dashboard/manager');
        break;
      default:
        router.push('/dashboard/customer');
    }
  }, [currentUser, router]);

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-pink-50/10 text-center font-sans">
      <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
        Mengalihkan ke dashboard sesuai hak akses Anda...
      </p>
    </div>
  );
}
