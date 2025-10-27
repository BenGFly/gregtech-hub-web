'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaTasks, FaGamepad, FaUsers, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { GiNuclearWaste } from 'react-icons/gi';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Navigation() {
  const pathname = usePathname();
  const { username, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: <FaHome /> },
    { href: '/tasks', label: 'Tareas', icon: <FaTasks /> },
    { href: '/quests', label: 'Quests', icon: <FaGamepad /> },
    { href: '/team', label: 'Equipo', icon: <FaUsers /> },
    { href: '/progress', label: 'Progreso', icon: <FaChartLine /> },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gtnh-purple/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <GiNuclearWaste className="text-gtnh-purple text-3xl group-hover:animate-pulse" />
              <div className="absolute inset-0 blur-lg bg-gtnh-purple/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gtnh-purple to-gtnh-green bg-clip-text text-transparent">
              GregTech Hub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold text-sm
                    ${isActive 
                      ? 'bg-gradient-to-r from-gtnh-purple to-gtnh-green text-white shadow-gtnh' 
                      : 'text-gray-400 hover:text-white hover:bg-gtnh-purple/20'
                    }
                  `}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
            
            {/* User Profile */}
            {isAuthenticated && username ? (
              <div className="ml-4 flex items-center gap-3 rounded-lg border border-purple-500/30 bg-zinc-800/80 px-3 py-2 backdrop-blur-sm">
                {/* Minecraft Head */}
                <img
                  src={`https://mc-heads.net/avatar/${username}/32`}
                  alt={username}
                  className="h-8 w-8 rounded"
                  onError={(e) => {
                    // Fallback si falla la carga de la skin
                    e.currentTarget.src = 'https://mc-heads.net/avatar/Steve/32';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-none">{username}</span>
                  <span className="text-xs text-gray-400">Jugador</span>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 rounded p-1.5 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  title="Cerrar sesión"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="ml-4 rounded-lg bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-purple-700 hover:to-orange-600"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
      </nav>

      {/* Login Modal - FUERA del nav para que se centre correctamente */}
      {showLoginModal && !isAuthenticated && (
        <LoginModal onLogin={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
