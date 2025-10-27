'use client';

import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCube, FaCheck } from 'react-icons/fa';

interface User {
  id: string;
  username: string;
  minecraftUUID: string;
}

interface Material {
  id: string;
  name: string;
  quantity: number;
  obtained: number;
  unit?: string | null;
  itemId?: string | null;
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  questName?: string | null;
  assignedTo?: User | null;
  materials?: Material[];
}

export default function TasksPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Las TASKS son compartidas por todo el equipo (sin filtro de usuario)
  // Todos ven las mismas tareas, pero pueden estar asignadas a diferentes miembros
  const { data: tasks, isLoading, refetch } = trpc.task.getAll.useQuery();
  const { data: users } = trpc.user.getAll.useQuery();

  if (isLoading) {
    return <div className="min-h-screen animated-bg grid-bg p-8 flex items-center justify-center">
      <div className="glass rounded-xl p-8">
        <div className="text-2xl text-white">Cargando tareas...</div>
      </div>
    </div>;
  }

  return (
    <main className="min-h-screen animated-bg grid-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 neon-text bg-gradient-to-r from-gtnh-purple to-gtnh-green bg-clip-text text-transparent">
              Gestión de Tareas
            </h1>
            <p className="text-gray-400">Organiza tus proyectos y materiales de GTNH</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="glass px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gtnh-purple/20 transition-all border-2 border-gtnh-purple text-gtnh-purple hover:text-white hover:bg-gtnh-purple font-semibold transform hover:scale-105"
          >
            <FaPlus /> Nueva Tarea
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TaskColumn title="Por Hacer" status="TODO" tasks={tasks} />
          <TaskColumn title="En Progreso" status="IN_PROGRESS" tasks={tasks} />
          <TaskColumn title="Completadas" status="COMPLETED" tasks={tasks} />
          <TaskColumn title="Bloqueadas" status="BLOCKED" tasks={tasks} />
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          users={users || []}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            refetch();
            setShowCreateModal(false);
          }}
        />
      )}
    </main>
  );
}

interface TaskColumnProps {
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  tasks?: any[];
}

function TaskColumn({ title, status, tasks }: TaskColumnProps) {
  const filteredTasks = tasks?.filter((t: Task) => t.status === status) || [];

  const getColumnColor = () => {
    switch (status) {
      case 'TODO': return { border: 'border-blue-500', bg: 'from-blue-500/20', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' };
      case 'IN_PROGRESS': return { border: 'border-gtnh-orange', bg: 'from-gtnh-orange/20', glow: 'shadow-[0_0_15px_rgba(255,139,77,0.3)]' };
      case 'COMPLETED': return { border: 'border-gtnh-green', bg: 'from-gtnh-green/20', glow: 'shadow-[0_0_15px_rgba(77,255,136,0.3)]' };
      case 'BLOCKED': return { border: 'border-red-500', bg: 'from-red-500/20', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' };
      default: return { border: 'border-gray-500', bg: 'from-gray-500/20', glow: '' };
    }
  };

  const colors = getColumnColor();

  return (
    <div className={`glass border-t-4 ${colors.border} ${colors.glow} rounded-lg p-4 min-h-[500px] bg-gradient-to-b ${colors.bg} to-transparent`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-white">{title}</h2>
        <span className="text-xs bg-gtnh-purple/30 px-2 py-1 rounded-full font-mono">{filteredTasks.length}</span>
      </div>
      <div className="space-y-3">
        {filteredTasks.map((task: any) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      {filteredTasks.length === 0 && (
        <div className="text-gray-500 text-center mt-12 text-sm">
          Sin tareas
        </div>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const [showMaterials, setShowMaterials] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: 1, unit: 'items' });
  
  const deleteMutation = trpc.task.delete.useMutation();
  const addMaterial = trpc.material.addToTask.useMutation();
  const updateMaterial = trpc.material.update.useMutation();
  const deleteMaterial = trpc.material.delete.useMutation();
  const utils = trpc.useUtils();

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const materialProgress = task.materials && task.materials.length > 0
    ? (task.materials.reduce((sum, m) => sum + m.obtained, 0) / 
       task.materials.reduce((sum, m) => sum + m.quantity, 0)) * 100
    : 0;

  const handleAddMaterial = async () => {
    if (!newMaterial.name.trim()) return;
    await addMaterial.mutateAsync({
      taskId: task.id,
      ...newMaterial,
    });
    setNewMaterial({ name: '', quantity: 1, unit: 'items' });
    utils.task.getAll.invalidate();
  };

  const handleUpdateMaterialProgress = async (materialId: string, obtained: number) => {
    await updateMaterial.mutateAsync({
      id: materialId,
      obtained: Math.max(0, obtained),
    });
    utils.task.getAll.invalidate();
  };

  const handleDeleteMaterial = async (materialId: string) => {
    await deleteMaterial.mutateAsync({ id: materialId });
    utils.task.getAll.invalidate();
  };

  return (
    <div className="glass p-4 rounded-lg card-hover border border-gtnh-purple/30 hover:border-gtnh-purple/50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor()}`}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="text-sm text-gray-400 mb-3">
          {task.description}
        </p>
      )}
      
      {/* Material Progress Bar */}
      {task.materials && task.materials.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              <FaCube size={10} /> Materiales
            </span>
            <span className="font-mono font-bold text-gtnh-green">{Math.round(materialProgress)}%</span>
          </div>
          <div className="w-full bg-gtnh-darker rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-gtnh-purple to-gtnh-green h-2 rounded-full transition-all progress-animated"
              style={{ width: `${materialProgress}%` }}
            />
          </div>
        </div>
      )}

      {task.questName && (
        <div className="text-xs text-gtnh-purple bg-gtnh-purple/10 px-2 py-1 rounded mb-2 flex items-center gap-1 border border-gtnh-purple/30">
          <FaCube size={10} />
          Quest: {task.questName}
        </div>
      )}
      
      {task.assignedTo && (
        <div className="text-xs text-gtnh-orange bg-gtnh-orange/10 px-2 py-1 rounded mb-2 flex items-center gap-1 border border-gtnh-orange/30">
          👤 {task.assignedTo.username}
        </div>
      )}
      
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setShowMaterials(!showMaterials)}
          className="text-gtnh-purple hover:text-gtnh-orange text-sm flex items-center gap-1 transition-colors font-semibold"
        >
          <FaCube size={12} />
          {showMaterials ? 'Ocultar' : 'Materiales'} ({task.materials?.length || 0})
        </button>
        <button
          onClick={() => deleteMutation.mutate({ id: task.id })}
          className="text-red-400 hover:text-red-600 text-sm ml-auto transition-colors"
        >
          <FaTrash size={12} />
        </button>
      </div>

      {/* Material List - Expandable */}
      {showMaterials && (
        <div className="mt-3 pt-3 border-t border-gtnh-purple/20 space-y-2">
          {/* Existing Materials */}
          {task.materials && task.materials.length > 0 ? (
            task.materials.map((material) => (
              <div key={material.id} className="flex items-center gap-2 text-xs bg-gtnh-darker/50 p-2 rounded border border-gtnh-purple/20 hover:border-gtnh-purple/40 transition-colors">
                <div className="flex items-center gap-1 min-w-[80px]">
                  <input
                    type="number"
                    value={material.obtained}
                    onChange={(e) => handleUpdateMaterialProgress(material.id, parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-1 border border-gtnh-purple/30 rounded text-center bg-gtnh-dark text-white font-mono text-xs"
                    min="0"
                    max={material.quantity}
                  />
                  <span className="text-gray-500">/</span>
                  <span className="font-bold text-gtnh-orange">{material.quantity}</span>
                </div>
                <span className="text-gray-500 text-xs min-w-[50px]">{material.unit || 'items'}</span>
                <span className="flex-1 text-gray-300 truncate">{material.name}</span>
                <div className="flex items-center gap-2">
                  {material.obtained >= material.quantity && (
                    <FaCheck className="text-gtnh-green" size={12} />
                  )}
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-xs text-center py-2">Sin materiales</p>
          )}

          {/* Add Material Form */}
          <div className="mt-2 pt-2 border-t border-gtnh-purple/10">
            <div className="flex gap-1 items-center">
              <input
                type="text"
                placeholder="Material..."
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
                className="flex-1 px-2 py-1 border border-gtnh-purple/30 rounded text-xs bg-gtnh-dark text-white placeholder-gray-500 focus:border-gtnh-purple focus:outline-none"
              />
              <input
                type="number"
                value={newMaterial.quantity}
                onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) || 1 })}
                className="w-14 px-1 py-1 border border-gtnh-purple/30 rounded text-xs bg-gtnh-dark text-white text-center focus:border-gtnh-purple focus:outline-none"
                min="1"
              />
              <input
                type="text"
                placeholder="Un."
                value={newMaterial.unit}
                onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                className="w-16 px-1 py-1 border border-gtnh-purple/30 rounded text-xs bg-gtnh-dark text-white placeholder-gray-500 focus:border-gtnh-purple focus:outline-none"
              />
              <button
                onClick={handleAddMaterial}
                disabled={!newMaterial.name.trim()}
                className="p-1.5 bg-gradient-to-r from-gtnh-purple to-gtnh-green text-white rounded hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                title="Agregar material"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CreateTaskModalProps {
  users: any[];
  onClose: () => void;
  onSuccess: () => void;
}

function CreateTaskModal({ users, onClose, onSuccess }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [assignedToId, setAssignedToId] = useState<string>('');

  const createMutation = trpc.task.create.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      priority: priority,
      assignedToId: assignedToId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-gtnh-purple shadow-gtnh-lg">
        <h2 className="text-3xl font-bold mb-6 neon-text text-gtnh-purple">Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gtnh-purple/30 rounded-lg bg-gtnh-darker text-white focus:border-gtnh-purple focus:outline-none"
              required
              placeholder="Ej: Construir Fusion Reactor"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gtnh-purple/30 rounded-lg bg-gtnh-darker text-white focus:border-gtnh-purple focus:outline-none"
              rows={3}
              placeholder="Describe los detalles..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-300">Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
              className="w-full px-4 py-2 border border-gtnh-purple/30 rounded-lg bg-gtnh-darker text-white focus:border-gtnh-purple focus:outline-none"
            >
              <option value="LOW">🟢 Baja</option>
              <option value="MEDIUM">🟡 Media</option>
              <option value="HIGH">🟠 Alta</option>
              <option value="URGENT">🔴 Urgente</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Asignar a</label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-4 py-2 border border-gtnh-purple/30 rounded-lg bg-gtnh-darker text-white focus:border-gtnh-purple focus:outline-none"
            >
              <option value="">Sin asignar</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-gradient-to-r from-gtnh-purple to-gtnh-green text-white py-3 rounded-lg hover:opacity-80 transition-opacity font-bold disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creando...' : 'Crear Tarea'}
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
