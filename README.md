# GregTech Hub - Web Application

Aplicación web tipo Monday.com para gestión de tareas y quests de GTNH.

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+ (o SQLite para desarrollo)
- pnpm (recomendado) o npm

### Opción 1: Setup Automático (Recomendado)

**Windows:**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Opción 2: Setup Manual

1. **Instalar dependencias**
```powershell
pnpm install
```

2. **Generar Prisma Client**
```powershell
pnpm prisma generate
```

3. **Configurar variables de entorno**
```powershell
cp .env.example .env
```

Edita `.env` y configura:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gregtech_hub"
# o para desarrollo rápido con SQLite:
# DATABASE_URL="file:./dev.db"

API_SECRET_KEY="tu-clave-secreta-aqui"
```

4. **Inicializar la base de datos**
```powershell
pnpm run db:push
```

5. **Iniciar el servidor de desarrollo**
```powershell
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## ✅ Verificar que Todo Funciona

```powershell
# Compilar el proyecto (debería completarse sin errores)
pnpm run build

# Iniciar en modo producción
pnpm run start
```

## 📁 Estructura del Proyecto

```
gregtech-hub-web/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/              # API Routes
│   │   ├── tasks/            # Página de tareas
│   │   ├── quests/           # Página de quests
│   │   └── page.tsx          # Página principal
│   ├── lib/                   # Utilidades
│   │   ├── trpc/             # Configuración tRPC
│   │   └── prisma.ts         # Cliente Prisma
│   └── server/
│       └── trpc/             # Routers tRPC
│           ├── router.ts     # Router principal
│           └── trpc.ts       # Configuración tRPC
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### tRPC Procedures

#### Tasks
- `task.getAll` - Obtener todas las tareas
- `task.create` - Crear nueva tarea
- `task.update` - Actualizar tarea
- `task.delete` - Eliminar tarea

#### Quests
- `quest.getProgress` - Obtener progreso de quests
- `quest.syncQuest` - Sincronizar quest desde Minecraft

#### Users
- `user.getOrCreate` - Obtener o crear usuario
- `user.getAll` - Obtener todos los usuarios

### REST Endpoints (para el mod)

```
POST /api/sync/quest
POST /api/sync/task
GET  /api/tasks
```

## 🗄️ Base de Datos

### Modelos Principales

**User** - Jugadores de Minecraft
- `id`, `minecraftUUID`, `username`

**Task** - Tareas del proyecto
- `id`, `title`, `description`, `status`, `priority`

**QuestProgress** - Progreso de quests
- `id`, `userId`, `questId`, `questName`, `completed`

## 🎨 Personalización

### Colores de Tema

Edita `tailwind.config.ts` para personalizar los colores:

```typescript
gtnh: {
  purple: '#6b4dff',
  green: '#4dff88',
  orange: '#ff8b4d',
}
```

## 🔒 Seguridad

- Configura `API_SECRET_KEY` en `.env`
- El mod debe enviar este key en el header `X-API-Key`
- En producción, usa HTTPS

## 📊 Scripts Disponibles

```powershell
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Iniciar en producción
npm run lint         # Linter
npm run db:push      # Sincronizar schema de Prisma
npm run db:studio    # Abrir Prisma Studio
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Push a GitHub
2. Importa en Vercel
3. Configura variables de entorno
4. Deploy automático

### Docker

```dockerfile
# Próximamente
```

## 🐛 Troubleshooting

**Error de conexión a la base de datos:**
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `DATABASE_URL`

**Errores de tRPC:**
- Verifica que el servidor esté corriendo
- Comprueba la consola del navegador

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
