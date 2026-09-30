@echo off
setlocal
title Avantis Studio
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale o Node.js para abrir o sistema.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo As dependencias nao foram instaladas. Execute npm install nesta pasta.
  pause
  exit /b 1
)
if not exist "node_modules\concurrently\package.json" (
  echo Dependencias incompletas. Execute npm install nesta pasta.
  pause
  exit /b 1
)

rem Reutiliza cada servidor separadamente para evitar conflito de portas.
set "AVANTIS_API_RUNNING=0"
set "AVANTIS_WEB_RUNNING=0"
powershell.exe -NoProfile -Command "try { $api = Invoke-RestMethod -Uri 'http://localhost:3001/api/status' -TimeoutSec 2; if ($api.status -eq 'ok') { exit 0 }; exit 1 } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 set "AVANTIS_API_RUNNING=1"
powershell.exe -NoProfile -Command "try { $web = Invoke-WebRequest -Uri 'http://localhost:8080/youtube' -UseBasicParsing -TimeoutSec 2; if ($web.Content -match '/src/main.tsx') { exit 0 }; exit 1 } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 set "AVANTIS_WEB_RUNNING=1"
if "%AVANTIS_API_RUNNING%%AVANTIS_WEB_RUNNING%"=="11" (
  start "" "http://localhost:8080/youtube"
  exit /b 0
)
if "%AVANTIS_API_RUNNING%"=="1" (
  echo Abrindo Avantis Studio. Mantenha esta janela aberta durante o uso.
  node "node_modules\vite\bin\vite.js" --port 8080 --strictPort --open /youtube
  if errorlevel 1 pause
  exit /b
)
if "%AVANTIS_WEB_RUNNING%"=="1" (
  start "" "http://localhost:8080/youtube"
  echo Iniciando API. Mantenha esta janela aberta durante o uso.
  node --watch server.mjs
  if errorlevel 1 pause
  exit /b
)
echo Abrindo Avantis Studio em http://localhost:8080/youtube
echo Mantenha esta janela aberta enquanto usa o sistema.
echo Para encerrar, pressione Ctrl+C ou feche esta janela.
echo.
node "node_modules\concurrently\dist\bin\concurrently.js" --kill-others "node --watch server.mjs" "node node_modules/vite/bin/vite.js --port 8080 --strictPort --open /youtube"
if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar. Confira as mensagens acima.
  echo Se as portas 3001 ou 8080 estiverem em uso, feche o servidor anterior.
  pause
)
endlocal
