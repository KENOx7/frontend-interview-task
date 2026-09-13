import { useState } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useDecisions } from './hooks/useDecisions';
import { useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import DecisionDetail from './components/DecisionDetail';
import EmptyState from './components/EmptyState';
import ThemePromptModal from './components/ThemePromptModal';

export default function App() {
  const { state, activeDecision, dispatch } = useDecisions();
  const { theme, toggle: toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] font-sans">
      <Sidebar decisions={state.decisions} activeId={state.activeId} dispatch={dispatch} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden bg-[var(--bg)]">
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)] lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Menyu aç"
            className="flex items-center gap-2 text-sm font-semibold bg-transparent border-none cursor-pointer text-[var(--text)]">
            <Menu size={20} />
            <span>Qərar Dəftəri</span>
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'İşıq modu' : 'Qaranlıq modu'} 
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] bg-transparent border-none cursor-pointer rounded-md flex items-center justify-center transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-hidden">
          {!activeDecision ? (<EmptyState decisions={state.decisions} dispatch={dispatch} />
          ) : (<DecisionDetail key={activeDecision.id} decision={activeDecision} dispatch={dispatch} />)}
        </main>
      </div>
      <ThemePromptModal />
    </div>
  );
}