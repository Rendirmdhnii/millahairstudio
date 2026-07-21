'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMillaStore } from '../../store/useMillaStore';
import { Sparkles, Mail, Lock, Shield, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('1995-01-01');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { login, registerCustomer } = useMillaStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isLogin) {
      const result = login(email);
      if (result.success) {
        // Redirect based on simulated role configured in the store
        const current = useMillaStore.getState().currentUser;
        if (current) {
          if (current.role === 'customer') router.push('/dashboard/customer');
          else if (current.role === 'stylist') router.push('/dashboard/stylist');
          else if (current.role === 'cashier') router.push('/dashboard/cashier');
          else if (current.role === 'admin') router.push('/dashboard/admin');
          else if (current.role === 'owner') router.push('/dashboard/owner');
        }
      } else {
        setErrorMsg(result.error || 'Login gagal.');
      }
    } else {
      if (!name || !email || !phone) {
        setErrorMsg('Semua field wajib diisi.');
        return;
      }
      const result = registerCustomer(name, email, phone, birthDate);
      if (result.success) {
        setIsLogin(true);
        setErrorMsg('Pendaftaran berhasil! Silakan login menggunakan email Anda.');
      } else {
        setErrorMsg('Pendaftaran gagal. Email sudah terdaftar.');
      }
    }
  };

  const handleGoogleLogin = () => {
    // Simulate google login by authenticating customer email instantly
    login('customer@milla.com', 'customer');
    router.push('/dashboard/customer');
  };

  return (
    <div className="w-full min-h-[80vh] bg-pink-50/10 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden animate-fade-in-up">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center space-y-2">
          <div className="inline-flex p-2 rounded-full bg-white/20 mb-2">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            {isLogin ? 'Selamat Datang Kembali' : 'Bergabunglah Bersama Milla'}
          </h2>
          <p className="text-xs text-pink-100 font-light">
            {isLogin ? 'Login ke akun premium Milla Hair Studio Anda' : 'Buat akun gratis dan dapatkan bonus 100 Loyalty Points'}
          </p>
        </div>

        {/* Auth Forms */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-pink-50 text-primary border border-pink-100 rounded-2xl text-xs text-center font-medium animate-pulse">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Aurelia Cantika"
                    className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Nomor Handphone (WhatsApp)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Tanggal Lahir (Untuk Birthday Promo)</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: customer@milla.com"
                className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Kata Sandi (Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs mt-1 p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-1.5 mt-6"
            >
              {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {isLogin ? 'Masuk Sesi' : 'Daftar Akun Baru'}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="w-1/4 border-b border-zinc-200" />
              <span>Atau masuk menggunakan</span>
              <span className="w-1/4 border-b border-zinc-200" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 font-semibold py-3 rounded-full flex justify-center items-center gap-2 shadow-sm transition-colors text-xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Masuk Dengan Google (Simulasi)
            </button>

            {/* Helper Quick Switch links */}
            <div className="pt-6 border-t border-pink-50 text-center text-xs space-y-2">
              <p className="text-zinc-500">
                {isLogin ? 'Belum punya akun premium?' : 'Sudah punya akun Milla?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary-hover font-bold ml-1 transition-colors"
                >
                  {isLogin ? 'Daftar Sekarang' : 'Login Sekarang'}
                </button>
              </p>
              <p className="text-[10px] text-zinc-400">
                Demo quick login: Anda bisa login dengan email apa saja, atau gunakan panel melayang **Dev Panel Switcher** di kanan bawah untuk berganti-ganti dashboard role dengan sekali klik!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
