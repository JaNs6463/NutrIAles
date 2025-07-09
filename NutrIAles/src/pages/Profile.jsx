import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Target, TrendingUp, Award, Calendar, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    age: 28,
    height: 165,
    weight: 62,
    activityLevel: 'Moderadamente activo',
    goal: 'Mantener peso',
    targetCalories: 2200,
    targetProtein: 120,
    targetCarbs: 275,
    targetFat: 85
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const achievements = [
    { id: 1, title: 'Primera semana completada', description: 'Registraste tus comidas durante 7 días consecutivos', icon: '🎯', earned: true },
    { id: 2, title: 'Hidratación perfecta', description: 'Alcanzaste tu objetivo de agua durante 5 días', icon: '💧', earned: true },
    { id: 3, title: 'Explorador nutricional', description: 'Probaste 10 alimentos nuevos este mes', icon: '🌟', earned: false },
    { id: 4, title: 'Maestro de macros', description: 'Mantuviste el balance de macronutrientes por 14 días', icon: '⚖️', earned: false }
  ];

  const stats = [
    { label: 'Días activos', value: '23', change: '+5', color: 'text-emerald-600' },
    { label: 'Peso promedio', value: '62 kg', change: '-0.5', color: 'text-blue-600' },
    { label: 'Calorías promedio', value: '2,180', change: '+120', color: 'text-orange-600' },
    { label: 'Objetivos cumplidos', value: '85%', change: '+12%', color: 'text-purple-600' }
  ];

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    toast({
      title: "¡Perfil actualizado!",
      description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Mi Perfil
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gestiona tu información personal y monitorea tu progreso nutricional
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
                  <p className="text-gray-600">Actualiza tus datos básicos</p>
                </div>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`${
                  isEditing 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                }`}
              >
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Guardar' : 'Editar'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="bg-white/70 border-emerald-200 focus:border-emerald-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="bg-white/70 border-emerald-200 focus:border-emerald-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                {isEditing ? (
                  <Input
                    id="age"
                    type="number"
                    value={editedProfile.age}
                    onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                    className="bg-white/70 border-emerald-200 focus:border-emerald-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.age} años</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                {isEditing ? (
                  <Input
                    id="height"
                    type="number"
                    value={editedProfile.height}
                    onChange={(e) => setEditedProfile({ ...editedProfile, height: parseInt(e.target.value) })}
                    className="bg-white/70 border-emerald-200 focus:border-emerald-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.height} cm</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                {isEditing ? (
                  <Input
                    id="weight"
                    type="number"
                    value={editedProfile.weight}
                    onChange={(e) => setEditedProfile({ ...editedProfile, weight: parseInt(e.target.value) })}
                    className="bg-white/70 border-emerald-200 focus:border-emerald-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.weight} kg</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo</Label>
                {isEditing ? (
                  <Input
                    id="goal"
                    value={editedProfile.goal}
                    onChange={(e) => setEditedProfile({ ...editedProfile, goal: e.target.value })}
                    className="bg-white/70 border-emerald-200 focus:border-emerald-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{profile.goal}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </motion.div>

          {/* Nutrition Goals */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Objetivos Nutricionales</h3>
                <p className="text-gray-600">Metas diarias personalizadas</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <p className="text-2xl font-bold text-orange-600">{profile.targetCalories}</p>
                <p className="text-sm text-gray-600">Calorías</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-2xl font-bold text-blue-600">{profile.targetProtein}g</p>
                <p className="text-sm text-gray-600">Proteínas</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <p className="text-2xl font-bold text-green-600">{profile.targetCarbs}g</p>
                <p className="text-sm text-gray-600">Carbohidratos</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <p className="text-2xl font-bold text-purple-600">{profile.targetFat}g</p>
                <p className="text-sm text-gray-600">Grasas</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Estadísticas</h3>
                <p className="text-gray-600">Últimos 30 días</p>
              </div>
            </div>

            <div className="space-y-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                >
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Logros</h3>
                <p className="text-gray-600">Tus conquistas</p>
              </div>
            </div>

            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${achievement.earned ? 'text-gray-800' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;