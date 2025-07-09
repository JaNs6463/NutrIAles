import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, TrendingUp, Clock, Utensils, Calculator, Globe, RefreshCw, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/App';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Nutrition = () => {
  const { toast } = useToast();
  const { addMealToDashboard } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webResults, setWebResults] = useState([]);
  
  const GEMINI_API_KEY = 'AIzaSyD1pDNBeS6fN32pnxam_Uc7xRnXXBke1eU';

  const initialFoodDatabase = [
    { id: 1, name: 'Avena con frutas', calories: 320, protein: 12, carbs: 54, fat: 8, image: 'A vibrant bowl of oatmeal with fresh berries and nuts' },
    { id: 2, name: 'Pollo a la plancha', calories: 185, protein: 35, carbs: 0, fat: 4, image: 'Grilled chicken breast with a side of quinoa and steamed broccoli' },
    { id: 3, name: 'Ensalada César', calories: 280, protein: 8, carbs: 12, fat: 24, image: 'Classic Caesar salad with croutons and parmesan cheese' },
    { id: 4, name: 'Yogur griego con miel', calories: 150, protein: 15, carbs: 18, fat: 4, image: 'A bowl of creamy Greek yogurt with honey and walnuts' },
    { id: 5, name: 'Salmón al horno', calories: 206, protein: 28, carbs: 0, fat: 9, image: 'Baked salmon fillet with a lemon wedge and fresh dill' },
    { id: 6, name: 'Quinoa con verduras', calories: 220, protein: 8, carbs: 39, fat: 4, image: 'A colorful bowl of quinoa mixed with roasted vegetables' },
    { id: 7, name: 'Tostada de aguacate', calories: 250, protein: 7, carbs: 25, fat: 15, image: 'Sourdough toast topped with mashed avocado, chili flakes and a fried egg' },
    { id: 8, name: 'Batido de Proteínas', calories: 300, protein: 30, carbs: 20, fat: 12, image: 'A chocolate protein shake in a glass, garnished with a strawberry' },
    { id: 9, name: 'Lentejas estofadas', calories: 350, protein: 18, carbs: 60, fat: 5, image: 'A hearty bowl of lentil stew with carrots and celery' }
  ];
  const [foodDatabase, setFoodDatabase] = useState(initialFoodDatabase);
  
  const initialMealPlans = [
    { id: 1, name: 'Plan Mediterráneo', description: 'Rico en pescado, aceite de oliva y vegetales frescos.', calories: 1800, duration: '7 días', difficulty: 'Fácil', meals: ['Salmón al horno', 'Ensalada César', 'Yogur griego con miel'] },
    { id: 2, name: 'Plan Proteico', description: 'Alto contenido en proteínas para desarrollo muscular.', calories: 2200, duration: '14 días', difficulty: 'Intermedio', meals: ['Pollo a la plancha', 'Batido de Proteínas', 'Lentejas estofadas'] },
    { id: 3, name: 'Plan Vegano', description: 'Completamente basado en plantas y balanceado.', calories: 1900, duration: '21 días', difficulty: 'Avanzado', meals: ['Quinoa con verduras', 'Tostada de aguacate', 'Avena con frutas'] }
  ];
  const [mealPlans, setMealPlans] = useState(initialMealPlans);

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddFood = (food) => {
    addMealToDashboard(food, 'lunch');
    toast({
        title: "¡Alimento añadido!",
        description: `${food.name} ha sido agregado a tu dashboard.`,
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white dark:text-white"
    });
  };

  const handleWebSearch = async () => {
    if (!searchTerm.trim()) {
        toast({ title: "Búsqueda vacía", description: "Escribe algo para buscar en la web.", variant: "destructive" });
        return;
    }
    setIsSearchingWeb(true);
    setWebResults([]);
    try {
        const prompt = `Busca información nutricional para "${searchTerm}". Devuelve una lista de hasta 3 platillos en formato JSON. Cada objeto debe tener: id (único), name (string), calories (number), protein (number), carbs (number), fat (number), y image (una descripción breve para un generador de imágenes). Ejemplo: [{"id": 1, "name": "Pizza", ...}]`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        let jsonString = data.candidates[0].content.parts[0].text;
        jsonString = jsonString.replace(/```json\n?/, '').replace(/```$/, '');
        const results = JSON.parse(jsonString);
        setWebResults(results);
    } catch (error) {
        console.error("Error en búsqueda web:", error);
        toast({ title: "Error de búsqueda", description: "No se pudieron obtener resultados. Intenta de nuevo.", variant: "destructive" });
    } finally {
        setIsSearchingWeb(false);
    }
  };

  const FoodCard = ({ food, isWebResult = false }) => (
    <motion.div
      className="bg-card rounded-2xl overflow-hidden shadow-lg border hover:shadow-xl transition-all flex flex-col"
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <div className="h-40 w-full overflow-hidden">
        <img  class="w-full h-full object-cover" alt={food.name} src="https://images.unsplash.com/photo-1541175990144-931bc5d2ff38" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-card-foreground text-lg mb-2">{food.name}</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 flex-grow">
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Calorías</span> <span className="font-bold text-orange-500">{food.calories} kcal</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Proteína</span> <span className="font-bold text-sky-500">{food.protein}g</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Carbos</span> <span className="font-bold text-lime-500">{food.carbs}g</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">Grasas</span> <span className="font-bold text-violet-500">{food.fat}g</span></div>
        </div>
        <Button onClick={() => handleAddFood(food)} className="w-full mt-auto bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> {isWebResult ? 'Añadir a mi registro' : 'Añadir'}
        </Button>
      </div>
    </motion.div>
  );

  const PlanCard = ({ plan }) => (
    <Collapsible className="bg-gradient-to-br from-card to-purple-50/20 dark:to-purple-500/10 rounded-2xl shadow-lg border hover:shadow-xl transition-all">
      <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
            </div>
            <div className="text-right"><span className="inline-block px-3 py-1 bg-purple-100 text-primary dark:bg-purple-500/20 dark:text-purple-300 rounded-full text-xs font-medium">{plan.difficulty}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2"><TrendingUp className="w-4 h-4 text-orange-500" /><span className="text-sm text-muted-foreground">{plan.calories} kcal/día</span></div>
            <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-blue-500" /><span className="text-sm text-muted-foreground">{plan.duration}</span></div>
          </div>
           <CollapsibleTrigger className="w-full text-primary font-semibold text-sm flex items-center justify-center py-2">Ver Comidas <ChevronDown className="w-4 h-4 ml-2 transform transition-transform ui-open:rotate-180" /></CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="px-6 pb-6 space-y-2">
            {plan.meals.map(mealName => (
                <div key={mealName} className="p-2 bg-background/50 dark:bg-slate-800/30 rounded-md text-sm text-muted-foreground">{mealName}</div>
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">Centro Nutricional</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Descubre alimentos, crea planes y alcanza tus objetivos.</p>
      </motion.div>

      <Tabs defaultValue="foods" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card rounded-xl p-1 border">
          <TabsTrigger value="foods"><Utensils className="w-4 h-4 mr-2" />Alimentos</TabsTrigger>
          <TabsTrigger value="plans"><Calculator className="w-4 h-4 mr-2" />Planes</TabsTrigger>
          <TabsTrigger value="tracker"><TrendingUp className="w-4 h-4 mr-2" />Seguimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="foods" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-lg border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative"><Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" /><Input placeholder="Buscar alimentos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleWebSearch()} className="pl-10 bg-background focus:border-primary" /></div>
              <Button onClick={handleWebSearch} variant="outline" className="text-primary hover:bg-purple-50 hover:text-primary dark:hover:bg-purple-500/10">
                {isSearchingWeb ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}Buscar en la Web
              </Button>
            </div>
          </motion.div>
          <AnimatePresence>
          {webResults.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Resultados de la Web</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {webResults.map((food, index) => (
                        <motion.div key={food.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}><FoodCard food={food} isWebResult={true} /></motion.div>
                    ))}
                </div>
            </motion.div>
          )}
          </AnimatePresence>
          
          <h2 className="text-2xl font-bold text-foreground pt-4 border-t border-border">En nuestra base de datos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food, index) => (
              <motion.div key={food.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}><FoodCard food={food} /></motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-end">
              <Button onClick={() => toast({ title: "🚧 ¡Función en construcción!", description: "Puedes solicitarla en tu próximo mensaje! 🚀"})} variant="outline" className="text-primary hover:bg-purple-50 hover:text-primary dark:hover:bg-purple-500/10"><RefreshCw className="w-4 h-4 mr-2"/>Actualizar Planes</Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mealPlans.map((plan, index) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}><PlanCard plan={plan} /></motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-8 shadow-lg border text-center">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Seguimiento Avanzado</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Monitorea tu progreso con gráficos detallados y análisis personalizados.</p>
            <Button onClick={() => toast({ title: "🚧 ¡Función en construcción!", description: "Puedes solicitarla en tu próximo mensaje! 🚀" })} className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">Ver Análisis Completo</Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;