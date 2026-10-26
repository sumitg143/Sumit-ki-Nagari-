import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, Copy, Check, FileJson } from 'lucide-react';
import { CityConfig, Resident } from '../types/city.ts';

interface CityDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  residents: Resident[];
  onImportResidents: (imported: Resident[]) => void;
  onResetDefaults: () => void;
}

export const CityDataModal: React.FC<CityDataModalProps> = ({
  isOpen,
  onClose,
  lang,
  residents,
  onImportResidents,
  onResetDefaults,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const cityData: CityConfig = {
    cityName: 'Sumit Ki Nagri',
    cityHindiName: 'सुमित की नगरी (अपनी नगरी)',
    tagline: 'Interactive 3D living Indian town simulation where visitors become residents',
    mayor: 'Sumit Gupta (sumitgupta43996@gmail.com)',
    residents: residents,
    lastUpdated: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(cityData, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'city.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      setErrorMsg('');
      const parsed = JSON.parse(importText);
      const importedResidents = Array.isArray(parsed) ? parsed : parsed.residents;
      if (!Array.isArray(importedResidents) || importedResidents.length === 0) {
        throw new Error('Invalid format: Could not find array of residents.');
      }
      onImportResidents(importedResidents);
      setImportText('');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON file';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-black p-5 sm:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-xl text-blue-400">
              <FileJson className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-heading">
                {lang === 'hi' ? 'नगर डेटा (city.json)' : 'City Data (city.json)'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'अपनी नगरी की तरह city.json को डाउनलोड या गिटहब में अपडेट करें'
                  : 'Inspect, download or import town configurations like apninagri.com'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Town Summary Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">नगर प्रमुख / Mayor</span>
            <span className="font-bold text-amber-300">सुमित गुप्ता</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">कुल नागरिक</span>
            <span className="font-bold text-slate-100">{residents.length} निवासी</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">मुख्य बाज़ार</span>
            <span className="font-bold text-slate-100">बाज़ार चौक</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">रेलवे संपर्क</span>
            <span className="font-bold text-slate-100">सुमित नगर जं.</span>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="relative">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 rounded-t-xl border border-slate-700 text-xs text-slate-400">
            <span>city.json preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition cursor-pointer font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
          <pre className="max-h-48 overflow-y-auto p-3 bg-slate-950 border-x border-b border-slate-800 rounded-b-xl text-[11px] font-mono text-emerald-400">
            {jsonString}
          </pre>
        </div>

        {/* Import custom city.json */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'hi' ? 'नया city.json इम्पोर्ट करें:' : 'Import custom city.json:'}</span>
          </label>
          <textarea
            rows={2}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste raw JSON here..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none"
          />
          {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs transition cursor-pointer"
            >
              {lang === 'hi' ? 'डेटा लोड करें' : 'Load Data'}
            </button>
            <button
              onClick={() => {
                if (confirm('Reset to original default residents of Sumit Ki Nagri?')) {
                  onResetDefaults();
                  onClose();
                }
              }}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मूल सेटिंग्स रीसेट करें' : 'Reset Defaults'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
