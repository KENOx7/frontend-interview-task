import { useState } from 'react';
import { Check, Trash2, GripVertical, ChevronUp, ChevronDown, Star, Plus, ThumbsUp, ThumbsDown, X} from 'lucide-react';

export default function OptionItem({ option, index, totalCount, isSelected, onSelect, onDelete, onMoveUp, onMoveDown,
  onDragStart, onDragOver, onDrop, onDragEnd, isDragging, isDragOver, onUpdateScore,onAddProCon,onRemoveProCon }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [proInput, setProInput] = useState('');
  const [conInput, setConInput] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  function handleDeleteClick(e) {
    e.stopPropagation();
    if (!confirmDelete) {setConfirmDelete(true);
      return;
    }
    onDelete();
  }

  function handleAddPro(e) {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = proInput.trim();
    if (!trimmed) return;
    onAddProCon('pro', trimmed);
    setProInput('');
  }

  function handleAddCon(e) {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = conInput.trim();
    if (!trimmed) return;
    onAddProCon('con', trimmed);
    setConInput('');
  }

  const score = option.score || 0;
  const pros = option.pros || [];
  const cons = option.cons || [];
  const hasDetails = score > 0 || pros.length > 0 || cons.length > 0;

  return (
    <div draggable onDragStart={(e) => onDragStart(e, index)} onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)} onDragEnd={onDragEnd}
      className={`group flex flex-col border-b border-[var(--border)] border-l-[3px] transition-[background,border-color,opacity] duration-200 ${
        isDragging ? 'opacity-40' : 'opacity-100'
      } ${
        isSelected
          ? 'bg-[var(--result-faint)] border-l-[var(--result)]'
          : isDragOver
          ? 'bg-[var(--accent-faint)] border-l-[var(--accent)]'
          : 'bg-transparent hover:bg-[var(--card-hover)] border-l-transparent'}`}>
      <div onClick={onSelect} className="flex items-center gap-2 p-3 cursor-pointer select-none">
        <div onClick={(e) => e.stopPropagation()}
          className="hidden sm:flex cursor-grab text-[var(--text-faint)] items-center p-1 rounded opacity-35 group-hover:opacity-100 transition-opacity duration-150 shrink-0"
          title="Sıralama üçün sürükləyin">
          <GripVertical size={16} />
        </div>
        <div onClick={(e) => e.stopPropagation()} className="hidden sm:group-hover:flex flex-col gap-px shrink-0">
          <button type="button" onClick={() => onMoveUp(index)} disabled={index === 0}
            className={`p-0 leading-none flex items-center transition-colors ${index === 0
                ? 'cursor-default text-transparent'
                : 'cursor-pointer text-[var(--text-muted)] hover:text-[var(--accent)]'}`}
            title="Yuxarı qaldır">
            <ChevronUp size={13} />
          </button>
          <button type="button" onClick={() => onMoveDown(index)} disabled={index === totalCount - 1}
            className={`p-0 leading-none flex items-center transition-colors ${
              index === totalCount - 1
                ? 'cursor-default text-transparent'
                : 'cursor-pointer text-[var(--text-muted)] hover:text-[var(--accent)]'}`}
            title="Aşağı endir">
            <ChevronDown size={13} />
          </button>
        </div>
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-200 ${
            isSelected
              ? 'border-[var(--result)] bg-[var(--result)] text-white'
              : 'border-[var(--border-strong)] bg-transparent'
          }`}>
          {isSelected && <Check size={13} className="text-white" strokeWidth={3} />}
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span className={`text-[0.925rem] font-medium font-sans break-words [overflow-wrap:anywhere] [word-break:break-all] leading-snug min-w-0
              ${isSelected ? 'text-[var(--result)] font-semibold' : 'text-[var(--text)]'}`}>
            {option.label}
          </span>
          {score > 0 && (
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
              <Star size={10} className="fill-amber-500 text-amber-500" />
              {score}/5
            </span>
          )}
          {(pros.length > 0 || cons.length > 0) && (
            <span className="text-[0.7rem] inline-flex gap-1.5 text-[var(--text-muted)] font-medium">
              {pros.length > 0 && <span className="text-[var(--result)]">+{pros.length}</span>}
              {cons.length > 0 && <span className="text-[var(--danger)]">-{cons.length}</span>}
            </span>
          )}
        </div>
        {isSelected && (
          <span className="hidden sm:flex text-[0.65rem] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[var(--result-faint)] text-[var(--result)] border border-[var(--result-border)] items-center gap-1 shrink-0">
            <Check size={10} strokeWidth={3} /> Seçildi
          </span>
        )}
        <button type="button" onClick={(e) => {e.stopPropagation();setShowDetails(!showDetails);}}
          className={`shrink-0 px-2 py-1 rounded-md text-[0.72rem] font-medium cursor-pointer border flex items-center gap-1 transition-colors ${
            showDetails
              ? 'bg-[var(--surface)] border-[var(--border)] text-[var(--accent)]'
              : hasDetails
              ? 'bg-transparent border-transparent text-[var(--accent)] hover:bg-[var(--surface)]'
              : 'bg-transparent border-transparent text-[var(--text-muted)] hover:bg-[var(--surface)]'}`}
          title="Müsbət/mənfi cəhətlər və xal">
          <span>Təhlil</span>
          {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <button type="button" onClick={handleDeleteClick} onBlur={() => setConfirmDelete(false)} 
          aria-label={`${option.label} seçimini sil`}title={confirmDelete ? 'Təsdiqləmək üçün yenidən klikləyin' : 'Sil'}
          className={`shrink-0 p-1.5 rounded-md cursor-pointer text-[0.7rem] flex items-center gap-1 border transition-all duration-150 ${
            confirmDelete
              ? 'opacity-100 bg-[var(--danger-faint)] border-[var(--danger)] text-[var(--danger)]'
              : 'opacity-0 group-hover:opacity-100 bg-transparent border-transparent text-[var(--text-faint)] hover:text-[var(--danger)] hover:bg-[var(--danger-faint)] hover:border-[var(--danger)]'}`}>
          <Trash2 size={13} />
          {confirmDelete && <span className="font-medium">Sil?</span>}
        </button>
      </div>
      {showDetails && (
        <div onClick={(e) => e.stopPropagation()}
          className="pl-8 sm:pl-12 pr-5 pt-3.5 pb-4 bg-[var(--surface)] border-t border-dashed border-[var(--border)] flex flex-col gap-3.5 text-[0.825rem] min-w-0 overflow-hidden">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-[var(--text-muted)] text-[0.78rem]">Dəyərləndirmə:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const filled = starVal <= (hoveredStar || score);
                return (
                  <button key={starVal} type="button" onClick={() => onUpdateScore(starVal)} 
                    onMouseEnter={() => setHoveredStar(starVal)} onMouseLeave={() => setHoveredStar(0)}
                    className={`p-0.5 cursor-pointer transition-transform duration-100 hover:scale-125 
                                ${filled ? 'text-amber-500' : 'text-[var(--border-strong)]'}`}
                    title={`${starVal} xal`}>
                    <Star size={16} className={filled ? 'fill-amber-500 text-amber-500' : 'fill-transparent'}/>
                  </button>
                );
              })}
              {score > 0 && (
                <button type="button" onClick={() => onUpdateScore(0)}
                  className="text-[0.7rem] text-[var(--text-faint)] ml-1.5 cursor-pointer underline hover:text-[var(--danger)] transition-colors">
                  Sıfırla
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4 min-w-0">
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-[var(--result)] font-semibold text-[0.78rem]">
                <ThumbsUp size={13} />
                <span>Müsbət Cəhətlər ({pros.length})</span>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                {pros.map((p, pIdx) => (
                  <div key={pIdx}
                    className="flex items-start justify-between gap-2 bg-[var(--card)] border border-[var(--border)] px-2.5 py-1.5 rounded-md text-[0.78rem] text-[var(--text)] min-w-0">
                    <span className="flex items-start gap-1.5 flex-1 min-w-0 break-words [overflow-wrap:anywhere]">
                      <span className="text-[var(--result)] font-bold shrink-0 leading-tight">+</span>
                      <span className="flex-1 min-w-0 break-words [overflow-wrap:anywhere] leading-tight">{p}</span>
                    </span>
                    <button type="button" onClick={() => onRemoveProCon('pro', pIdx)}
                      className="cursor-pointer text-[var(--text-faint)] hover:text-[var(--danger)] shrink-0 p-0.5 flex items-center transition-colors"
                      title="Sil">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <form onSubmit={handleAddPro} className="flex gap-1.5 mt-1 min-w-0">
                  <input type="text" value={proInput} onChange={(e) => setProInput(e.target.value)} placeholder="Müsbət cəhət əlavə et..."
                    className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] focus:border-[var(--result)] rounded-md px-2.5 py-1.5 text-xs text-[var(--text)] outline-none transition-colors"/>
                  <button type="submit"
                    className="bg-[var(--result-faint)] hover:bg-[var(--result)] hover:text-white border border-[var(--result-border)] text-[var(--result)] rounded-md px-2 py-1.5 cursor-pointer flex items-center transition-all duration-150 active:scale-95"
                    title="Əlavə et">
                    <Plus size={13} />
                  </button>
                </form>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-[var(--danger)] font-semibold text-[0.78rem]">
                <ThumbsDown size={13} />
                <span>Mənfi Cəhətlər ({cons.length})</span>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                {cons.map((c, cIdx) => (
                  <div key={cIdx}
                    className="flex items-start justify-between gap-2 bg-[var(--card)] border border-[var(--border-strong)] px-2.5 py-1.5 rounded-md text-[0.78rem] text-[var(--text)] min-w-0">
                    <span className="flex items-start gap-1.5 flex-1 min-w-0 break-words [overflow-wrap:anywhere]">
                      <span className="text-[var(--danger)] font-bold shrink-0 leading-tight">-</span>
                      <span className="flex-1 min-w-0 break-words [overflow-wrap:anywhere] leading-tight">{c}</span>
                    </span>
                    <button type="button" onClick={() => onRemoveProCon('con', cIdx)}
                      className="cursor-pointer text-[var(--text-faint)] hover:text-[var(--danger)] shrink-0 p-0.5 flex items-center transition-colors"
                      title="Sil">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <form onSubmit={handleAddCon} className="flex gap-1.5 mt-1 min-w-0">
                  <input type="text" value={conInput} onChange={(e) => setConInput(e.target.value)} placeholder="Mənfi cəhət əlavə et..."
                    className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] focus:border-[var(--danger)] rounded-md px-2.5 py-1.5 text-xs text-[var(--text)] outline-none transition-colors"/>
                  <button type="submit"
                    className="bg-[var(--danger-faint)] hover:bg-[var(--danger)] hover:text-white border border-[var(--danger)]/30 text-[var(--danger)] rounded-md px-2 py-1.5 cursor-pointer flex items-center transition-all duration-150 active:scale-95"
                    title="Əlavə et">
                    <Plus size={13} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}