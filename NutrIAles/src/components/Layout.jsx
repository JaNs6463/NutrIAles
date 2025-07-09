import React from 'react';
import { motion } from 'framer-motion';
import { Home, Apple, MessageCircle, User, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useAppState } from '@/App';

const Layout = ({ children, currentPage, setCurrentPage, setIsAuthenticated }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useAppState();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'nutrition', name: 'Nutrición', icon: Apple },
    { id: 'ai-chat', name: 'IA Nutricional', icon: MessageCircle },
    { id: 'profile', name: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <img  alt="NutriAI app icon" class="w-6 h-6 text-white" src="https://images.unsplash.com/photo-1599639668344-8a9ca2e04651" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NutriAI
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-purple-50 dark:hover:bg-slate-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                );
              })}
               <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-slate-300" />}
               </Button>
               <Button variant="ghost" size="icon" onClick={() => setIsAuthenticated(false)}>
                 <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-primary"/>
               </Button>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-purple-50 dark:hover:bg-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-purple-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700"
              >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="font-medium">Cambiar Tema</span>
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </motion.div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;