import { useState } from 'react';
import { Sun, Moon, Check, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemePromptModal() {
  const { setTheme, showThemeModal, confirmTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState('light');

  if (!showThemeModal) return null;
  function handleCardClick(mode) { setSelectedTheme(mode); setTheme(mode); }
  function handleConfirm() {confirmTheme(selectedTheme);}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center font-sans text-[var(--text)]">
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] leading-tight mb-2">
          Tema seçin
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 max-w-xs">
          Default olaraq <strong>Ağ (Light)</strong> tema seçilidir.
        </p>
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <button
            type="button"
            onClick={() => handleCardClick('light')}
            className={`relative flex flex-col items-center gap-3 p-5 rounded-xl cursor-pointer transition-all ${
              selectedTheme === 'light'
                ? 'bg-[var(--card)] border-2 border-[var(--accent)] shadow-md scale-105'
                : 'bg-transparent border border-[var(--border)] hover:bg-[var(--card-hover)]'}`}>
            {selectedTheme === 'light' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-[#f5f0e8] border border-[#d4c7b6] text-[#c2500f] flex items-center justify-center">
              <Sun size={24} />
            </div>
            <div className="text-center">
              <p className={`text-sm font-bold ${selectedTheme === 'light' ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                Ağ / Light
              </p>
            </div>
          </button>
          <button type="button" onClick={() => handleCardClick('dark')}
            className={`relative flex flex-col items-center gap-3 p-5 rounded-xl cursor-pointer transition-all ${
              selectedTheme === 'dark'
                ? 'bg-[var(--card)] border-2 border-[var(--accent)] shadow-md scale-105'
                : 'bg-transparent border border-[var(--border)] hover:bg-[var(--card-hover)]'}`}>
            {selectedTheme === 'dark' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-[#1a1815] border border-[#3e342a] text-[#f59e0b] flex items-center justify-center">
              <Moon size={24} />
            </div>
            <div className="text-center">
              <p className={`text-sm font-bold ${selectedTheme === 'dark' ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                Qaranlıq / Dark
              </p>
            </div>
          </button>
        </div>
        <button type="button" onClick={handleConfirm}
          className="btn-accent w-full rounded-xl py-3 px-6 text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all">
          <span>{selectedTheme === 'light' ? 'Light Theme' : 'Dark Theme'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}