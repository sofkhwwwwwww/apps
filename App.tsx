
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  // 4 Text Fields logic maintained in state (3 are hidden as per user request)
  const [prefix, setPrefix] = useState('https://checker.sindheducation.gov.pk:8899/employee_eid/');
  const [variable, setVariable] = useState(''); // Employee ID (Visible)
  const [suffix, setSuffix] = useState('.jpg');
  const [result, setResult] = useState(''); 

  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);

  // PWA Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleLoadImage = () => {
    if (!variable.trim()) return;
    const combined = prefix.trim() + variable.trim() + suffix.trim();
    setResult(combined);
    setImageError(false);
    setImageUrl(combined);
  };

  const handleClear = () => {
    setVariable('');
    setResult('');
    setImageUrl('');
    setImageError(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header / App Bar */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white min-h-[80px] flex items-center">
          <div className="flex justify-end w-full">
            {isInstallable && (
              <button 
                onClick={handleInstall}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-2 px-4 rounded-full shadow-lg transition-all active:scale-95"
              >
                GET APP (APK)
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 pb-10">
          {/* LARGE Image Display Box */}
          <div className="relative min-h-[400px] sm:min-h-[550px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
            {imageUrl && !imageError ? (
              <img 
                src={imageUrl} 
                alt="ID Preview"
                className="w-full h-full max-h-[700px] object-contain p-2 sm:p-4 animate-fade-in"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-center opacity-20 p-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {imageError && <p className="text-red-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Image Not Found</p>}
              </div>
            )}
          </div>

          {/* User Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Employee ID Number</label>
            <input 
              type="text" 
              inputMode="numeric"
              value={variable} 
              onChange={(e) => setVariable(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoadImage()}
              placeholder="Enter ID..."
              className="w-full px-5 py-5 sm:py-6 bg-white border-2 border-slate-100 rounded-2xl text-2xl sm:text-3xl font-mono text-center tracking-widest focus:border-blue-500 outline-none shadow-sm transition-all placeholder:text-slate-200"
            />
          </div>

          {/* Hidden Fields for logic */}
          <div className="hidden">
            <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
            <input type="text" value={result} readOnly />
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 pt-2">
            <button 
              onClick={handleLoadImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 sm:py-6 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] text-lg uppercase tracking-widest"
            >
              GENERATE PREVIEW
            </button>

            <button 
              onClick={handleClear}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-4 rounded-2xl text-xs uppercase transition-all"
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
