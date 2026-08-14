import React from 'react';
import { BrandData } from '../types';
import { Palette, Type, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { motion } from 'motion/react';

interface BrandDashboardProps {
  brandData: BrandData;
  logoUrl: string | null;
}

export function BrandDashboard({ brandData, logoUrl }: BrandDashboardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8 pb-12"
    >
      <div className="text-center space-y-2 mb-12">
        <h1 className="text-4xl font-serif text-neutral-900">Your Brand Bible</h1>
        <p className="text-neutral-500">A comprehensive guide to your new visual identity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-8 flex items-center gap-2 self-start w-full">
            <ImageIcon className="w-4 h-4" /> Primary Logo
          </h3>
          {logoUrl ? (
            <img src={logoUrl} alt="Generated Primary Logo" className="max-w-full max-h-[300px] object-contain rounded-xl shadow-sm" />
          ) : (
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-neutral-200 flex items-center justify-center text-neutral-400">
              Generating...
            </div>
          )}
        </div>

        {/* Colors Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Color Palette
          </h3>
          <div className="space-y-4">
            {brandData.palette.map((color, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-colors">
                <div 
                  className="w-16 h-16 rounded-xl shadow-sm border border-black/5 shrink-0" 
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-neutral-900">{color.name}</span>
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">{color.hex}</span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Type className="w-4 h-4" /> Typography
          </h3>
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Header Font</div>
              <div className="text-3xl font-serif text-neutral-900 mb-2">{brandData.fonts.header.name}</div>
              <p className="text-sm text-neutral-600">{brandData.fonts.header.reason}</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Body Font</div>
              <div className="text-xl text-neutral-900 mb-2">{brandData.fonts.body.name}</div>
              <p className="text-sm text-neutral-600">{brandData.fonts.body.reason}</p>
            </div>
          </div>
        </div>

        {/* Secondary Marks */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" /> Secondary Marks & Ideas
          </h3>
          <ul className="space-y-4">
            {brandData.secondaryMarks.map((mark, idx) => (
              <li key={idx} className="flex gap-3 text-neutral-700">
                <span className="shrink-0 w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{mark}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
