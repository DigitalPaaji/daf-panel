'use client';

import React, { useEffect, useState } from 'react';
import { FiGlobe } from 'react-icons/fi';
 
export default function LocaleSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  // Fix for hydration mismatch in Next.js
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const changeLocale = (e) => {
    const locale = e.target.value;
    localStorage.setItem("lang", locale);
    window.location.reload();
  };

 

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-4">
     

      {/* Language Select */}
      <div className="relative flex items-center">
        {/* <FiGlobe className="absolute left-3 text-slate-400 pointer-events-none" size={16} /> */}
        <select
          onChange={changeLocale}
          defaultValue={localStorage.getItem('lang') || 'en'}
          className="pl-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer transition-all"
        >
          <option value="en">English</option>
<option value="hi">Hindi (हिंदी)</option>
<option value="mr">Marathi (मराठी)</option>
<option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
<option value="es">Spanish (Español)</option>
<option value="fr">French (Français)</option>

        </select>
      </div>
    </div>
  );
}