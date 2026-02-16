# Elite Hub - Sistema de Gestión de Turnos (Barbería & Club)

Plataforma integral de reserva de turnos y gestión de recursos (canchas) con integración directa a Google Sheets.

## 🚀 Características
- **Multi-Negocio**: Rutas independientes para Barbería y Club Deportivo.
- **Gestión de Recursos**: Soporte para múltiples canchas con precios y señas diferenciadas.
- **Admin Dashboard Pro**: Estadísticas en tiempo real, ingresos estimados y volumetría.
- **Modo Mantenimiento**: Bloqueo manual de horarios desde el panel administrativo.
- **Autocancelación**: Sistema de links únicos para que el cliente gestione sus bajas.
- **WhatsApp Integration**: Notificaciones manuales pre-configuradas para confirmación y cancelaciones.
- **Google Sheets Backend**: No requiere base de datos compleja, todo se guarda en una hoja de cálculo.

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio**
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar Google Sheets**:
   - Crea un proyecto en Google Cloud Console.
   - Habilita la **Google Sheets API**.
   - Crea una **Service Account**, descarga la llave JSON y extrae el `client_email` y la `private_key`.
   - Crea una Google Sheet y compártela con el email de la Service Account con permisos de "Editor".
   - Ejecuta el script de inicialización para crear las pestañas necesarias:
     ```bash
     node scripts/initSheet.js
     ```

4. **Variables de Entorno**:
   Crea un archivo `.env.local` basado en `.env.example`.

## 💻 Desarrollo

Ejecuta el servidor local:
```bash
npm run dev
```

## 🚢 Despliegue (Vercel)

1. Sube el código a GitHub.
2. Conecta tu repo en Vercel.
3. Agrega las Variables de Entorno en el panel de configuración de Vercel.
   - **IMPORTANTE**: Para la `GOOGLE_PRIVATE_KEY` en Vercel, asegúrate de pegarla con comillas si contiene saltos de línea o usar el formato de una sola línea con `\n`.

---
*Diseñado con estética premium y enfoque en la experiencia de usuario.*
