'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Wand2, RefreshCw, Layers, Check, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const MODEL_IMAGES = [
  { id: 'm-1', name: 'Model 1 (Wajah Bulat)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
  { id: 'm-2', name: 'Model 2 (Wajah Oval)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
  { id: 'm-3', name: 'Model 3 (Wajah Hati)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' }
];

const HAIRSTYLES = [
  { id: 'hs-waves', name: 'Luxury Long Waves', pathName: 'waves' },
  { id: 'hs-bob', name: 'Precision French Bob', pathName: 'bob' },
  { id: 'hs-pixie', name: 'Tokyo Pixie Cut', pathName: 'pixie' },
  { id: 'hs-curtain', name: 'Curtain Bangs Layer', pathName: 'curtain' }
];

const COLOR_PRESETS = [
  { name: 'Milla Rose Gold', colorHex: '#E5A9A9', desc: 'Perpaduan emas murni dengan pink pastel yang mewah.' },
  { name: 'Ash Platinum Blonde', colorHex: '#E2E8F0', desc: 'Blonde dingin dengan pantulan abu-abu modern.' },
  { name: 'Warm Sunset Copper', colorHex: '#D97706', desc: 'Tembaga hangat memukau, memantulkan sinar matahari.' },
  { name: 'Soft Velvet Lavender', colorHex: '#D8B4FE', desc: 'Lavender redup romantis untuk tampilan artistik.' }
];

export default function AiHairSimulator() {
  const [activeTab, setActiveTab] = useState<'color' | 'face'>('color');
  
  // Color Simulator States
  const [selectedModel, setSelectedModel] = useState(MODEL_IMAGES[0]);
  const [selectedHairstyle, setSelectedHairstyle] = useState(HAIRSTYLES[0]);
  const [hairColor, setHairColor] = useState('#E5A9A9'); // default rose gold
  const [blendIntensity, setBlendIntensity] = useState(0.65);
  
  // Face Shape Analyzer States
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [faceResult, setFaceResult] = useState<{
    shape: string;
    description: string;
    advice: string[];
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas composite drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    baseImage.src = selectedModel.url;
    
    baseImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw base model face
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // 2. Draw hairstyle overlay and apply color multiplication
      // We simulate hair overlay mask utilizing canvas drawing circles or paths representing hairstyles
      ctx.save();
      
      // Define hair simulation paths dynamically based on hairstyle selection
      ctx.beginPath();
      if (selectedHairstyle.id === 'hs-waves') {
        // Waves covering sides and top
        ctx.moveTo(80, 100);
        ctx.bezierCurveTo(40, 140, 20, 260, 50, 360);
        ctx.bezierCurveTo(60, 400, 120, 420, 130, 320);
        ctx.lineTo(270, 320);
        ctx.bezierCurveTo(280, 420, 340, 400, 350, 360);
        ctx.bezierCurveTo(380, 260, 360, 140, 320, 100);
        ctx.bezierCurveTo(280, 50, 120, 50, 80, 100);
      } else if (selectedHairstyle.id === 'hs-bob') {
        // Shorter bob covering head
        ctx.moveTo(90, 100);
        ctx.bezierCurveTo(60, 120, 60, 240, 80, 260);
        ctx.bezierCurveTo(100, 270, 140, 240, 140, 200);
        ctx.lineTo(260, 200);
        ctx.bezierCurveTo(260, 240, 300, 270, 320, 260);
        ctx.bezierCurveTo(340, 240, 340, 120, 310, 100);
        ctx.bezierCurveTo(260, 60, 140, 60, 90, 100);
      } else if (selectedHairstyle.id === 'hs-pixie') {
        // Pixie cut tight to head
        ctx.arc(200, 150, 90, Math.PI, 0, false);
        ctx.lineTo(290, 170);
        ctx.lineTo(260, 180);
        ctx.lineTo(230, 160);
        ctx.lineTo(170, 160);
        ctx.lineTo(140, 180);
        ctx.lineTo(110, 170);
      } else {
        // Curtain bangs
        ctx.moveTo(110, 90);
        ctx.bezierCurveTo(70, 120, 80, 200, 120, 240);
        ctx.lineTo(140, 220);
        ctx.lineTo(160, 160);
        ctx.lineTo(240, 160);
        ctx.lineTo(260, 220);
        ctx.lineTo(280, 240);
        ctx.bezierCurveTo(320, 200, 330, 120, 290, 90);
        ctx.bezierCurveTo(240, 60, 160, 60, 110, 90);
      }
      ctx.closePath();
      
      // 3. Clip and Apply hair color overlay with blend modes
      ctx.clip();
      
      // Add custom visual texture mapping using gradient colors
      const hairGradient = ctx.createLinearGradient(0, 50, 0, 350);
      hairGradient.addColorStop(0, hairColor);
      hairGradient.addColorStop(0.5, hairColor);
      hairGradient.addColorStop(1, '#1A1A1A'); // root dark shade
      
      ctx.fillStyle = hairGradient;
      ctx.globalAlpha = blendIntensity;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fill();
      
      // Draw highlights overlay
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.15;
      ctx.fill();
      
      ctx.restore();
    };
  }, [selectedModel, selectedHairstyle, hairColor, blendIntensity, activeTab]);

  // Simulated face scan trigger
  const runFaceScan = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    setFaceResult(null);
    
    setTimeout(() => {
      // Pick face advice based on model index or random
      let shape = 'Oval';
      let description = 'Proporsi wajah seimbang. Dahi sedikit lebih lebar dari rahang, dengan sudut wajah yang melengkung halus.';
      let advice = [
        'Hampir semua potongan rambut terlihat bagus pada Anda!',
        'Rekomendasi Utama: Lob (Long Bob) bertekstur dengan curtain bangs untuk mempercantik tulang pipi.',
        'Warna rambut terbaik: Milla Rose Gold atau Caramel Highlights untuk kedalaman dimensi.'
      ];
      
      if (selectedModel.id === 'm-1') {
        shape = 'Round (Bulat)';
        description = 'Lebar wajah hampir sama dengan tinggi wajah. Tulang rahang dan dagu melengkung lembut tanpa sudut tajam.';
        advice = [
          'Tujuan: Memberikan ilusi wajah terlihat lebih memanjang dan berstruktur.',
          'Rekomendasi Utama: Potongan rambut layer panjang dengan volume di bagian atas kepala.',
          'Hindari: Poni lurus mendatar yang memotong garis wajah Anda.'
        ];
      } else if (selectedModel.id === 'm-3') {
        shape = 'Heart (Hati)';
        description = 'Dahi cenderung lebar dengan dagu yang runcing dan tegas. Garis rambut terkadang memiliki sudut widow\'s peak.';
        advice = [
          'Tujuan: Mengimbangi lebar dahi dan memberikan volume di sekitar rahang bawah.',
          'Rekomendasi Utama: Shoulder-length waves (ikal sebahu) atau side-swept bangs (poni samping).',
          'Warna rambut terbaik: Tonal Gloss Balayage dengan bayangan akar gelap.'
        ];
      }

      setFaceResult({ shape, description, advice });
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden font-sans">
      {/* Selector Tabs */}
      <div className="flex border-b border-pink-100 bg-pink-50/20">
        <button
          onClick={() => setActiveTab('color')}
          className={cn(
            "flex-1 py-4 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-all flex justify-center items-center gap-2",
            activeTab === 'color'
              ? "border-primary text-primary bg-white"
              : "border-transparent text-zinc-500 hover:text-primary"
          )}
        >
          <Wand2 className="h-4 w-4" />
          AI Hair Color & Style Simulator
        </button>
        <button
          onClick={() => setActiveTab('face')}
          className={cn(
            "flex-1 py-4 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-all flex justify-center items-center gap-2",
            activeTab === 'face'
              ? "border-primary text-primary bg-white"
              : "border-transparent text-zinc-500 hover:text-primary"
          )}
        >
          <Camera className="h-4 w-4" />
          AI Face Shape Analyzer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left Side: Canvas Viewport */}
        <div className="p-6 bg-zinc-950 flex flex-col items-center justify-center relative min-h-[350px]">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-[320px] h-[320px] object-cover rounded-2xl border-2 border-primary/40 shadow-inner"
          />

          {/* Glowing Laser Scan Animation Overlay */}
          {analyzing && (
            <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center pointer-events-none p-6">
              <div className="w-full max-w-[320px] h-[320px] relative overflow-hidden rounded-2xl">
                <div className="absolute w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-lg shadow-primary/60 top-0 left-0 animate-bounce" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold uppercase tracking-widest bg-zinc-900/90 border border-primary px-4 py-2 rounded-full shadow-lg">
                    Memindai Landmarks Wajah...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-400">
            <Info className="h-3 w-3 text-primary" />
            <span>Hasil simulasi AI disesuaikan dengan pencahayaan visual.</span>
          </div>
        </div>

        {/* Right Side: Control Settings */}
        <div className="p-6 flex flex-col justify-between max-h-[420px] overflow-y-auto">
          {activeTab === 'color' ? (
            /* Hair Color Simulation Options */
            <div className="space-y-5">
              {/* Choose Model */}
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">
                  1. Pilih Model Wajah
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MODEL_IMAGES.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={cn(
                        "relative rounded-xl overflow-hidden border-2 transition-all p-0.5",
                        selectedModel.id === model.id ? "border-primary scale-[1.03]" : "border-zinc-200"
                      )}
                    >
                      <img src={model.url} alt={model.name} className="w-full h-12 object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Choose Hairstyle overlay */}
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">
                  2. Pilih Gaya Rambut (Style)
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {HAIRSTYLES.map((hs) => (
                    <button
                      key={hs.id}
                      onClick={() => setSelectedHairstyle(hs)}
                      className={cn(
                        "py-2 px-3 border rounded-xl font-medium text-left transition-all flex justify-between items-center",
                        selectedHairstyle.id === hs.id
                          ? "border-primary text-primary bg-pink-50/30"
                          : "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                      )}
                    >
                      <span>{hs.name}</span>
                      {selectedHairstyle.id === hs.id && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dye Presets */}
              <div>
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">
                  3. Warna Rambut Terlaris (Color Presets)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((cp) => (
                    <button
                      key={cp.name}
                      onClick={() => setHairColor(cp.colorHex)}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-all transform hover:scale-110",
                        hairColor === cp.colorHex ? "border-zinc-950 scale-110 ring-2 ring-primary/40" : "border-transparent"
                      )}
                      style={{ backgroundColor: cp.colorHex }}
                      title={cp.name}
                    />
                  ))}
                  {/* Custom color picker */}
                  <input
                    type="color"
                    value={hairColor}
                    onChange={(e) => setHairColor(e.target.value)}
                    className="w-7 h-7 rounded-full border border-zinc-200 cursor-pointer overflow-hidden p-0 bg-transparent"
                    title="Pilih Warna Custom"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 italic">
                  Warna aktif: {COLOR_PRESETS.find(c => c.colorHex === hairColor)?.name || 'Custom Hex ' + hairColor}
                </p>
              </div>

              {/* Blend opacity slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
                    Intensitas Pewarnaan (Gloss/Dye opacity)
                  </label>
                  <span className="text-[10px] font-bold text-primary">{Math.round(blendIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.9"
                  step="0.05"
                  value={blendIntensity}
                  onChange={(e) => setBlendIntensity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          ) : (
            /* Face Shape Analyzer */
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Fitur AI Face Shape Detection menganalisis proporsi dagu, tulang pipi, dahi, dan rasio tinggi wajah Anda untuk merekomendasikan potongan rambut terbaik.
              </p>

              {!analyzed && !analyzing ? (
                <div className="flex flex-col gap-3 py-6">
                  {/* Choose Face for analysis */}
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold mb-2">
                      Pilih Foto Wajah Untuk Analisis
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {MODEL_IMAGES.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModel(model)}
                          className={cn(
                            "relative rounded-xl overflow-hidden border-2 transition-all p-0.5",
                            selectedModel.id === model.id ? "border-primary scale-[1.03]" : "border-zinc-200"
                          )}
                        >
                          <img src={model.url} alt={model.name} className="w-full h-12 object-cover rounded-lg" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={runFaceScan}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-full shadow-md flex justify-center items-center gap-1.5 mt-2 hover:shadow-lg transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    Mulai Analisis Bentuk Wajah
                  </button>
                </div>
              ) : analyzing ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin mb-3" />
                  <p className="text-xs text-zinc-600 font-semibold uppercase tracking-wider">
                    AI sedang menghitung jarak kelengkangan tulang wajah...
                  </p>
                </div>
              ) : (
                /* Scan Results */
                <div className="space-y-4 animate-fade-in-up">
                  <div className="bg-pink-50/30 border border-pink-100 p-4 rounded-2xl">
                    <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Hasil Klasifikasi AI</p>
                    <h3 className="text-xl font-bold font-serif text-primary mt-0.5">Bentuk Wajah: {faceResult?.shape}</h3>
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{faceResult?.description}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Rekomendasi Tata Gaya Milla</p>
                    <ul className="text-xs text-zinc-700 space-y-1.5 list-disc pl-4 font-light">
                      {faceResult?.advice.map((adv, idx) => (
                        <li key={idx} className="leading-relaxed">{adv}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setAnalyzed(false)}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold py-2.5 rounded-full transition-all"
                  >
                    Ulangi Analisis
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
