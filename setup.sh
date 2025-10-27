#!/bin/bash
# GregTech Hub - Setup Script para Linux/Mac
# Este script automatiza la configuración inicial del proyecto web

echo "🚀 GregTech Hub - Script de Configuración"
echo ""

# Verificar si estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta gregtech-hub-web"
    exit 1
fi

echo "📦 Paso 1: Instalando dependencias..."
pnpm install

echo ""
echo "🔧 Paso 2: Generando Prisma Client..."
pnpm prisma generate

echo ""
echo "📝 Paso 3: Configurando variables de entorno..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Archivo .env creado. IMPORTANTE: Edita .env con tu configuración!"
else
    echo "⚠️  El archivo .env ya existe. No se sobrescribió."
fi

echo ""
echo "🗄️  Paso 4: ¿Quieres inicializar la base de datos ahora? (Y/N)"
read response
if [ "$response" = "Y" ] || [ "$response" = "y" ]; then
    echo "Ejecutando prisma db push..."
    pnpm prisma db push
fi

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "📚 Próximos pasos:"
echo "1. Edita el archivo .env con tu configuración de base de datos"
echo "2. Si no inicializaste la BD, ejecuta: pnpm run db:push"
echo "3. Inicia el servidor de desarrollo: pnpm run dev"
echo "4. Abre http://localhost:3000 en tu navegador"
echo ""
echo "🎉 ¡Disfruta de GregTech Hub!"
