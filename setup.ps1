# GregTech Hub - Setup Script
# Este script automatiza la configuración inicial del proyecto web

Write-Host "🚀 GregTech Hub - Script de Configuración" -ForegroundColor Green
Write-Host ""

# Verificar si estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecuta este script desde la carpeta gregtech-hub-web" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Paso 1: Instalando dependencias..." -ForegroundColor Cyan
pnpm install

Write-Host ""
Write-Host "🔧 Paso 2: Generando Prisma Client..." -ForegroundColor Cyan
pnpm prisma generate

Write-Host ""
Write-Host "📝 Paso 3: Configurando variables de entorno..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado. IMPORTANTE: Edita .env con tu configuración!" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  El archivo .env ya existe. No se sobrescribió." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🗄️  Paso 4: ¿Quieres inicializar la base de datos ahora? (Y/N)" -ForegroundColor Cyan
$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Ejecutando prisma db push..." -ForegroundColor Cyan
    pnpm prisma db push
}

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Edita el archivo .env con tu configuración de base de datos" -ForegroundColor White
Write-Host "2. Si no inicializaste la BD, ejecuta: pnpm run db:push" -ForegroundColor White
Write-Host "3. Inicia el servidor de desarrollo: pnpm run dev" -ForegroundColor White
Write-Host "4. Abre http://localhost:3000 en tu navegador" -ForegroundColor White
Write-Host ""
Write-Host "🎉 ¡Disfruta de GregTech Hub!" -ForegroundColor Green
