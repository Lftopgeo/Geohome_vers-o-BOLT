@echo off
echo Instalando dependencias do ReportLab...

REM Verificar se o Python esta instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python nao encontrado. Por favor, instale o Python 3.8 ou superior.
    echo Voce pode baixar o Python em https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Criar ambiente virtual
echo Criando ambiente virtual...
python -m venv venv
if %errorlevel% neq 0 (
    echo Falha ao criar ambiente virtual. Verifique se o modulo venv esta instalado.
    pause
    exit /b 1
)

REM Ativar ambiente virtual
echo Ativando ambiente virtual...
call venv\Scripts\activate
if %errorlevel% neq 0 (
    echo Falha ao ativar ambiente virtual.
    pause
    exit /b 1
)

REM Instalar dependencias
echo Instalando dependencias...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
)

echo.
echo Instalacao concluida com sucesso!
echo Para iniciar o servidor, execute o arquivo run.bat
echo.
pause
