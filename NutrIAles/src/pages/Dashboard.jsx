
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, Zap, Droplets, Activity, Calendar, Award, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/App';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Dashboard = () => {
  const { toast } = useToast();
  const { stats, setStats, recentMeals, setRecentMeals } = useAppState();

  const [water, setWater] = useState({ consumed: 6, target: 8 });
  const [lastReset, setLastReset] = useState(new Date().toDateString());

  useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastReset) {
      setStats(prev => ({
        ...prev,
        calories: { ...prev.calories, consumed: 0 },
      }));
      setLastReset(today);
    }
  }, []);

  const addCalories = (caloriesToAdd) => {
    setStats(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        consumed: prev.calories.consumed + caloriesToAdd
      }
    }));
    toast({
      title: "¡Calorías añadidas!",
      description: `Has sumado ${caloriesToAdd} kcal a tu registro diario.`,
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    });
  };

  const StatCard = ({ icon: Icon, title, current, target, unit, gradientFrom, gradientTo }) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    
    return (
      <motion.div
        className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20`}
        whileHover={{ scale: 1.03, y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-gray-700">{Math.round(percentage)}%</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Actual</span>
            <span className="font-semibold">{current.toLocaleString()}{unit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Objetivo</span>
            <span className="font-semibold">{target.toLocaleString()}{unit}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <motion.div
              className={`h-2.5 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  const addWater = () => {
    setWater(prev => ({ ...prev, consumed: Math.min(prev.consumed + 1, prev.target) }));
    toast({
      title: "¡Hidratación registrada!",
      description: "Has añadido 1 vaso de agua a tu registro diario.",
      className: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
    });
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
          ¡Bienvenido, Jans!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Monitorea tu progreso nutricional y mantente en el camino hacia tus objetivos.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Zap} title="Calorías" current={stats.calories.consumed} target={stats.calories.target} unit=" kcal" gradientFrom="from-orange-400" gradientTo="to-red-500" />
        <StatCard icon={Activity} title="Proteínas" current={stats.protein.consumed} target={stats.protein.target} unit="g" gradientFrom="from-sky-400" gradientTo="to-blue-500" />
        <StatCard icon={Target} title="Carbohidratos" current={stats.carbs.consumed} target={stats.carbs.target} unit="g" gradientFrom="from-lime-400" gradientTo="to-green-500" />
        <StatCard icon={TrendingUp} title="Grasas" current={stats.fat.consumed} target={stats.fat.target} unit="g" gradientFrom="from-violet-400" gradientTo="to-purple-500" />
        
        <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20" whileHover={{ scale: 1.03, y: -5 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 text-white"><Droplets className="w-6 h-6" /></div>
            <Button onClick={addWater} size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"><Plus className="w-4 h-4 mr-1" /> Añadir</Button>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hidratación</h3>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} className={`w-6 h-8 rounded-t-md rounded-b-lg border-2 ${i < water.consumed ? 'bg-gradient-to-t from-cyan-300 to-blue-400 border-cyan-300' : 'border-gray-300 bg-gray-100'}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">{water.consumed} de {water.target} vasos</p>
        </motion.div>

        <motion.div className="bg-gradient-to-br from-amber-300 to-yellow-500 rounded-2xl p-6 shadow-lg text-white" whileHover={{ scale: 1.03, y: -5 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/20"><Award className="w-6 h-6" /></div>
            <span className="text-sm font-medium">¡Logro!</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Racha de 7 días</h3>
          <p className="text-sm opacity-90">¡Felicidades! Has mantenido tus objetivos nutricionales durante una semana.</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Collapsible defaultOpen className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <CollapsibleTrigger className="w-full p-6 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">Comidas Recientes</h2>
              </div>
              <motion.div whileTap={{ scale: 0.9 }}>
                <ChevronDown className="w-6 h-6 text-gray-600 transform transition-transform ui-open:rotate-180" />
              </motion.div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-6 pb-6 space-y-4">
              <AnimatePresence>
                {recentMeals.map((meal, index) => (
                  <motion.div key={meal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                        <img  class="w-full h-full object-cover" alt={meal.name} src="https://images.unsplash.com/photo-1541175990144-931bc5d2ff38" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{meal.name}</h3>
                        <p className="text-sm text-gray-600">{meal.time}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <p className="font-bold text-primary">{meal.calories} kcal</p>
                       <Button size="icon" className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-10 h-10" onClick={() => addCalories(meal.calories)}>
                          <Plus className="w-5 h-5" />
                       </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
    </div>
  );
};

export default Dashboard;
