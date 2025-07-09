import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, User, Lock, Mail, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = ({ setIsAuthenticated }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Jans' && password === '123') {
      toast({
        title: "¡Bienvenido de vuelta, Jans!",
        description: "Iniciando sesión en tu paraíso nutricional.",
      });
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleFeatureNotImplemented = () => {
    toast({
      title: "🚧 ¡Función en construcción!",
      description: "Esta característica aún no está implementada, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center auth-gradient-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <motion.div
              className="inline-block"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <Apple className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bienvenido a NutriAI
            </h1>
            <p className="text-gray-600">Tu asistente nutricional inteligente</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
              <TabsTrigger value="reset">Reestablecer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <Input id="username" type="text" placeholder="Tu nombre de usuario" className="pl-10" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                   <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full auth-gradient-bg text-white hover:opacity-90">
                  Acceder
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <div className="space-y-4 text-center">
                 <p className="text-gray-600">Formulario de registro no implementado.</p>
                 <Button onClick={handleFeatureNotImplemented} className="w-full auth-gradient-bg text-white hover:opacity-90">
                    Solicitar Registro
                 </Button>
              </div>
            </TabsContent>

             <TabsContent value="reset" className="mt-6">
              <div className="space-y-4">
                 <p className="text-gray-600 text-center">Introduce tu email para reestablecer la contraseña.</p>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                      <Input id="reset-email" type="email" placeholder="tu@email.com" className="pl-10"/>
                    </div>
                  </div>
                 <Button onClick={handleFeatureNotImplemented} className="w-full auth-gradient-bg text-white hover:opacity-90">
                    Enviar Enlace
                 </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;