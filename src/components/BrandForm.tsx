import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface BrandFormProps {
  onSubmit: (mission: string, size: '1K' | '2K' | '4K') => void;
  isLoading: boolean;
}

export function BrandForm({ onSubmit, isLoading }: BrandFormProps) {
  const [mission, setMission] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mission.trim()) {
      onSubmit(mission, size);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-indigo-500" />
        Brand Identity Generator
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="mission" className="block text-sm font-medium text-neutral-700 mb-2">
            Company Mission / Vision
          </label>
          <textarea
            id="mission"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="e.g. We build sustainable furniture for modern urban living, focusing on minimalist design and recycled materials."
            className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Logo Resolution
          </label>
          <div className="flex gap-4">
            {(['1K', '2K', '4K'] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={s}
                  checked={size === s}
                  onChange={() => setSize(s)}
                  className="w-4 h-4 text-indigo-600 border-neutral-300 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-neutral-700">{s}</span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-neutral-500">Note: Higher resolutions may take longer to generate.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !mission.trim()}
          className="w-full bg-neutral-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Brand Bible...
            </>
          ) : (
            'Generate Brand Bible'
          )}
        </button>
      </form>
    </div>
  );
}
