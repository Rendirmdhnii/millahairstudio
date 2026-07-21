'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scissors, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMillaStore } from '@/store/useMillaStore';

export default function WorkspaceLoginPage() {
  const router = useRouter();
  const { login } = useMillaStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = login(username, password);
    if (success) {
      router.push('/workspace/dashboard');
    } else {
      setErrorMsg('Kredensial tidak valid. Silakan periksa kredensial masukan Anda.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-zinc-50 flex items-center justify-center p-4 font-sans text-zinc-900">
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 sm:p-10 space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-[#926C3A] flex items-center justify-center mx-auto shadow-xs">
            <Scissors className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-zinc-900">Internal Studio Workspace</h1>
          <p className="text-xs text-zinc-500">Masuk untuk mengelola reservasi dan laporan pendapatan salon.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 uppercase tracking-wider block text-[10px]">
              ID Akses / Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan ID akses..."
                className="w-full text-xs p-3.5 pl-10 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 uppercase tracking-wider block text-[10px]">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full text-xs p-3.5 pl-10 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-[#926C3A] focus:ring-2 focus:ring-[#926C3A]/30 transition-all font-medium"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#926C3A] hover:bg-[#7D5B2E] text-white font-bold py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-2"
          >
            <span>Masuk Internal Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </form>
      </motion.div>

    </div>
  );
}
