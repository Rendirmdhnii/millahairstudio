'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, X, Sparkles, User as UserIcon, LogOut, Shield, Scissors, 
  ShoppingBag, Calendar, BarChart3, Layers, Bell 
} from 'lucide-react';
import { useMillaStore } from '../store/useMillaStore';
import { cn } from '../lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(true);

  const { currentUser, login, logout, notifications, markNotificationRead } = useMillaStore();

  const unreadNotifs = notifications.filter(n => !n.isRead && (!currentUser || n.userId === currentUser.id));

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Layanan', href: '/services' },
    { name: 'Stylist', href: '/stylists' },
    { name: 'Membership', href: '/membership' },
    { name: 'Produk', href: '/products' },
    { name: 'Blog', href: '/blog' },
    { name: 'Hubungi Kami', href: '/contact' },
  ];

  // Helper to switch user roles instantly for demonstration
  const handleRoleSwitch = (role: string) => {
    let email = 'customer@milla.com'; // customer
    if (role === 'owner') email = 'owner@milla.com';
    else if (role === 'admin') email = 'admin@milla.com';
    else if (role === 'cashier') email = 'cashier@milla.com';
    else if (role === 'stylist') email = 'elena@milla.com';
    
    login(email, role);
    
    // Redirect to respective dashboard
    if (role === 'customer') router.push('/dashboard/customer');
    else if (role === 'stylist') router.push('/dashboard/stylist');
    else if (role === 'cashier') router.push('/dashboard/cashier');
    else if (role === 'admin') router.push('/dashboard/admin');
    else if (role === 'owner') router.push('/dashboard/owner');
    else if (role === 'manager') router.push('/dashboard/manager');
  };

  const getDashboardLink = (role: string) => {
    switch (role) {
      case 'owner': return '/dashboard/owner';
      case 'admin': return '/dashboard/admin';
      case 'cashier': return '/dashboard/cashier';
      case 'stylist': return '/dashboard/stylist';
      case 'manager': return '/dashboard/manager';
      default: return '/dashboard/customer';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-150 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="p-2 rounded-full bg-stone-100 text-primary">
                  <Scissors className="h-6 w-6" />
                </span>
                <span className="text-xl font-bold tracking-tight text-zinc-900">
                  Milla Hair Studio
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200",
                    pathname === link.href
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-zinc-600 hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Cart */}
              <Link href="/cart" className="p-2 text-zinc-600 hover:text-primary relative transition-colors">
                <ShoppingBag className="h-6 w-6" />
              </Link>

              {/* Notification Bell */}
              {currentUser && (
                <div className="relative group">
                  <button className="p-2 text-zinc-600 hover:text-primary transition-colors relative">
                    <Bell className="h-6 w-6" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                  {/* Notifications Dropdown */}
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 text-xs">
                    <h4 className="font-bold p-2 border-b border-zinc-100 text-primary flex justify-between items-center">
                      <span>Notifikasi ({unreadNotifs.length})</span>
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center py-4 text-zinc-400">Tidak ada notifikasi.</p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markNotificationRead(n.id)}
                            className={cn(
                              "p-3 border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer transition-colors",
                              !n.isRead && "bg-zinc-50 font-medium"
                            )}
                          >
                            <p className="text-zinc-800">{n.title}</p>
                            <p className="text-zinc-500 mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={getDashboardLink(currentUser.role)}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 bg-zinc-50 border border-zinc-200 px-3.5 py-2 rounded-full hover:bg-zinc-100 transition-all duration-300"
                  >
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    {currentUser.role === 'customer' ? 'Dashboard' : `${currentUser.role}`}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold tracking-wide text-zinc-700 hover:text-primary"
                >
                  Login / Register
                </Link>
              )}

              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-semibold text-xs px-6 py-3 rounded-full shadow transition-all duration-300"
              >
                <Sparkles className="h-4 w-4" />
                Booking Sekarang
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-3">
              <Link href="/cart" className="p-2 text-zinc-600 hover:text-primary relative transition-colors">
                <ShoppingBag className="h-6 w-6" />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-zinc-600 hover:text-primary focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-zinc-200 animate-fade-in-up">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-zinc-700 hover:text-primary hover:bg-zinc-50"
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-zinc-100 my-4 pt-4 px-3 flex flex-col gap-3">
                {currentUser ? (
                  <>
                    <Link
                      href={getDashboardLink(currentUser.role)}
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center bg-zinc-50 text-primary py-2.5 rounded-full font-medium"
                    >
                      Dashboard ({currentUser.role})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                        router.push('/');
                      }}
                      className="w-full text-center bg-red-50 text-red-500 py-2.5 rounded-full font-medium"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-zinc-100 text-zinc-800 py-2.5 rounded-full font-medium"
                  >
                    Login / Register
                  </Link>
                )}

                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-primary hover:bg-primary-hover text-white py-3 rounded-full font-semibold shadow"
                >
                  Booking Sekarang
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* FLOATING DEVELOPER QUICK ROLE SWITCHER */}
      {showDevPanel && (
        <div className="fixed bottom-4 right-4 z-50 bg-white rounded-2xl border border-zinc-200 shadow-2xl p-4 max-w-xs transition-all duration-300 w-80">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary animate-spin" />
              <span className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                Dev Panel Switcher
              </span>
            </div>
            <button 
              onClick={() => setShowDevPanel(false)}
              className="p-1 hover:bg-zinc-150 rounded text-zinc-400 hover:text-zinc-600 text-xs font-bold"
            >
              [Minimalkan]
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 mb-3">
            Gunakan tombol di bawah untuk berganti role secara instan tanpa login. Semua fungsionalitas disimulasikan penuh.
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button 
              onClick={() => handleRoleSwitch('customer')}
              className={cn(
                "py-1.5 px-2 rounded-md font-medium text-left border flex items-center gap-1 transition-all",
                currentUser?.role === 'customer' 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
              )}
            >
              <UserIcon className="h-3 w-3" />
              Customer
            </button>
            <button 
              onClick={() => handleRoleSwitch('stylist')}
              className={cn(
                "py-1.5 px-2 rounded-md font-medium text-left border flex items-center gap-1 transition-all",
                currentUser?.role === 'stylist' 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
              )}
            >
              <Scissors className="h-3 w-3" />
              Stylist
            </button>
            <button 
              onClick={() => handleRoleSwitch('cashier')}
              className={cn(
                "py-1.5 px-2 rounded-md font-medium text-left border flex items-center gap-1 transition-all",
                currentUser?.role === 'cashier' 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
              )}
            >
              <ShoppingBag className="h-3 w-3" />
              Cashier POS
            </button>
            <button 
              onClick={() => handleRoleSwitch('admin')}
              className={cn(
                "py-1.5 px-2 rounded-md font-medium text-left border flex items-center gap-1 transition-all",
                currentUser?.role === 'admin' 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
              )}
            >
              <Calendar className="h-3 w-3" />
              Admin
            </button>
            <button 
              onClick={() => handleRoleSwitch('owner')}
              className={cn(
                "py-1.5 px-2 rounded-md font-medium text-left border flex items-center gap-1.5 transition-all col-span-2 justify-center",
                currentUser?.role === 'owner' 
                  ? "bg-primary text-white border-primary" 
                  : "bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-950"
              )}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Owner Dashboard
            </button>
          </div>
          <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
            <span>Sesi: {currentUser ? currentUser.name : 'Tamu'}</span>
            <span className="capitalize font-semibold text-primary">{currentUser?.role || 'Guest'}</span>
          </div>
        </div>
      )}

      {!showDevPanel && (
        <button 
          onClick={() => setShowDevPanel(true)}
          className="fixed bottom-4 right-4 z-50 bg-primary text-white p-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          title="Buka Dev Switcher"
        >
          <Layers className="h-5 w-5 animate-pulse" />
        </button>
      )}
    </>
  );
}
