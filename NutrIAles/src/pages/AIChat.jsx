import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Camera, Image, Bot, User, Loader2, Sparkles, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/App';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AIChat = ({ messages, setMessages }) => {
  const { toast } = useToast();
  const { addMealToDashboard } = useAppState();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const GEMINI_API_KEY = 'AIzaSyD1pDNBeS6fN32pnxam_Uc7xRnXXBke1eU';

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const parseFoodInfo = (text) => {
    const nameMatch = text.match(/\*\*Platillo:\*\*\s*(.+)/);
    const caloriesMatch = text.match(/\*\*Calorías Estimadas:\*\*\s*(\d+)/);
    return {
      name: nameMatch ? nameMatch[1].trim() : "Platillo analizado",
      calories: caloriesMatch ? parseInt(caloriesMatch[1], 10) : 0,
    };
  };
  
  const handleClearChat = () => {
    setMessages([
        { id: 1, type: 'ai', content: '¡Hola! Soy tu asistente nutricional. ¿Necesitas ayuda con algo más?', timestamp: new Date() }
    ]);
    toast({
        title: "Chat limpiado",
        description: "La conversación ha sido reiniciada."
    })
  }

  const processAIResponse = async (prompt, imageBase64 = null) => {
    const contents = [{ parts: [{ text: prompt }] }];
    if (imageBase64) {
      contents[0].parts.push({ inline_data: { mime_type: "image/jpeg", data: imageBase64 } });
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error('Respuesta inválida de la IA');
    } catch (error) {
      console.error('Error en API de IA:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userMessage = { id: Date.now(), type: 'user', content: inputMessage, image: selectedImage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let aiResponse;
      let prompt;
      let imageBase64 = null;

      if (selectedImage) {
        imageBase64 = selectedImage.split(',')[1];
        prompt = `Analiza esta imagen de comida. Proporciona:
**Platillo:** [Nombre del platillo]
**Calorías Estimadas:** [Número] kcal
**Análisis Nutricional:**
*   **Proteínas:** [Descripción]
*   **Carbohidratos:** [Descripción]
*   **Grasas:** [Descripción]
**Sugerencias:** [Consejos para mejorar o complementar]
También, pregunta si el usuario desea añadirlo a su registro de comidas. Responde en español, usando markdown para negritas en los títulos.`;
      } else {
        prompt = `Responde a la siguiente pregunta sobre nutrición de manera amigable y experta. Usa markdown para negritas en los títulos. Pregunta: "${inputMessage}"`;
      }
      
      aiResponse = await processAIResponse(prompt, imageBase64);
      const foodInfo = parseFoodInfo(aiResponse);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        foodInfo: foodInfo.calories > 0 ? foodInfo : null
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar tu mensaje. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };
  
  const handleAddMealFromAI = (foodInfo) => {
    addMealToDashboard({ ...foodInfo, image: 'AI generated meal analysis icon' }, 'lunch');
    toast({
        title: "¡Platillo añadido!",
        description: `${foodInfo.name} ha sido registrado en tu dashboard.`,
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const MessageBubble = ({ message }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-3 max-w-xs md:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-md ${message.type === 'user' ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-gradient-to-br from-blue-500 to-cyan-400'}`}>
          {message.type === 'user' ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
        </div>
        <div className={`rounded-2xl p-4 shadow-lg ${message.type === 'user' ? 'chat-bubble-user text-white' : 'bg-card text-card-foreground border'}`}>
          {message.image && <img src={message.image} alt="Uploaded food" className="rounded-lg mb-3 max-w-full h-auto max-h-48 object-cover" />}
          <div className="prose prose-sm max-w-none text-inherit dark:prose-invert" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
          {message.foodInfo && (
            <div className="mt-4 pt-3 border-t border-t-gray-300/50 dark:border-t-slate-600/50">
                <p className="text-sm font-semibold mb-2 text-inherit">¿Añadir al dashboard?</p>
                <Button size="sm" onClick={() => handleAddMealFromAI(message.foodInfo)} className="bg-green-500 hover:bg-green-600 text-white w-full">
                    <Check className="w-4 h-4 mr-2"/> Sí, añadir ({message.foodInfo.calories} kcal)
                </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-lg border">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg"><Sparkles className="w-6 h-6 text-white" /></div>
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Asistente Nutricional IA</h1>
                <p className="text-muted-foreground">Analiza tus comidas con una foto.</p>
            </div>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon"><Trash2 className="w-5 h-5" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>¿Limpiar el chat?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción borrará permanentemente el historial de la conversación actual. ¿Estás seguro?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChat}>Limpiar Chat</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </motion.div>

      <div ref={chatContainerRef} className="flex-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-4 md:p-6 shadow-inner border overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-4">
            <div className="flex items-start space-x-3"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400"><Sparkles className="w-5 h-5 text-white" /></div><div className="bg-card rounded-2xl p-4 shadow-lg border"><div className="flex items-center space-x-2 text-card-foreground"><Loader2 className="w-4 h-4 animate-spin text-primary" /><span>Analizando...</span></div></div></div>
          </motion.div>
        )}
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-lg border">
        {selectedImage && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 relative">
            <img src={selectedImage} alt="Preview" className="rounded-lg max-h-24" />
            <Button size="icon" variant="ghost" onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-card/70 rounded-full h-7 w-7"><X className="w-4 h-4 text-muted-foreground" /></Button>
          </motion.div>
        )}
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="ghost" onClick={() => cameraInputRef.current.click()}><Camera className="w-5 h-5 text-muted-foreground" /></Button>
          <Button size="icon" variant="ghost" onClick={() => fileInputRef.current.click()}><Image className="w-5 h-5 text-muted-foreground" /></Button>
          <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Añade un comentario o pregunta algo..." onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} disabled={isLoading} className="bg-background" />
          <Button onClick={handleSendMessage} disabled={isLoading || (!inputMessage.trim() && !selectedImage)} className="bg-gradient-to-r from-primary to-secondary text-white"><Send className="w-5 h-5" /></Button>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
    </div>
  );
};

export default AIChat;