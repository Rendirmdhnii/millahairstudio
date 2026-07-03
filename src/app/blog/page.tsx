'use client';

import { useState } from 'react';
import { BookOpen, Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { BLOGS } from '@/lib/mockData';

export default function BlogPage() {
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  if (selectedBlog) {
    return (
      <div className="w-full bg-pink-50/10 py-16 px-4 sm:px-6 lg:px-8 font-sans text-zinc-850">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-pink-100 p-8 shadow-xl space-y-6 animate-fade-in-up">
          <button
            onClick={() => setSelectedBlog(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Artikel
          </button>

          <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-80 object-cover rounded-3xl shadow-sm" />

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-xs text-zinc-400 font-light items-center">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                {selectedBlog.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4 text-primary" />
                {selectedBlog.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                {selectedBlog.readTime}
              </span>
            </div>

            <h1 className="text-3xl font-serif font-bold text-zinc-950 leading-tight">{selectedBlog.title}</h1>
            <p className="text-zinc-500 font-medium leading-relaxed italic">{selectedBlog.summary}</p>
            
            <div className="text-sm text-zinc-650 leading-relaxed space-y-4 pt-4 border-t border-pink-50 font-light">
              <p>{selectedBlog.content}</p>
              <p>
                Untuk berkonsultasi lebih lanjut mengenai potongan rambut yang cocok, Anda bisa mencoba fitur AI Face Shape Analyzer kami di halaman utama atau langsung membuat janji temu dengan stylist profesional kami. Milla Hair Studio berkomitmen memberikan pelayanan eksklusif demi kesehatan rambut Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-pink-50/10 py-16 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="p-2 bg-pink-100 text-primary rounded-full inline-flex">
            <BookOpen className="h-6 w-6" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-950">Tren & Inspirasi Rambut</h1>
          <p className="text-sm text-zinc-500 font-light leading-relaxed">
            Ikuti panduan ahli, inspirasi gaya rambut teranyar, serta riset dermatologi tentang perawatan kulit kepala dari tim terapis Milla.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOGS.map((blog) => (
            <div 
              key={blog.id} 
              className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <img src={blog.image} alt={blog.title} className="h-52 w-full object-cover" />
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex gap-4 text-[10px] text-zinc-400 font-medium">
                    <span>{blog.date}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-zinc-900 leading-snug">{blog.title}</h3>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed">{blog.summary}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-pink-50 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-zinc-400">Oleh: {blog.author.split(' (')[0]}</span>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="text-primary hover:text-primary-hover font-bold"
                  >
                    Selengkapnya →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
