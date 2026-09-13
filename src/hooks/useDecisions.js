import { useReducer, useEffect } from 'react';

const uid = () => crypto.randomUUID();
const STORAGE_KEY = 'qerar_taxtasi_v1';

const createDefaultScholarshipDecision = () => {
  const [opt1, opt2, opt3] = [uid(), uid(), uid()];
  return {
    id: uid(),
    topic: 'Neçə faiz təqaüd qazana biləcəm?',
    options: [
      { id: opt1, label: '100%', score: 10, pros: ['Tam təqaüd şansı', '100% təhsil haqqı güzəşti'], cons: [] },
      { id: opt2, label: '100%', score: 10, pros: ['Əlaçı təqaüdü'], cons: [] },
      { id: opt3, label: '100%', score: 10, pros: ['Maksimum nəticə'], cons: [] },
    ],
    selectedOptionId: opt1,
    createdAt: Date.now() - 1000 * 60 * 30,
    resolvedAt: Date.now() - 1000 * 60 * 20,
  };
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const decisions = parsed?.decisions || [];

    const index = decisions.findIndex(d => 
      d.topic?.toLowerCase().includes('təqaüd') || d.topic?.toLowerCase().includes('teqaud')
    );

    let defaultDecision;
    if (index === -1) {
      defaultDecision = createDefaultScholarshipDecision();
    } else {
      defaultDecision = decisions[index];
      decisions.splice(index, 1);
    }

    if (!defaultDecision.selectedOptionId && defaultDecision.options?.length > 0) {
      defaultDecision.selectedOptionId = defaultDecision.options[0].id;
      defaultDecision.resolvedAt = defaultDecision.resolvedAt || Date.now();
    }

    return { decisions: [...decisions, defaultDecision], activeId: parsed?.activeId || null };
  } catch {
    return { decisions: [createDefaultScholarshipDecision()], activeId: null };
  }
};

const save = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'CREATE_DECISION': {
      const newDecision = {
        id: uid(),
        topic: payload.trim(),
        options: [],
        selectedOptionId: null,
        createdAt: Date.now(),
        resolvedAt: null,
      };
      return { decisions: [newDecision, ...state.decisions], activeId: newDecision.id };
    }

    case 'CREATE_DECISION_WITH_OPTIONS': {
      const options = (payload.options || []).map(label => ({
        id: uid(), label: label.trim(), score: 0, pros: [], cons: []
      }));
      const defIdx = payload.defaultSelectedIndex;
      const selectedId = (typeof defIdx === 'number' && defIdx >= 0 && defIdx < options.length) 
        ? options[defIdx].id 
        : null;

      const newDecision = {
        id: uid(),
        topic: payload.topic.trim(),
        options,
        selectedOptionId: selectedId,
        createdAt: Date.now(),
        resolvedAt: selectedId ? Date.now() : null,
      };
      return { decisions: [newDecision, ...state.decisions], activeId: newDecision.id };
    }

    case 'DELETE_DECISION': {
      const filtered = state.decisions.filter(d => d.id !== payload);
      return {
        decisions: filtered,
        activeId: state.activeId === payload ? (filtered[0]?.id || null) : state.activeId,
      };
    }

    case 'SET_ACTIVE':
      return { ...state, activeId: payload };

    case 'ADD_OPTION':
      return {
        ...state,
        decisions: state.decisions.map(d => d.id === payload.decisionId ? {
          ...d, options: [...d.options, { id: uid(), label: payload.label.trim(), score: 0, pros: [], cons: [] }]
        } : d),
      };

    case 'DELETE_OPTION':
      return {
        ...state,
        decisions: state.decisions.map(d => {
          if (d.id !== payload.decisionId) return d;
          const isSelected = d.selectedOptionId === payload.optionId;
          return {
            ...d,
            options: d.options.filter(o => o.id !== payload.optionId),
            selectedOptionId: isSelected ? null : d.selectedOptionId,
            resolvedAt: isSelected ? null : d.resolvedAt,
          };
        }),
      };

    case 'SELECT_OPTION':
      return {
        ...state,
        decisions: state.decisions.map(d => {
          if (d.id !== payload.decisionId) return d;
          const isSelected = d.selectedOptionId === payload.optionId;
          return {
            ...d,
            selectedOptionId: isSelected ? null : payload.optionId,
            resolvedAt: isSelected ? null : Date.now(),
          };
        }),
      };

    case 'REORDER_OPTIONS':
      return {
        ...state,
        decisions: state.decisions.map(d => {
          if (d.id !== payload.decisionId) return d;
          const options = [...d.options];
          const [moved] = options.splice(payload.sourceIndex, 1);
          options.splice(payload.destinationIndex, 0, moved);
          return { ...d, options };
        }),
      };

    case 'UPDATE_OPTION_SCORE':
      return {
        ...state,
        decisions: state.decisions.map(d => {
          if (d.id !== payload.decisionId) return d;
          return {
            ...d,
            options: d.options.map(o => o.id === payload.optionId ? { 
              ...o, score: o.score === payload.score ? 0 : payload.score 
            } : o),
          };
        }),
      };

    case 'ADD_OPTION_PRO_CON': {
      if (!payload.text?.trim()) return state;
      const field = payload.type === 'pro' ? 'pros' : 'cons';
      return {
        ...state,
        decisions: state.decisions.map(d => {
          if (d.id !== payload.decisionId) return d;
          return {
            ...d,
            options: d.options.map(o => o.id === payload.optionId ? { 
              ...o, [field]: [...(o[field] || []), payload.text.trim()] 
            } : o),
          };
        }),
      };
    }

    case 'REMOVE_OPTION_PRO_CON': {
      const field = payload.type === 'pro' ? 'pros' : 'cons';
      return {
        ...state,
        decisions: state.decisions.map(d => {
          if (d.id !== payload.decisionId) return d;
          return {
            ...d,
            options: d.options.map(o => o.id === payload.optionId ? { 
              ...o, [field]: (o[field] || []).filter((_, idx) => idx !== payload.index) 
            } : o),
          };
        }),
      };
    }

    case 'RENAME_DECISION':
      return {
        ...state,
        decisions: state.decisions.map(d => d.id === payload.id ? { ...d, topic: payload.topic.trim() } : d),
      };
    default:
      return state;
  }
};

export const useDecisions = () => {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => { save(state); }, [state]);
  const activeDecision = state.decisions.find(d => d.id === state.activeId) || null;
  return { state, activeDecision, dispatch };
};