/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandForm } from './components/BrandForm';
import { BrandDashboard } from './components/BrandDashboard';
import { ChatPanel } from './components/ChatPanel';
import { BrandData } from './types';
import { Layout } from 'lucide-react';

export default function App() {
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isGeneratingData, setIsGeneratingData] = useState(false);

  const handleGenerate = async (mission: string, size: '1K' | '2K' | '4K') => {
    setIsGeneratingData(true);
    setBrandData(null);
    setLogoUrl(null);

    try {
      // 1. Generate Brand Data (Palette, Fonts, Marks)
      const dataRes = await fetch('/api/brand-bible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission })
      });
      if (!dataRes.ok) throw new Error('Failed to generate brand data');
      const data: BrandData = await dataRes.json();
      setBrandData(data);

      // 2. Start Generating Logo independently so it doesn't block dashboard display
      fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission, imageSize: size })
      })
        .then(res => res.json())
        .then(resData => {
          if (resData.logoUrl) {
            setLogoUrl(resData.logoUrl);
          }
        })
        .catch(err => {
          console.error("Logo generation error:", err);
        });

    } catch (error) {
      console.error(error);
      alert('Failed to generate brand identity. Please try again.');
    } finally {
      setIsGeneratingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-neutral-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-neutral-100 px-8 py-4 flex items-center gap-3 sticky top-0 z-10">
        <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
          <Layout className="w-4 h-4" />
        </div>
        <span className="font-semibold text-lg tracking-tight">BrandGen AI</span>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {!brandData && (
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-5xl font-serif text-neutral-900 mb-6 leading-tight">
              Create your brand identity in seconds
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed mb-10">
              Describe your company's mission and vision, and our AI will generate a complete Brand Bible — including a primary logo, color palette, typography pairings, and secondary marks.
            </p>
            <BrandForm onSubmit={handleGenerate} isLoading={isGeneratingData} />
          </div>
        )}

        {brandData && (
          <div>
            <div className="mb-12 flex justify-center">
              <button 
                onClick={() => {
                  setBrandData(null);
                  setLogoUrl(null);
                }}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm"
              >
                ← Start Over
              </button>
            </div>
            <BrandDashboard brandData={brandData} logoUrl={logoUrl} />
          </div>
        )}
      </main>

      <ChatPanel />
    </div>
  );
}

