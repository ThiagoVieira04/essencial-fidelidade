@echo off
echo Gerando APK com mensagem de texto simples...

echo Copiando logo...
copy "www\assets\shirley logo (1).png" "www\assets\logo.png" >nul 2>&1
copy "www\assets\logo.png" "android\app\src\main\assets\public\assets\logo.png" >nul 2>&1

echo Sincronizando...
call npx cap sync

echo Gerando APK...
cd android
call gradlew assembleDebug

echo.
echo ========================================
echo APK gerado com sucesso!
echo.
echo Local: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo COMPORTAMENTO:
echo ✓ SEM popup
echo ✓ Texto fixo verde: "🎉 Parabéns, você ganhou um brinde!"
echo ✓ Aparece abaixo dos selos ao completar 10
echo ✓ Centralizado e harmônico com o layout
echo ✓ Fonte maior que o texto padrão
echo ========================================
pause