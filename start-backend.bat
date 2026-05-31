@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21
cd /d "C:\Users\Medha Trust\Desktop\New folder (9)\mediConnect\backend"
.\mvnw spring-boot:run > ..\backend-out.log 2> ..\backend-err.log
