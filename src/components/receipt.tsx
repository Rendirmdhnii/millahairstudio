'use client';

import { useState } from 'react';
import { Printer, Share2, Scissors, Check, Mail, MessageSquare } from 'lucide-react';
import { formatPrice, generateBarcodeValue } from '../lib/utils';

interface ReceiptProps {
  details: {
    invoiceId: string;
    cashierName: string;
    customerName: string;
    subtotal: number;
    membershipDiscount: number;
    voucherDiscount: number;
    giftCardDiscount: number;
    total: number;
    paymentMethod: string;
    date: string;
    services: { name: string; price: number; duration: number }[];
    products: { productName: string; quantity: number; price: number }[];
  };
}

export default function Receipt({ details }: ReceiptProps) {
  const [sentWhatsapp, setSentWhatsapp] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);
  
  const barcodeBinary = generateBarcodeValue(details.invoiceId);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsapp = () => {
    setSentWhatsapp(true);
    setTimeout(() => setSentWhatsapp(false), 3000);
  };

  const handleSendEmail = () => {
    setSentEmail(true);
    setTimeout(() => setSentEmail(false), 3000);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl flex flex-col font-mono text-xs text-zinc-800 animate-fade-in-up">
      {/* Printable Receipt Block */}
      <div id="pos-print-area" className="flex flex-col items-center">
        {/* Salon Info */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-zinc-300 w-full">
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <Scissors className="h-5 w-5" />
            <span className="font-serif font-bold text-sm tracking-wide text-zinc-950">Milla Hair Studio</span>
          </div>
          <p className="text-[10px] text-zinc-500">Jl. Senopati No. 45, Jakarta Selatan</p>
          <p className="text-[10px] text-zinc-500">Telp: +62 811-2222-3333</p>
        </div>

        {/* Invoice Metadata */}
        <div className="py-3 border-b border-dashed border-zinc-300 w-full space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span>Invoice:</span>
            <span className="font-bold">{details.invoiceId}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{details.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{details.cashierName}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-semibold">{details.customerName}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="py-3 border-b border-dashed border-zinc-300 w-full space-y-2">
          {details.services.length > 0 && (
            <div>
              <p className="font-bold text-[9px] uppercase tracking-wider text-zinc-400 mb-1">Layanan (Services)</p>
              {details.services.map((srv, idx) => (
                <div key={idx} className="flex justify-between items-start py-0.5">
                  <span className="max-w-[70%] text-left">{srv.name}</span>
                  <span>{formatPrice(srv.price)}</span>
                </div>
              ))}
            </div>
          )}

          {details.products.length > 0 && (
            <div>
              <p className="font-bold text-[9px] uppercase tracking-wider text-zinc-400 mb-1">Produk (Retail)</p>
              {details.products.map((prod, idx) => (
                <div key={idx} className="flex justify-between items-start py-0.5">
                  <span className="max-w-[70%] text-left">
                    {prod.productName} (x{prod.quantity})
                  </span>
                  <span>{formatPrice(prod.price * prod.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calculation Table */}
        <div className="py-3 border-b border-dashed border-zinc-300 w-full space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(details.subtotal)}</span>
          </div>
          {details.membershipDiscount > 0 && (
            <div className="flex justify-between text-primary">
              <span>Diskon Member:</span>
              <span>-{formatPrice(details.membershipDiscount)}</span>
            </div>
          )}
          {details.voucherDiscount > 0 && (
            <div className="flex justify-between text-primary">
              <span>Potongan Voucher:</span>
              <span>-{formatPrice(details.voucherDiscount)}</span>
            </div>
          )}
          {details.giftCardDiscount > 0 && (
            <div className="flex justify-between text-primary">
              <span>Diskon Gift Card:</span>
              <span>-{formatPrice(details.giftCardDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs font-bold pt-1.5 border-t border-dotted border-zinc-200">
            <span>TOTAL:</span>
            <span className="text-zinc-950 text-sm">{formatPrice(details.total)}</span>
          </div>
        </div>

        {/* Payment Type */}
        <div className="py-3 w-full text-center text-[10px] space-y-1">
          <p>Metode Pembayaran: <span className="font-bold uppercase">{details.paymentMethod}</span></p>
          <p className="text-primary font-bold">Status: LUNAS / PAID</p>
        </div>

        {/* Barcode Simulator Graphic */}
        <div className="flex flex-col items-center pt-2 pb-1 w-full border-t border-dashed border-zinc-300">
          <div className="flex gap-[1.5px] items-center h-8 bg-zinc-900 p-1 w-full justify-center">
            {barcodeBinary.split('').map((bit, idx) => (
              <span
                key={idx}
                className={`h-6 ${bit === '1' ? 'w-[3px] bg-white' : 'w-[1.5px] bg-transparent'}`}
              />
            ))}
          </div>
          <span className="text-[8px] text-zinc-400 tracking-[0.25em] mt-1">{details.invoiceId}</span>
        </div>

        {/* Closing Greetings */}
        <p className="text-[9px] text-zinc-400 text-center mt-4">
          Terima kasih atas kunjungan Anda.<br />
          Follow us on Instagram: @millahairstudio
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 pt-4 border-t border-zinc-200 grid grid-cols-3 gap-1.5">
        <button
          onClick={handlePrint}
          className="flex flex-col items-center justify-center p-2 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors font-sans font-semibold text-[10px]"
        >
          <Printer className="h-4 w-4 text-zinc-600 mb-1" />
          Cetak
        </button>

        <button
          onClick={handleSendWhatsapp}
          className={`flex flex-col items-center justify-center p-2 border rounded-xl transition-all font-sans font-semibold text-[10px] ${
            sentWhatsapp
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-800'
          }`}
        >
          {sentWhatsapp ? <Check className="h-4 w-4 text-emerald-500 mb-1" /> : <MessageSquare className="h-4 w-4 text-emerald-500 mb-1" />}
          {sentWhatsapp ? 'Terkirim!' : 'WhatsApp'}
        </button>

        <button
          onClick={handleSendEmail}
          className={`flex flex-col items-center justify-center p-2 border rounded-xl transition-all font-sans font-semibold text-[10px] ${
            sentEmail
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'border-zinc-200 hover:bg-zinc-50 text-zinc-800'
          }`}
        >
          {sentEmail ? <Check className="h-4 w-4 text-primary mb-1" /> : <Mail className="h-4 w-4 text-primary mb-1" />}
          {sentEmail ? 'Terkirim!' : 'Email'}
        </button>
      </div>
    </div>
  );
}
