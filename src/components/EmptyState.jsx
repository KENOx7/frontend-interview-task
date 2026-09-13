import { useState } from 'react';
import { ArrowRight, UtensilsCrossed, Compass, Code2, CheckCircle2, Clock, CheckCheck, Layers, ChevronUp } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

const PRESET_TEMPLATES = [
  {
    icon: UtensilsCrossed,
    topic: 'Bu axşam nə yeyək?',
    desc: 'Yemək seçimində ilişib qalanda',
    options: ['Pizza', 'Dönər', 'Suşi', 'Şaurma', 'Burger'],
  },
  {
    icon: Compass,
    topic: 'Həftəsonu istirahətinə hara gedək?',
    desc: 'Qısa səyahət və gəzinti üçün',
    options: ['Quba', 'Şəki', 'Qəbələ', 'Lənkəran', 'İsmayıllı'],
  },
  {
    icon: Code2,
    topic: 'Hansı yeni texnologiyanı öyrənim?',
    desc: 'Özünü inkişaf və karyera üçün',
    options: ['TypeScript', 'Next.js', 'Python & AI', 'Docker & DevOps'],
  },
];

export default function EmptyState({ decisions = [], dispatch }) {
  const [topicInput, setTopicInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showAllDecisions, setShowAllDecisions] = useState(false);

  function handleCreateFromInput(e) {
    e.preventDefault();
    const trimmed = topicInput.trim();
    if (!trimmed) {setInputError('Zəhmət olmasa bir mövzu və ya sual yazın');
      return;
    }
    dispatch({ type: 'CREATE_DECISION', payload: trimmed });
    setTopicInput('');
    setInputError('');
  }

  function handleUseTemplate(template) {
    dispatch({
      type: 'CREATE_DECISION_WITH_OPTIONS',
      payload: {
        topic: template.topic,
        options: template.options,
        defaultSelectedIndex: template.defaultSelectedIndex ?? null,
      },
    });
  }

  const completedCount = decisions.filter((d) => Boolean(d.selectedOptionId)).length;
  const pendingCount = decisions.length - completedCount;

  const hasMoreThanSix = decisions.length > 6;
  const displayedDecisions = showAllDecisions
    ? decisions
    : hasMoreThanSix
    ? decisions.slice(0, 5)
    : decisions.slice(0, 6);
  const extraCount = decisions.length - 5;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center bg-[var(--bg)] text-[var(--text)] font-sans">
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <div className="text-center flex flex-col items-center gap-4 pt-4">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[var(--text)] leading-tight max-w-xl">
            Qərar verməkdə çətinlik çəkirsən?
          </h1>
          <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-md">
            Ağlınızdakı sualı yazın, seçimləri əlavə edin və ən doğru nəticəyə çatın.
          </p>
          <form onSubmit={handleCreateFromInput} className="w-full max-w-xl mt-2 flex flex-col gap-2">
            <div className={`flex items-center gap-2 bg-[var(--input-bg)] p-1.5 rounded-xl shadow-md border transition-colors ${
                  inputError
                    ? 'border-[var(--danger)]'
                    : 'border-[var(--input-border)] focus-within:border-[var(--input-border-focus)]'}`}>
              <input type="text" value={topicInput} onChange={(e) => {
                  setTopicInput(e.target.value);
                  if (inputError) setInputError('');
                }}
                placeholder="Məs: Bu axşam nə bişirim?" maxLength={120} className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-[var(--text)]"/>
              <button type="submit"
                className="btn-accent rounded-lg px-5 py-2.5 font-semibold text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-sm">
                <span>Qərar Yarat</span>
                <ArrowRight size={16} />
              </button>
            </div>
            {inputError && (<span className="text-xs text-[var(--danger)] text-left pl-2">{inputError}</span>)}
          </form>
        </div>
        {decisions.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-semibold text-[var(--text)]">
                  Mövcud Qərarlarınız
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
                  {decisions.length} ədəd
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[var(--result)]" />
                  <span>{completedCount} seçilib</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[var(--accent)]" />
                  <span>{pendingCount} gözləyir</span>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedDecisions.map((d) => {
                const isSelected = Boolean(d.selectedOptionId);
                const chosenOption = d.options?.find((o) => o.id === d.selectedOptionId);
                return (
                  <button key={d.id} onClick={() => dispatch({ type: 'SET_ACTIVE', payload: d.id })}
                    className="text-left bg-[var(--card)] hover:bg-[var(--card-hover)] border border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-5 cursor-pointer flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[var(--result-faint)] text-[var(--result)] border-[var(--result-border)]'
                              : 'bg-[var(--accent-faint)] text-[var(--accent)] border-[var(--border)]'}`}>
                        {isSelected ? (<><CheckCheck size={12} /> <span>Qərar verildi</span></>) 
                        : (<> <Clock size={12} /> <span>Gözləyir</span></>)}
                      </span>
                      <span className="text-xs text-[var(--text-faint)]">
                        {d.options?.length ?? 0} seçim
                      </span>
                    </div>
                    <p className="font-serif font-semibold text-base text-[var(--text)] line-clamp-2">
                      {d.topic}
                    </p>
                    {isSelected && chosenOption && (
                      <div className="text-xs text-[var(--result)] bg-[var(--result-faint)] px-2 py-1 rounded truncate flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="shrink-0" />
                        <span className="truncate">
                          Seçim: <strong>{chosenOption.label}</strong>
                        </span>
                      </div>
                    )}
                    {d.createdAt && (
                      <div className="text-xs text-[var(--text-faint)] flex items-center gap-1 mt-auto">
                        <Clock size={11} className="shrink-0" />
                        <span>{formatDateTime(d.createdAt)}</span>
                      </div>
                    )}
                  </button>
                );
              })}
              {hasMoreThanSix && !showAllDecisions && (
                <button onClick={() => setShowAllDecisions(true)}
                  className="group text-center bg-[var(--card)] hover:bg-[var(--card-hover)] border-2 border-dashed border-[var(--border-strong)] hover:border-[var(--accent)] rounded-xl p-5 cursor-pointer flex flex-col items-center justify-center gap-2.5 min-h-[130px] transition-all">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface)] group-hover:bg-[var(--accent)] text-[var(--accent)] group-hover:text-[var(--accent-fg)] flex items-center justify-center transition-colors">
                    <Layers size={18} />
                  </div>
                  <div>
                    <span className="font-serif font-semibold text-sm text-[var(--text)] group-hover:text-[var(--accent)] block">
                      Daha çoxu
                    </span>
                    <span className="text-xs text-[var(--text-muted)] mt-1 block">+{extraCount} qərar daha</span>
                  </div>
                </button>
              )}
              {hasMoreThanSix && showAllDecisions && (
                <button onClick={() => setShowAllDecisions(false)}
                  className="text-center bg-[var(--card)] hover:bg-[var(--card-hover)] border border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-5 cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[130px] transition-all">
                  <ChevronUp size={20} className="text-[var(--text-muted)]" />
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    Daha az göstər
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[var(--text)] mb-1">
              Hazır Şablonlar ilə Başla
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              İstənilən şablona klikləyərək dərhal yeni qərar yaradın və variantları müqayisə edin.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_TEMPLATES.map((tmpl, idx) => {
              const IconComponent = tmpl.icon;
              return (
                <div key={idx} onClick={() => handleUseTemplate(tmpl)}
                  className="group bg-[var(--card)] hover:bg-[var(--card-hover)] border border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-5 cursor-pointer flex flex-col justify-between gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-faint)] text-[var(--accent)] flex items-center justify-center">
                      <IconComponent size={20} />
                    </div>
                    <h3 className="font-serif font-semibold text-base text-[var(--text)]">
                      {tmpl.topic}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {tmpl.desc}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tmpl.options.slice(0, 3).map((opt, oIdx) => {
                        const isDefaultSelected = tmpl.defaultSelectedIndex === oIdx;
                        return (
                          <span key={oIdx} className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                              isDefaultSelected
                                ? 'font-semibold bg-[var(--result-faint)] text-[var(--result)] border border-[var(--result-border)]'
                                : 'font-medium bg-[var(--chip-bg)] text-[var(--chip-text)] border border-[var(--chip-border)]'}`}>
                            {isDefaultSelected && <CheckCircle2 size={11} />} {opt}
                          </span>
                        );
                      })}
                      {tmpl.options.length > 3 && (
                        <span className="text-xs font-medium text-[var(--text-faint)] self-center">
                          +{tmpl.options.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                      <span>Şablonu istifadə et</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-8 flex flex-col gap-5">
          <h2 className="font-serif text-xs font-semibold text-[var(--text-muted)] text-center uppercase tracking-wider">
            3 Sadə Addımda Qərar Verin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[var(--accent-faint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">1</div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-1">
                  Mövzunu təyin et
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Həll etmək istədiyiniz məsələni və ya sualı qeyd edin.
                </p>
              </div>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[var(--accent-faint)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">2</div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-1">
                  Variantları sırala
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Ağlınızdakı seçimləri əlavə edin, xal və üstünlüklər qeyd edin.
                </p>
              </div>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-[var(--result-faint)] text-[var(--result)] flex items-center justify-center font-bold text-xs shrink-0">3</div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text)] mb-1">
                  Qərarını təsdiqlə
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Ən uyğun variantı seçərək tamamlayın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}