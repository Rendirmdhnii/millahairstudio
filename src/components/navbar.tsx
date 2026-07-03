'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, X, Sparkles, User as UserIcon, LogOut, Shield, Scissors, 
  ShoppingBag, Bell 
} from 'lucide-react';
import { useMillaStore } from '../store/useMillaStore';
import { cn } from '../lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { currentUser, logout, notifications, markNotificationRead } = useMillaStore();

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
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/55 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="p-2 rounded-full bg-stone-100 text-primary transition-all duration-300 group-hover:bg-primary/10">
                <Scissors className="h-6 w-6" />
              </span>
              <span className="text-xl font-bold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-primary">
                Milla Hair Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-8 lg:gap-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors duration-200 pb-1 border-b-2",
                  pathname === link.href
                    ? "text-primary border-primary"
                    : "text-zinc-600 border-transparent hover:text-primary hover:border-zinc-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-5">
            {/* Cart */}
            <Link 
              href="/cart" 
              className="p-2 text-zinc-600 hover:text-primary relative transition-colors"
              title="Keranjang Belanja"
            >
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
                className="text-sm font-semibold tracking-wide text-zinc-700 hover:text-primary transition-colors"
              >
                Login / Register
              </Link>
            )}

            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-xs px-6 py-3 rounded-full shadow transition-all duration-300"
            >
              <Sparkles className="h-4 w-4" />
              Booking Sekarang
            </Link>
          </div>

          {/* Mobile Navigation Controls (Logo + Cart + User Icon + Hamburger) */}
          <div className="flex md:hidden items-center gap-2">
            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="p-2 text-zinc-600 hover:text-primary relative transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="h-6 w-6" />
            </Link>

            {/* Login / Profile Icon */}
            <Link 
              href={currentUser ? getDashboardLink(currentUser.role) : "/login"} 
              className="p-2 text-zinc-600 hover:text-primary transition-colors"
              title={currentUser ? "Dashboard" : "Login / Register"}
            >
              <UserIcon className="h-6 w-6" />
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-zinc-600 hover:text-primary focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-zinc-200/80 shadow-lg animate-fade-in-up">
          <div className="px-4 pt-2 pb-6 space-y-1.5 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-xl text-base font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary-bg"
                    : "text-zinc-700 hover:text-primary hover:bg-zinc-50"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-zinc-150/50 my-4 pt-4 flex flex-col gap-3">
              {currentUser ? (
                <>
                  <Link
                    href={getDashboardLink(currentUser.role)}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-zinc-50 border border-zinc-200 text-zinc-800 py-3 rounded-full font-semibold transition-all hover:bg-zinc-100"
                  >
                    Dashboard ({currentUser.role === 'customer' ? 'Customer' : currentUser.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      router.push('/');
                    }}
                    className="w-full text-center bg-red-50 text-red-600 py-3 rounded-full font-semibold transition-all hover:bg-red-100"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-zinc-50 border border-zinc-200 text-zinc-800 py-3 rounded-full font-semibold transition-all hover:bg-zinc-100"
                >
                  Login / Register
                </Link>
              )}

              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-primary hover:bg-primary-hover text-white py-3.5 rounded-full font-bold shadow-md transition-all hover:shadow-lg"
              >
                Booking Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
