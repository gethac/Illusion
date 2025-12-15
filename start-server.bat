@echo off
echo ===================================
echo   幻境 PPT 助手 - 本地服务器
echo ===================================
echo.
echo 正在启动服务器...
echo 启动后请访问: http://localhost:8080
echo 按 Ctrl+C 停止服务器
echo.

python -m http.server 8080
