import { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const isChosen = localStorage.getItem('qerar_theme_chosen');
    return isChosen ? (localStorage.getItem('qerar_theme') || 'light') : 'light';
  });

  const [showThemeModal, setShowThemeModal] = useState(() => {
    return localStorage.getItem('qerar_theme_chosen') !== 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('qerar_theme', theme);
  }, [theme]);

  const confirmTheme = (chosenTheme) => {
    setTheme(chosenTheme);
    localStorage.setItem('qerar_theme', chosenTheme);
    localStorage.setItem('qerar_theme_chosen', 'true');
    setShowThemeModal(false);
  };

  const toggle = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme, showThemeModal, setShowThemeModal, confirmTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => useContext(ThemeCtx);