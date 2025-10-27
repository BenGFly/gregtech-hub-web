import Link from "next/link";
import { FaTasks, FaBook, FaChartLine, FaUsers, FaCog, FaRocket } from "react-icons/fa";
import { GiNuclearWaste, GiElectric } from "react-icons/gi";

export default function Home() {
  return (
    <main className="min-h-screen animated-bg grid-bg">
      {/* Header with Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gtnh-purple/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-8 py-20 relative">
          <div className="text-center mb-12">
            {/* Logo Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <GiNuclearWaste className="text-gtnh-purple text-8xl animate-pulse-slow" />
                <div className="absolute inset-0 blur-xl bg-gtnh-purple/30 animate-glow"></div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-7xl font-bold mb-6 neon-text">
              <span className="bg-gradient-to-r from-gtnh-purple via-gtnh-orange to-gtnh-green bg-clip-text text-transparent">
                GregTech Hub
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Centro de Control Avanzado para GregTech New Horizons
            </p>
            
            <div className="flex items-center justify-center gap-2 text-gtnh-orange text-sm font-mono">
              <GiElectric className="animate-pulse" />
              <span>SISTEMA OPERATIVO v1.0.0</span>
              <GiElectric className="animate-pulse" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <QuickStat icon={<FaTasks />} label="Tareas Activas" value="0" />
            <QuickStat icon={<FaBook />} label="Quests Completadas" value="0" />
            <QuickStat icon={<FaRocket />} label="Progreso Global" value="0%" />
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            icon={<FaTasks className="text-4xl" />}
            title="Tasks"
            description="Gestiona tus tareas del modpack"
            href="/tasks"
            color="bg-blue-500"
            badge="Kanban"
          />
          <DashboardCard
            icon={<FaBook className="text-4xl" />}
            title="Quests"
            description="Sincronización automática con Better Questing"
            href="/quests"
            color="bg-gtnh-purple"
            badge="Auto-Sync"
          />
          <DashboardCard
            icon={<FaChartLine className="text-4xl" />}
            title="Progreso"
            description="Estadísticas y análisis del equipo"
            href="/progress"
            color="bg-gtnh-green"
            badge="Analytics"
          />
          <DashboardCard
            icon={<FaUsers className="text-4xl" />}
            title="Equipo"
            description="Colabora con otros jugadores"
            href="/team"
            color="bg-gtnh-orange"
            badge="Multiplayer"
          />
        </div>

        {/* Features Section */}
        <section className="glass rounded-2xl p-8 shadow-gtnh">
          <h2 className="text-3xl font-bold mb-6 text-gtnh-purple flex items-center gap-3">
            <FaCog className="animate-spin" style={{ animationDuration: '3s' }} />
            Características del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Feature 
              title="📋 Listas de Materiales"
              description="Organiza recursos por tarea con cantidades exactas y progreso visual"
            />
            <Feature 
              title="🎮 Sincronización de Quests"
              description="Integración directa con Better Questing mod en tiempo real"
            />
            <Feature 
              title="📊 Progreso Visual"
              description="Barras de progreso animadas y estadísticas detalladas"
            />
            <Feature 
              title="👥 Modo Colaborativo"
              description="Trabaja en equipo con otros jugadores del servidor"
            />
            <Feature 
              title="🔌 API REST"
              description="Sincronización automática desde Minecraft (Tecla K in-game)"
            />
            <Feature 
              title="🌙 Tema Oscuro"
              description="Diseño optimizado para largas sesiones de juego"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4 card-hover">
      <div className="flex items-center gap-3 text-gtnh-purple text-2xl mb-2">
        {icon}
        <div className="text-4xl font-bold text-white">{value}</div>
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  href,
  color,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  badge: string;
}) {
  return (
    <Link href={href}>
      <div className="glass rounded-xl p-6 card-hover cursor-pointer group relative overflow-hidden border border-gtnh-purple/30 hover:border-gtnh-purple/60">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gtnh-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className={`${color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
            <span className="text-xs text-gtnh-purple font-mono font-bold">{badge}</span>
            <span className="text-xs text-gray-500 group-hover:text-gtnh-purple transition-colors">
              ACCEDER →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-gtnh-darker/50 border border-gtnh-purple/20 hover:border-gtnh-purple/40 transition-all hover:bg-gtnh-darker/70">
      <h3 className="font-semibold text-gtnh-purple mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
