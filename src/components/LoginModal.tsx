'use client';

import { useState } from 'react';
import { FaUser, FaSignInAlt } from 'react-icons/fa';
import { trpc } from '@/lib/trpc/client';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  onLogin: () => void;
}

export default function LoginModal({ onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const { data: users } = trpc.user.getAll.useQuery();

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Por favor ingresa tu nombre de Minecraft');
      return;
    }

    setIsLoading(true);
    setError('');

    // Buscar si el usuario ya existe
    const existingUser = users?.find(
      (u: any) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (existingUser) {
      // Usuario encontrado
      login(existingUser.id, existingUser.username);
      onLogin();
    } else {
      // Usuario nuevo - mostrar mensaje
      setError(
        'Usuario no encontrado. Conectate primero al servidor de Minecraft para crear tu cuenta.'
      );
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (user: any) => {
    login(user.id, user.username);
    onLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass w-full max-w-md rounded-2xl border-2 border-purple-500/30 bg-zinc-900/90 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500">
            <FaUser className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Bienvenido a GTNH Hub</h2>
          <p className="mt-2 text-gray-400">Identifícate para continuar</p>
        </div>

        {/* Input de Usuario */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Nombre de Minecraft
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Tu nombre en Minecraft..."
            className="w-full rounded-lg border border-purple-500/30 bg-zinc-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            disabled={isLoading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        {/* Botón de Login */}
        <button
          onClick={handleLogin}
          disabled={isLoading || !username.trim()}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Verificando...
            </>
          ) : (
            <>
              <FaSignInAlt />
              Ingresar
            </>
          )}
        </button>

        {/* Usuarios Existentes (acceso rápido) */}
        {users && users.length > 0 && (
          <div className="mt-6 border-t border-zinc-700 pt-6">
            <p className="mb-3 text-sm text-gray-400">O selecciona un usuario:</p>
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickSelect(user)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-left text-white transition-all hover:border-purple-500/50 hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                      <FaUser className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-xs text-gray-500">
                        UUID: {user.minecraftUUID.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
          <p className="text-xs text-blue-300">
            💡 <strong>Nota:</strong> Tu cuenta se crea automáticamente cuando te conectas al servidor de Minecraft. Si es tu primera vez, conectate primero al servidor.
          </p>
        </div>
      </div>
    </div>
  );
}
