# Site Monitor

Dos interfaces equivalentes: `web-site-monitor` se publica en Firebase Hosting; `node-site-monitor` sirve las plantillas mediante Express. Ambas usan Firebase Authentication y Realtime Database.

## Desarrollo

Requiere Node.js 22 o posterior. En `node-site-monitor`:

```powershell
npm ci
npm test
npm start
```

`node_modules` queda fuera de Git; usa siempre el lockfile para instalar.

## Firebase

La configuración web y su API key son identificadores públicos, no credenciales de dispositivo. La autorización la aplican `web-site-monitor/database.rules.json`: usuarios autenticados no anónimos leen los datos y controlan `ledStatus`; solamente identidades con el claim `device: true` escriben sensores. No hay escritura pública ni borrado de mediciones. Gestiona las cuentas autorizadas desde Firebase Authentication y evita habilitar registro público sin añadir una lista de usuarios permitidos.

Asigna el claim del dispositivo desde un entorno administrativo de confianza con Firebase Admin SDK (`setCustomUserClaims(uid, {device: true})`). Renueva la sesión después de asignarlo. Prueba las reglas con el emulador antes de publicarlas. No se han desplegado reglas ni modificado usuarios en producción.

Desde `web-site-monitor`, con Firebase CLI configurado para el proyecto correcto:

```powershell
firebase deploy --only database,hosting
```

## Firmware y secretos

Copia `config.example.h` a `config.h` en la carpeta del sketch que uses y completa los valores locales. `config.h` está ignorado por Git. El host se escribe sin `https://` ni barra final. Rota en el router la contraseña Wi-Fi anteriormente incluida: retirarla del árbol actual no la elimina del historial Git.

Los sketches conservan sus bibliotecas originales (FirebaseArduino + SparkFun HTU21D, o FirebaseESP8266 + Adafruit DHT Unified). Deben compilarse y probarse con el ESP8266 y el sensor correspondiente; no se ha conectado hardware en esta sesión.

`FIREBASE_AUTH` no acepta la API key pública como autenticación de base de datos. Para reglas con `device: true`, usa un ID token de una identidad de dispositivo con ese claim. Estas bibliotecas antiguas reciben una credencial estática: el token expira y debe renovarse/provisionarse antes de expirar para operación continua. No incrustes un secreto administrativo de base de datos: omite las reglas. La renovación automática de identidad requiere migrar la biblioteca y configurar la cuenta de dispositivo. No se proporcionan secretos ni se habilita acceso público para ocultar este requisito.

## Verificación

`npm test` verifica ambas interfaces: espera a la sesión antes de leer, redirige rutas alternativas sin sesión, maneja datos vacíos y errores, y confirma las transacciones de luz. También renderiza las plantillas con Pug instalado. Las reglas y el firmware necesitan validación adicional en el emulador y hardware antes de desplegar.
