@echo off
setlocal

:: GEOSCRIPT_HOME is the parent of the bin directory
set GEOSCRIPT_HOME=%~dp0..

:: put GeoTools jars on the classpath
setlocal enabledelayedexpansion
echo. >NUL 2>tmp.txt
for /R %GEOSCRIPT_HOME%\jars %%x in (*.jar) do echo %%x >> tmp.txt

set CP=
for /f %%a in (tmp.txt) do (
    set CP=!CP!;%%a
)
del /q tmp.txt

set CLASS=org.mozilla.javascript.tools.shell.Main

:: Convert any backslashes in the command to forward slashes
set CMD=java -cp %CP% %CLASS% -version 180 -modules %GEOSCRIPT_HOME%\lib
set CMD=%CMD:\=/%

:: Execute
%CMD%
