import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard.jsx';
import Nutrition from '@/pages/Nutrition.jsx';
import AIChat from '@/pages/AIChat.jsx';
import Profile from '@/pages/Profile.jsx';
import Login from '@/pages/Login.jsx';
import { Toaster } from '@/components/ui/toaster';

const AppStateContext = React.createContext();

export const useAppState = () => {
  const context = React.useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const persistedValue = localStorage.getItem(key);
            return persistedValue !== null ? JSON.parse(persistedValue) : defaultValue;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = usePersistedState('theme', 'light');

  const [stats, setStats] = usePersistedState('app-stats', {
    calories: { consumed: 0, target: 2200 },
    protein: { consumed: 0, target: 120 },
    carbs: { consumed: 0, target: 275 },
    fat: { consumed: 0, target: 85 },
  });

  const [meals, setMeals] = usePersistedState('app-meals', {
    breakfast: [
      { id: 101, name: 'Tostada de Aguacate', calories: 250, image: 'Avocado toast with a sunny side up egg on top' },
      { id: 102, name: 'Avena con frutas', calories: 200, image: 'A vibrant bowl of oatmeal with fresh berries and nuts' },
    ],
    lunch: [
      { id: 201, name: 'Ensalada César con Pollo', calories: 450, image: 'Grilled chicken caesar salad with croutons and parmesan' },
      { id: 202, name: 'Quinoa con verduras', calories: 230, image: 'Colorful quinoa salad with roasted vegetables' },
    ],
    snack: [
      { id: 301, name: 'Yogur Griego', calories: 150, image: 'Creamy greek yogurt with a swirl of honey and walnuts' },
      { id: 302, name: 'Manzana y Mantequilla de Maní', calories: 70, image: 'Crisp apple slices with a side of peanut butter' }
    ],
    dinner: [
        { id: 401, name: 'Salmón al Horno con Espárragos', calories: 380, image: 'Baked salmon with lemon and asparagus' },
    ],
  });
  
  const [aiChatMessages, setAiChatMessages] = usePersistedState('ai-chat-messages', [
    { id: 1, type: 'ai', content: '¡Hola! Soy tu asistente nutricional. ¿Qué has comido hoy? Sube una foto o descríbelo y lo analizaré por ti.', timestamp: new Date() }
  ]);

  useEffect(() => {
    const totalCalories = Object.values(meals).flat().reduce((sum, meal) => sum + meal.calories, 0);
    setStats(prev => ({ ...prev, calories: { ...prev.calories, consumed: totalCalories } }));
  }, [meals]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addMealToDashboard = (meal, mealType = 'lunch') => {
    const newMeal = { ...meal, id: Date.now() };
    setMeals(prev => ({
        ...prev,
        [mealType]: [...prev[mealType], newMeal]
    }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'nutrition':
        return <Nutrition />;
      case 'ai-chat':
        return <AIChat messages={aiChatMessages} setMessages={setAiChatMessages} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={theme}>
        <Helmet>
          <title>NutriAI - Iniciar Sesión</title>
          <meta name="description" content="Inicia sesión para acceder a tu asistente nutricional inteligente." />
        </Helmet>
        <Login setIsAuthenticated={setIsAuthenticated} />
        <Toaster />
      </div>
    );
  }

  return (
    <AppStateContext.Provider value={{ stats, setStats, meals, setMeals, addMealToDashboard, theme, toggleTheme }}>
       <div className={theme}>
        <Helmet>
            <title>NutriAI - Tu Asistente Nutricional Inteligente</title>
            <meta name="description" content="Aplicación completa de nutrición con IA especializada para análisis de alimentos y seguimiento nutricional personalizado." />
            <link rel="icon" type="image/webp" href="https://storage.googleapis.com/hostinger-horizons-assets-prod/1585a159-4796-40a4-95da-e75fbb29650e/35d14fd5aa186fad9e1c0716973049a7.webp" />
        </Helmet>
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated}>
            {renderPage()}
        </Layout>
        <Toaster />
       </div>
    </AppStateContext.Provider>
  );
}

export default App;