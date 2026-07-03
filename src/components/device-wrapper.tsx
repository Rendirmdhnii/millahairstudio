'use client';

import { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Compass } from 'lucide-react';
import { cn } from '../lib/utils';

interface DeviceWrapperProps {
  children: React.ReactNode;
  title?: string;
  defaultView?: 'desktop' | 'mobile-customer' | 'mobile-stylist';
  onViewChange?: (view: 'desktop' | 'mobile-customer' | 'mobile-stylist') => void;
}

export default function DeviceWrapper({
  children,
  title = "Milla Platform Previewer",
  defaultView = 'desktop',
  onViewChange
}: DeviceWrapperProps) {
  const [view, setView] = useState<'desktop' | 'mobile-customer' | 'mobile-stylist'>(defaultView);

  const handleViewChange = (newView: 'desktop' | 'mobile-customer' | 'mobile-stylist') => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-4 bg-stone-50/30 min-h-screen">
      {/* Device Selection Bar */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary animate-pulse" />
            {title}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Gunakan pengalih di kanan untuk melihat tampilan sistem SaaS Web Desktop atau Aplikasi Mobile Emulated.
          </p>
        </div>
        
        {/* Toggle Switcher Buttons */}
        <div className="flex bg-white border border-zinc-200 rounded-full p-1 shadow-sm gap-1">
          <button
            onClick={() => handleViewChange('desktop')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200",
              view === 'desktop'
                ? "bg-primary text-white shadow-sm"
                : "text-zinc-600 hover:text-primary hover:bg-zinc-50"
            )}
          >
            <Monitor className="h-4 w-4" />
            Desktop SaaS
          </button>
          
          <button
            onClick={() => handleViewChange('mobile-customer')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200",
              view === 'mobile-customer'
                ? "bg-primary text-white shadow-sm"
                : "text-zinc-600 hover:text-primary hover:bg-zinc-50"
            )}
          >
            <Smartphone className="h-4 w-4" />
            Customer App
          </button>

          <button
            onClick={() => handleViewChange('mobile-stylist')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200",
              view === 'mobile-stylist'
                ? "bg-zinc-950 text-white shadow-sm"
                : "text-zinc-600 hover:text-primary hover:bg-zinc-50"
            )}
          >
            <Smartphone className="h-4 w-4" />
            Stylist App
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {view === 'desktop' ? (
        <div className="w-full transition-all duration-500 animate-fade-in-up">
          {children}
        </div>
      ) : (
        /* Mobile Simulator Chassis */
        <div className="relative mx-auto border-[10px] border-zinc-950 rounded-[48px] h-[780px] w-[360px] bg-zinc-900 phone-shadow transition-all duration-500 animate-fade-in-up overflow-hidden ring-4 ring-stone-200">
          {/* Dynamic Speaker & Camera Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-zinc-950 rounded-b-2xl z-50 flex items-center justify-center gap-2">
            <span className="w-10 h-1 bg-zinc-800 rounded-full" />
            <span className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800" />
          </div>

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 bg-white text-zinc-950 flex justify-between items-center px-6 z-40 text-[10px] font-semibold border-b border-zinc-100">
            <span>20:57</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3 text-zinc-800" />
              <span>4G</span>
              <Battery className="h-3.5 w-3.5 text-zinc-800" />
            </div>
          </div>

          {/* Screen Content Wrapper */}
          <div className="w-full h-full pt-11 pb-6 overflow-y-auto bg-white text-zinc-900 scrollbar-none flex flex-col">
            {children}
          </div>

          {/* Bottom Screen Indicator Home Button */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-zinc-950 rounded-full z-50" />
        </div>
      )}
    </div>
  );
}
