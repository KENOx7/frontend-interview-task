import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Plus, X, Check, Home, Scale } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ decisions, activeId, dispatch, isOpen, onClose }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  function handleCreate(e) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) {setError('Mövzu boş ola bilməz'); return;}
    dispatch({ type: 'CREATE_DECISION', payload: trimmed });
    setTopic(''); setError(''); onClose();
  }
  function handleSelect(id) { dispatch({ type: 'SET_ACTIVE', payload: id }); onClose(); }

  return (
    <>
      <aside className="hidden lg:flex w-[272px] shrink-0 flex-col bg-[var(--surface)] border-r border-[var(--border)] h-full overflow-hidden">
        <SidebarContent decisions={decisions} activeId={activeId} topic={topic} setTopic={setTopic} error={error} setError={setError} handleCreate={handleCreate}
                        handleSelect={handleSelect} theme={theme} toggleTheme={toggleTheme} onClose={onClose} showClose={false}/>
      </aside>
      <>
        <div
          className={`block lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[3px] transition-opacity duration-250 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={onClose} aria-hidden="true"/>
        <aside
          className={`flex lg:hidden fixed top-0 left-0 h-full z-50 w-[272px] flex-col bg-[var(--surface)] border-r border-[var(--border)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent decisions={decisions} activeId={activeId} topic={topic} setTopic={setTopic} error={error}setError={setError} 
                          handleCreate={handleCreate} handleSelect={handleSelect}theme={theme} toggleTheme={toggleTheme} onClose={onClose} showClose={true}/>
        </aside>
      </>
    </>
  );
}

function SidebarContent({decisions, activeId, topic, setTopic, error, setError, handleCreate, 
                        handleSelect, theme, toggleTheme, onClose, showClose}) {
  return (
    <>
      <div className="pt-6 px-5 pb-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-start justify-between gap-2">
          <button type="button" onClick={() => handleSelect(null)}
            className="bg-transparent border-none p-0 text-left cursor-pointer flex flex-col gap-1 group" title="Ana səhifəyə qayıt">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-[var(--accent)]" />
              <h1 className="font-serif text-[1.15rem] font-bold text-[var(--text)] leading-tight">Qərar Dəftəri</h1>
            </div>
          </button>
          <div className="flex gap-1">
            <button type="button" onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'İşıq modu' : 'Qaranlıq modu'}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] bg-transparent border-none cursor-pointer p-1.5 rounded-md flex items-center justify-center transition-colors">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {showClose && (
              <button type="button" onClick={onClose} aria-label="Bağla" 
                className="text-[var(--text-muted)] hover:text-[var(--text)] bg-transparent border-none cursor-pointer p-1.5 rounded-md flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleCreate}
        className="pt-4 px-4 pb-3.5 border-b border-[var(--border)] shrink-0">
        <label htmlFor="new-decision-input" 
          className="block text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--accent)] mb-2 font-sans">
          Yeni Qərar
        </label>
        <div className="flex gap-2">
          <input id="new-decision-input" type="text" value={topic} onChange={(e) => {setTopic(e.target.value);setError('');}}
            placeholder="Hara getməliyik?"
            maxLength={120}
            className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] focus:border-[var(--accent)] rounded-lg px-3 py-2 text-sm text-[var(--text)] font-sans outline-none shadow-sm transition-colors"/>
          <button type="submit" 
            className="btn-accent w-[38px] h-[38px] rounded-lg shrink-0 cursor-pointer flex items-center justify-center transition-all duration-150 active:scale-95" aria-label="Əlavə et">
            <Plus size={18} />
          </button>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>
        )}
      </form>

      <div className="pt-2.5 px-3.5 pb-1">
        <button type="button" onClick={() => handleSelect(null)}
          className={`focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 w-full flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[0.825rem] font-semibold cursor-pointer border transition-all duration-150 ${
            activeId === null
              ? 'border-[var(--accent)] bg-[var(--accent-faint)] text-[var(--accent)] shadow-sm'
              : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--card-hover)]'
          }`}
          title="Ana Səhifə">
          <Home size={16}  className={activeId === null ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}/>
          <span>Ana Səhifə</span>
        </button>
      </div>
      <p className="pt-4 px-5 pb-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--text-faint)] shrink-0">
        Qərarlarım
      </p>
      <ul className="flex-1 overflow-y-auto px-2 pb-4 list-none" role="list">
        {decisions.length === 0 ? (
          <li className="py-10 px-3 text-center">
            <p className="text-[0.85rem] text-[var(--text-faint)] leading-relaxed">
              Hələ heç bir qərar yoxdur.
              <br />
              <span className="text-[var(--text-muted)]">Yuxarıdan birini əlavə et.</span>
            </p>
          </li>
        ) : (
          decisions.map((d) => (
            <li key={d.id} className="mb-0.5">
              <SidebarDecisionItem d={d} isActive={d.id === activeId} hasResult={d.selectedOptionId !== null} onSelect={() => handleSelect(d.id)}/>
            </li>
          ))
        )}
      </ul>
      {decisions.length > 0 && (
        <div className="py-2.5 px-5 border-t border-[var(--border)] text-[0.7rem] text-[var(--text-faint)] shrink-0 flex items-center justify-between">
          <span>{decisions.length} qərar</span>
        </div>
      )}
    </>
  );
}

function SidebarDecisionItem({ d, isActive, hasResult, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [overflowDistance, setOverflowDistance] = useState(0);

  function measure() {
    if (containerRef.current && textRef.current) {
      const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
      setOverflowDistance(diff > 3 ? diff : 0);
    }
  }

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [d.topic]);

  function handleMouseEnter() {measure(); setIsHovered(true);}
  function handleMouseLeave() { setIsHovered(false); }

  const isOverflowing = overflowDistance > 0;
  const animDuration = Math.max(5.5, overflowDistance / 25 + 3);

  return (
    <button type="button" onClick={onSelect} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      title={d.topic} className={`sidebar-item w-full flex items-center gap-2.5 py-2.5 pl-4 pr-3.5 rounded-r-lg text-left border-none cursor-pointer font-sans transition-colors duration-150 ${isActive
        ? 'active bg-[var(--accent-faint)] text-[var(--text)]'
        : 'bg-transparent hover:bg-[var(--card-hover)] text-[var(--text-muted)]'
      }`}>
      <span ref={containerRef} className="flex-1 min-w-0 overflow-hidden relative block"
        style={{
          maskImage: isOverflowing
            ? isHovered
              ? 'linear-gradient(to right, transparent 0%, black 14px, black calc(100% - 16px), transparent 100%)'
              : 'linear-gradient(to right, black calc(100% - 28px), transparent 100%)'
            : 'none',
          WebkitMaskImage: isOverflowing
            ? isHovered
              ? 'linear-gradient(to right, transparent 0%, black 14px, black calc(100% - 16px), transparent 100%)'
              : 'linear-gradient(to right, black calc(100% - 28px), transparent 100%)'
            : 'none',
        }}>
        <span ref={textRef} className="inline-block whitespace-nowrap text-[0.85rem] font-medium leading-snug"
          style={{
            '--marquee-distance': `-${overflowDistance + 6}px`,
            animation:
              isHovered && isOverflowing
                ? `marquee-stream ${animDuration}s ease-in-out infinite`
                : 'none',
            transform: !isHovered ? 'translateX(0)' : undefined,
            transition: !isHovered ? 'transform 0.35s ease-out' : undefined,
            willChange: 'transform',
          }}>
          {d.topic}
        </span>
      </span>
      {hasResult && (
        <span className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full shrink-0 bg-[var(--result-faint)] text-[var(--result)] border border-[var(--result-border)] flex items-center justify-center">
          <Check size={10} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}