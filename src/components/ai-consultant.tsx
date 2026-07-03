'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function AiConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Halo! Saya Milla AI Beauty Consultant. Ada yang bisa saya bantu hari ini tentang perawatan rambut, gaya rambut, atau produk terbaik untuk Anda?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');

    // Simulated response generation
    setTimeout(() => {
      let reply = 'Maaf, saya tidak mengerti pertanyaan Anda secara spesifik. Namun, untuk konsultasi mendalam, Anda dapat menjadwalkan janji temu langsung dengan stylist senior kami di cabang terdekat via halaman Booking.';

      if (query.includes('shampoo') || query.includes('produk') || query.includes('sampo')) {
        reply = 'Untuk hasil rambut sehat berkilau, saya sangat menyarankan "Milla Signature Caviar Elixir Shampoo" yang diperkaya ekstrak kaviar hitam. Produk ini membantu merevitalisasi kulit kepala dan memperkuat akar rambut.';
      } else if (query.includes('warna') || query.includes('coloring') || query.includes('cat')) {
        reply = 'Milla Hair Studio memiliki spesialisasi dalam pewarnaan rambut seperti "Luxe Balayage" dan teknik "AirTouch". Perawatan pewarnaan kami menggunakan pewarna bebas amonia organik untuk menjaga rambut tetap lembut.';
      } else if (query.includes('rusak') || query.includes('kering') || query.includes('runtuh') || query.includes('rontok')) {
        reply = 'Untuk rambut kering atau rusak, kami menyarankan "Premium Keratin Blowout Smooth" untuk menutrisi rambut kering kembali lembut, atau "Rosemary & Ginseng Hair Tonic" kami untuk merangsang akar rambut rontok.';
      } else if (query.includes('ketombe') || query.includes('gatal') || query.includes('kulit kepala')) {
        reply = 'Untuk masalah kulit kepala gatal dan ketombe, "Detoxifying Clay Scalp Ritual" kami sangat ideal. Layanan ini membersihkan sebum berlebih, minyak tersumbat, dan meredakan iritasi kulit kepala.';
      } else if (query.includes('harga') || query.includes('biaya') || query.includes('mahal')) {
        reply = 'Harga layanan potong rambut signature kami dimulai dari Rp 350.000 (sudah termasuk wash, treatment massage, dan styling blow). Untuk daftar harga lengkap, Anda bisa mengecek menu "Layanan" di website.';
      } else if (query.includes('booking') || query.includes('pesan') || query.includes('janji')) {
        reply = 'Anda bisa memesan janji temu 24/7 di menu "Booking Sekarang" di bagian kanan atas navbar. Pilih cabang, stylist favorit Anda, tanggal, dan jam kunjungan. Mudah sekali!';
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-primary to-secondary text-white p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-1.5"
          title="Tanya Milla AI Consultant"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider hidden md:inline">AI Consultant</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-[330px] md:w-[360px] h-[480px] bg-white rounded-3xl border border-pink-100 shadow-2xl overflow-hidden flex flex-col font-sans animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-white/20">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs tracking-wider uppercase">Milla Beauty AI</h4>
                <p className="text-[9px] text-pink-100 mt-0.5">Online • Konsultan Cerdas</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-pink-50/10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar Icon */}
                <div
                  className={cn(
                    "p-1.5 rounded-full flex-shrink-0 text-white",
                    msg.sender === 'user' ? "bg-zinc-800" : "bg-primary"
                  )}
                >
                  {msg.sender === 'user' ? <UserIcon className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed",
                    msg.sender === 'user'
                      ? "bg-zinc-800 text-white rounded-br-none"
                      : "bg-white text-zinc-800 shadow-sm border border-pink-50 rounded-bl-none"
                  )}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[8px] text-zinc-400 text-right mt-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-3 border-t border-pink-100 flex gap-2 items-center bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tulis pesan konsul di sini..."
              className="flex-1 bg-pink-50/50 border border-pink-100 rounded-full px-4 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
            <button
              onClick={handleSend}
              className="p-2.5 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
