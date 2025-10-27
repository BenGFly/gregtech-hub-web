'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import { FaUsers, FaPlus, FaTrash, FaGamepad, FaTasks, FaTrophy, FaCrown, FaEdit } from 'react-icons/fa';
import { GiNuclearWaste } from 'react-icons/gi';

interface User {
  id: string;
  username: string;
  minecraftUUID: string;
  _count?: {
    tasks: number;
    questProgress: number;
  };
}

export default function TeamPage() {
  const [showAddMember, setShowAddMember] = useState(false);
  const { data: users, refetch } = trpc.user.getAll.useQuery();

  return (
    <main className="min-h-screen animated-bg grid-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 neon-text bg-gradient-to-r from-gtnh-purple to-gtnh-orange bg-clip-text text-transparent">
              Gestión de Equipo
            </h1>
            <p className="text-gray-400">Colabora con tu equipo en GTNH</p>
          </div>
          <button
            onClick={() => setShowAddMember(true)}
            className="glass px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gtnh-purple/20 transition-all border-2 border-gtnh-purple text-gtnh-purple hover:text-white hover:bg-gtnh-purple font-semibold transform hover:scale-105"
          >
            <FaPlus /> Agregar Miembro
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FaUsers />}
            label="Miembros Totales"
            value={users?.length || 0}
            color="purple"
          />
          <StatCard
            icon={<FaTasks />}
            label="Tareas Activas"
            value={users?.reduce((sum, u) => sum + (u._count?.tasks || 0), 0) || 0}
            color="blue"
          />
          <StatCard
            icon={<FaTrophy />}
            label="Quests Completadas"
            value={users?.reduce((sum, u) => sum + (u._count?.questProgress || 0), 0) || 0}
            color="green"
          />
          <StatCard
            icon={<GiNuclearWaste />}
            label="Progreso Global"
            value="0%"
            color="orange"
          />
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users && users.length > 0 ? (
            users.map((user) => <MemberCard key={user.id} user={user} onUpdate={refetch} />)
          ) : (
            <div className="col-span-full glass rounded-xl p-12 text-center">
              <GiNuclearWaste className="text-6xl text-gtnh-purple mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Sin miembros en el equipo</h3>
              <p className="text-gray-500 mb-6">Agrega el primer miembro para comenzar</p>
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-gradient-to-r from-gtnh-purple to-gtnh-green text-white px-6 py-3 rounded-lg hover:opacity-80 transition-opacity font-semibold"
              >
                <FaPlus className="inline mr-2" /> Agregar Miembro
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSuccess={() => {
            refetch();
            setShowAddMember(false);
          }}
        />
      )}
    </main>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colors = {
    purple: 'from-gtnh-purple to-purple-400',
    blue: 'from-blue-500 to-blue-400',
    green: 'from-gtnh-green to-green-400',
    orange: 'from-gtnh-orange to-orange-400',
  };

  return (
    <div className="glass rounded-xl p-6 card-hover">
      <div className={`text-3xl mb-3 bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

interface MemberCardProps {
  user: User;
  onUpdate: () => void;
}

function MemberCard({ user, onUpdate }: MemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteMutation = trpc.user.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDelete = async () => {
    if (confirm(`¿Eliminar a ${user.username} del equipo?`)) {
      await deleteMutation.mutateAsync({ id: user.id });
      utils.user.getAll.invalidate();
      onUpdate();
    }
  };

  return (
    <div className="glass rounded-xl p-6 card-hover border border-gtnh-purple/30 hover:border-gtnh-purple/50 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <FaGamepad className="text-9xl text-gtnh-purple" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gtnh-purple to-gtnh-green flex items-center justify-center text-white font-bold text-xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {user.username}
                <FaCrown className="text-gtnh-orange text-sm" />
              </h3>
              <p className="text-xs text-gray-500 font-mono">{user.minecraftUUID.slice(0, 8)}...</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gtnh-purple hover:text-gtnh-orange transition-colors p-2"
              title="Editar"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-600 transition-colors p-2"
              title="Eliminar"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gtnh-purple/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-gtnh-purple mb-1">
              {user._count?.tasks || 0}
            </div>
            <div className="text-xs text-gray-400">Tareas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gtnh-green mb-1">
              {user._count?.questProgress || 0}
            </div>
            <div className="text-xs text-gray-400">Quests</div>
          </div>
        </div>

        {/* Activity Badge */}
        <div className="mt-4 pt-4 border-t border-gtnh-purple/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Estado</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gtnh-green rounded-full animate-pulse"></span>
              <span className="text-gtnh-green font-semibold">Activo</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddMemberModal({ onClose, onSuccess }: AddMemberModalProps) {
  const [username, setUsername] = useState('');
  const [minecraftUUID, setMinecraftUUID] = useState('');

  const createMutation = trpc.user.getOrCreate.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !minecraftUUID.trim()) return;
    
    createMutation.mutate({
      username: username.trim(),
      minecraftUUID: minecraftUUID.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-gtnh-purple shadow-gtnh-lg">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-3xl text-gtnh-purple" />
          <h2 className="text-3xl font-bold neon-text text-gtnh-purple">Agregar Miembro</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Nombre de Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gtnh-purple/30 rounded-lg bg-gtnh-darker text-white focus:border-gtnh-purple focus:outline-none"
              required
              placeholder="Ej: Steve"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              UUID de Minecraft
            </label>
            <input
              type="text"
              value={minecraftUUID}
              onChange={(e) => setMinecraftUUID(e.target.value)}
              className="w-full px-4 py-2 border border-gtnh-purple/30 rounded-lg bg-gtnh-darker text-white focus:border-gtnh-purple focus:outline-none font-mono text-sm"
              required
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usa <code className="bg-gtnh-darker px-1 py-0.5 rounded">/uuid</code> en el juego
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-gradient-to-r from-gtnh-purple to-gtnh-green text-white py-3 rounded-lg hover:opacity-80 transition-opacity font-bold disabled:opacity-50"
            >
              {createMutation.isPending ? 'Agregando...' : 'Agregar Miembro'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gtnh-darker border border-gtnh-purple/30 text-gray-300 py-3 rounded-lg hover:bg-gtnh-purple/20 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
