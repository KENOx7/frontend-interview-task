import { useState } from 'react';
import { Trash2, Edit3, X, Clock, CheckCheck, Check, Plus, Home, ListPlus } from 'lucide-react';
import OptionItem from './OptionItem';
import { formatDateTime } from '../utils/dateUtils';
import { fireConfetti } from '../utils/confetti';

export default function DecisionDetail({ decision, dispatch }) {
  const [newOption, setNewOption] = useState('');
  const [optionError, setOptionError] = useState('');
  const [confirmDeleteDecision, setConfirmDeleteDecision] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editedTopic, setEditedTopic] = useState(decision.topic);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const selectedOption = decision.options.find((o) => o.id === decision.selectedOptionId) ?? null;

  function handleAddOption(e) {
    e.preventDefault();
    const trimmed = newOption.trim();
    if (!trimmed) {setOptionError('Seçim boş ola bilməz');
      return;
    }
    if (decision.options.some((o) => o.label.toLowerCase() === trimmed.toLowerCase())
    ) {
      setOptionError('Bu seçim artıq var');
      return;
    }
    dispatch({
      type: 'ADD_OPTION',
      payload: { decisionId: decision.id, label: trimmed },
    });
    setNewOption('');
    setOptionError('');
  }

  function handleSelectOption(optionId) {
    const isSelecting = decision.selectedOptionId !== optionId;
    dispatch({
      type: 'SELECT_OPTION',
      payload: { decisionId: decision.id, optionId },
    });
    if (isSelecting) {
      fireConfetti();
    }
  }

  function handleDeleteOption(optionId) {
    dispatch({
      type: 'DELETE_OPTION',
      payload: { decisionId: decision.id, optionId },
    });
  }

  function handleDeleteDecision() {
    if (!confirmDeleteDecision) {
      setConfirmDeleteDecision(true);
      return;
    }
    dispatch({ type: 'DELETE_DECISION', payload: decision.id });
  }

  function handleSaveTopic() {
    const trimmed = editedTopic.trim();
    if (trimmed && trimmed !== decision.topic) {
      dispatch({
        type: 'RENAME_DECISION',
        payload: { id: decision.id, topic: trimmed },
      });
    } else {
      setEditedTopic(decision.topic);
    }
    setIsEditingTopic(false);
  }

  function handleDragStart(e, index) {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {setDragOverIndex(index);
    }
  }

  function handleDrop(e, destinationIndex) {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== destinationIndex) {
      dispatch({
        type: 'REORDER_OPTIONS',
        payload: {
          decisionId: decision.id,
          sourceIndex: draggingIndex,
          destinationIndex,
        },
      });
    }
    setDraggingIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDraggingIndex(null);
    setDragOverIndex(null);
  }

  function handleMoveUp(index) {
    if (index <= 0) return;
    dispatch({
      type: 'REORDER_OPTIONS',
      payload: {
        decisionId: decision.id,
        sourceIndex: index,
        destinationIndex: index - 1,
      },
    });
  }

  function handleMoveDown(index) {
    if (index >= decision.options.length - 1) return;
    dispatch({
      type: 'REORDER_OPTIONS',
      payload: {
        decisionId: decision.id,
        sourceIndex: index,
        destinationIndex: index + 1,
      },
    });
  }

  function handleUpdateScore(optionId, score) {
    dispatch({
      type: 'UPDATE_OPTION_SCORE',
      payload: { decisionId: decision.id, optionId, score },
    });
  }

  function handleAddProCon(optionId, type, text) {
    dispatch({
      type: 'ADD_OPTION_PRO_CON',
      payload: { decisionId: decision.id, optionId, type, text },
    });
  }

  function handleRemoveProCon(optionId, type, index) {
    dispatch({
      type: 'REMOVE_OPTION_PRO_CON',
      payload: { decisionId: decision.id, optionId, type, index },
    });
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden font-sans">
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg)] px-3.5 sm:px-6 py-5">
        <div className="max-w-[820px] w-full mx-auto flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-x-2.5 gap-y-2 flex-wrap mb-2">
              <button type="button" onClick={() => dispatch({ type: 'SET_ACTIVE', payload: null })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] bg-[var(--accent-faint)] border border-[var(--accent)] rounded-md px-2.5 py-1 cursor-pointer whitespace-nowrap shrink-0 hover:bg-[var(--accent)] hover:text-white transition-colors duration-150"
                title="Ana Səhifəyə qayıt">
                <Home size={13} />
                <span>Ana Səhifə</span>
              </button>
              {decision.createdAt && (
                <span className="inline-flex items-center gap-1 text-[0.7rem] text-[var(--text-faint)] whitespace-nowrap">
                  <Clock size={11} />
                  <span>{formatDateTime(decision.createdAt)}</span>
                </span>
              )}
              {decision.resolvedAt && selectedOption && (
                <span className="inline-flex items-center gap-1 text-[0.7rem] text-[var(--result)] bg-[var(--result-faint)] px-1.5 py-0.5 rounded whitespace-nowrap">
                  <CheckCheck size={11} />
                  <span>Qərar verildi</span>
                </span>
              )}
            </div>
            {isEditingTopic ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                <input type="text" value={editedTopic} onChange={(e) => setEditedTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTopic();
                    if (e.key === 'Escape') {
                      setEditedTopic(decision.topic);
                      setIsEditingTopic(false);
                    }
                  }}
                  autoFocus maxLength={120} className="flex-1 w-full min-w-0 font-serif text-[1.25rem] sm:text-[1.4rem] font-bold bg-[var(--input-bg)] border-[1.5px] border-[var(--accent)] rounded-lg px-3 py-1.5 text-[var(--text)] outline-none"/>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={handleSaveTopic}
                    className="btn-accent flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 rounded-lg font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
                    <Check size={13} />
                    <span>Saxla</span>
                  </button>
                  <button type="button"
                    onClick={() => {
                      setEditedTopic(decision.topic);
                      setIsEditingTopic(false);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                    <X size={13} />
                    <span>Ləğv</span>
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setIsEditingTopic(true)}
                className="group bg-transparent border-none p-0 cursor-pointer text-left w-full"
                title="Başlığı redaktə etmək üçün klikləyin">
                <h2 className="font-serif text-[1.2rem] sm:text-[clamp(1.4rem,3vw,2rem)] font-bold text-[var(--text)] group-hover:text-[var(--accent)] leading-tight break-words [overflow-wrap:anywhere] transition-colors duration-150">
                  {decision.topic}
                </h2>
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-150">
                  <Edit3 size={12} />
                  <span>Redaktə etmək üçün klikləyin</span>
                </span>
              </button>
            )}
          </div>
          <button type="button" onClick={handleDeleteDecision} onBlur={() => setConfirmDeleteDecision(false)}
            className={`btn-danger-outline shrink-0 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer mt-1 font-sans whitespace-nowrap border transition-all duration-150 ${
              confirmDeleteDecision
                ? 'bg-[var(--danger-faint)] text-[var(--danger)] border-[var(--danger)]'
                : 'bg-[var(--card)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--danger-faint)] hover:text-[var(--danger)] hover:border-[var(--danger)]'}`}
            aria-label="Qərarı sil">
            <Trash2 size={13} />
            <span className="hidden sm:inline">{confirmDeleteDecision ? 'Əminsiniz?' : 'Sil'}</span>
            <span className="sm:hidden">{confirmDeleteDecision ? '?' : ''}</span>
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-6 flex flex-col items-center">
        <div className="max-w-[820px] w-full flex flex-col gap-7">
          {selectedOption && (
            <div key={selectedOption.id}
              className="animate-reveal-in bg-[var(--result-faint)] border border-[var(--result-border)] border-l-4 border-l-[var(--result)] rounded-r-xl px-6 py-5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-[var(--result)]">
                <span>Seçilmiş Qərar Nəticəsi</span>
              </div>
              <p className="font-serif text-[1.4rem] sm:text-[1.6rem] font-bold text-[var(--text)] break-words [overflow-wrap:anywhere] [word-break:break-word] leading-snug">
                {selectedOption.label}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Ləğv etmək və ya başqasını seçmək üçün seçimlər siyahısından istifadə edin.
              </p>
            </div>
          )}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-3">
              <h3 className="text-[0.7rem] font-bold uppercase tracking-wider text-[var(--text-faint)] flex items-center gap-1.5 shrink-0">
                <span>Seçimlər</span>
                {decision.options.length > 0 && (
                  <span className="text-[var(--accent)]">
                    ({decision.options.length})
                  </span>
                )}
              </h3>
              {decision.options.length > 1 && (
                <span className="text-[0.725rem] text-[var(--text-faint)] leading-tight">
                  Yerini dəyişmək üçün sürükləyin və ya oxlardan istifadə edin
                </span>
              )}
            </div>
            {decision.options.length === 0 ? (
              <div className="py-14 px-4 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface)] text-[var(--text-faint)] flex items-center justify-center">
                  <ListPlus size={24} />
                </div>
                <p className="font-serif text-[1.05rem] font-semibold text-[var(--text-muted)]">
                  Hələ seçim əlavə olunmayıb
                </p>
                <p className="text-sm text-[var(--text-faint)] max-w-xs leading-relaxed">
                  Aşağıdakı xanadan mümkün variantları bir-bir əlavə edərək qərar prosesinə başlayın.
                </p>
              </div>
            ) : (
              <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {decision.options.map((option, idx) => (
                  <OptionItem key={option.id} option={option} index={idx} totalCount={decision.options.length}
                    isSelected={option.id === decision.selectedOptionId} onSelect={() => handleSelectOption(option.id)}
                    onDelete={() => handleDeleteOption(option.id)} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown}
                    onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onDragEnd={handleDragEnd}
                    isDragging={draggingIndex === idx} isDragOver={dragOverIndex === idx} 
                    onUpdateScore={(score) => handleUpdateScore(option.id, score)}
                    onAddProCon={(type, text) => handleAddProCon(option.id, type, text)}
                    onRemoveProCon={(type, pIndex) => handleRemoveProCon(option.id, type, pIndex)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <div className="shrink-0 pt-3.5 px-3.5 sm:px-6 pb-5 border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-[820px] w-full mx-auto">
          <form onSubmit={handleAddOption} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--input-border)] focus-within:border-[var(--accent)] rounded-[14px] pl-4 pr-2 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200">
              <input type="text" value={newOption}
                onChange={(e) => {
                  setNewOption(e.target.value);
                  setOptionError('');}}
                placeholder="Yeni seçim əlavə et…" maxLength={80} className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 shadow-none text-[0.885rem] text-[var(--text)] font-sans py-1.5"/>
              <button type="submit"
                className="btn-accent shrink-0 rounded-[10px] px-4 py-2.5 text-[0.85rem] font-semibold font-sans cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                <Plus size={16} />
                <span>Əlavə et</span>
              </button>
            </div>
            {optionError && (
              <p className="text-xs text-[var(--danger)] pl-2">
                {optionError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}