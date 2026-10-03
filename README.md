# MTC Stream Control 🎬

Sistema web claro, organizado y elegante para la gestión y control de cuentas de streaming (Disney+, YouTube Premium, Netflix, Max, Spotify, etc.) compradas a proveedores.

---

## 🚀 Despliegue en GitHub Pages

El proyecto ya está configurado con **GitHub Actions** para compilarse y publicarse automáticamente en GitHub Pages cada vez que subas cambios a la rama `main` o `master`.

### Pasos para subir y desplegar en GitHub:

1. **Crear un repositorio en GitHub**:
   - Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio (por ejemplo: `mtc-stream-control`).
   - Puedes elegirlo público o privado.

2. **Inicializar y subir el código desde tu terminal**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MTC Stream Control"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/mtc-stream-control.git
   git push -u origin main
   ```

3. **Activar GitHub Pages en el repositorio**:
   - En tu repositorio de GitHub, ve a **Settings** (Configuración) > **Pages** (en el menú lateral izquierdo).
   - En la sección **Build and deployment** > **Source**, selecciona:
     👉 **GitHub Actions**
   - ¡Listo! En la pestaña **Actions** verás el flujo *Deploy to GitHub Pages* ejecutándose automáticamente.
   - En unos segundos tu app estará disponible en:
     `https://TU_USUARIO.github.io/mtc-stream-control/`

---

## 💻 Desarrollo Local

Para correr el proyecto en tu máquina local:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción (carpeta dist/)
npm run build
```

---

## ✨ Características

- **Gestión de Cuentas y Credenciales**: Correo, contraseña (mostrar/ocultar y copiado rápido), fechas de alta y vencimiento, días restantes con alerta visual.
- **Control de Proveedores y Pagos**: Registro de proveedor, método de pago (Nequi, Daviplata, Binance, PayPal, etc.) y acceso directo a WhatsApp.
- **Pantallas y Perfiles**: Asignación de 1 a 6 perfiles por cuenta con nombre, PIN, cliente asignado y estado (disponible/ocupado).
- **Plantillas WhatsApp**: Generador de mensajes con formato listo para entregar datos a clientes o pedir garantías al proveedor.
- **Vistas**: Vista de tarjetas elegantes y vista de tabla de alta densidad.
- **Respaldos**: Exportación a CSV (Excel) y respaldo/restauración en JSON.
- **Privacidad**: 100% almacenamiento local en el navegador (`localStorage`).
