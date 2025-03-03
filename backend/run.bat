@echo off
echo Iniciando servidor ReportLab PDF...

REM Ativar ambiente virtual
call venv\Scripts\activate
if %errorlevel% neq 0 (
    echo Falha ao ativar ambiente virtual. Execute install.bat primeiro.
    pause
    exit /b 1
)

REM Iniciar servidor
echo Iniciando servidor na porta 8000...
python main.py
if %errorlevel% neq 0 (
    echo Falha ao iniciar servidor.
    pause
    exit /b 1
)

pause
