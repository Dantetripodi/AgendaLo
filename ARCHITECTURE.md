# Arquitectura de BarberBook (Elite Cuts) ✂️

Este documento explica el flujo de la aplicación, la separación de responsabilidades y cómo mantener el código.

## 🏗️ Separación de Responsabilidades

La aplicación sigue un patrón de diseño moderno separando la lógica de negocio, la interfaz de usuario y el acceso a datos.

### 1. Frontend (Capas)
*   **`app/page.tsx` (Compositor)**: Es el punto de entrada principal. Orquesta los componentes y el estado global de la vista.
*   **`components/` (UI Pura)**: Contiene componentes visuales reutilizables (`Calendar`, `TimeGrid`, `BookingForm`). Reciben datos por `props` y emiten eventos. No conocen la base de datos.
*   **`hooks/useBooking.ts` (Lógica de Estado)**: Centraliza toda la lógica de reserva: llamadas a la API, validaciones locales, y gestión de estados (`loading`, `message`, `selectedTime`).
*   **`constants/`**: Parámetros de negocio (horarios, duración de turnos, servicios).

### 2. Backend (Next.js App Router)
*   **`app/api/` (Controladores)**: Endpoints REST para manejar las peticiones del frontend. Validan los datos recibidos antes de pasarlos a la base de datos.
*   **`lib/googleSheets.ts` (Servicio de Datos)**: Capa de abstracción para conectar con Google Sheets. Maneja la autenticación JWT y expone la hoja de cálculo.

### 3. Base de Datos (Google Sheets)
*   Actúa como una base de datos relacional simple donde cada fila es un registro de turno.

## 🔄 Flujo de una Reserva

1.  **Carga**: El `useBooking` hook pide la disponibilidad al cargar la página o cambiar la fecha (`GET /api/disponibilidad`).
2.  **Selección**: El usuario elige un slot de tiempo. El sistema calcula automáticamente el fin del turno (+45 min).
3.  **Validación Frontend**: El formulario verifica que los campos obligatorios estén completos.
4.  **Confirmación**: Se envía un `POST /api/reservar`.
5.  **Validación Backend (Crucial)**: 
    *   El servidor vuelve a leer el Sheet para evitar "race conditions".
    *   Aplica la **regla de colisión**: `(Inicio_Nueva < Fin_Existente) AND (Fin_Nueva > Inicio_Existente)`.
6.  **Persistencia**: Si no hay colisión, se guarda la fila y el frontend muestra el éxito.

## 🧬 Tipado (TypeScript)
Todos los modelos de datos están definidos en `types/index.ts`. Esto garantiza que si cambias la estructura de un Turno, el compilador te avisará en qué partes del código debes actualizar la lógica.

## 📅 Sincronización con Google Calendar

Para implementar la sincronización automática de turnos con tu calendario personal, el flujo técnico es el siguiente:

### 1. Requisitos de Infraestructura
*   **Permisos de API**: Debemos agregar el scope `https://www.googleapis.com/auth/calendar.events` a nuestra configuración actual en `lib/googleSheets.ts`.
*   **Calendar ID**: Cada negocio (Barbería/Club) puede tener su propio `CALENDAR_ID` (usualmente tu correo de Gmail).

### 2. Flujo de Implementación
Cuando un usuario confirma una reserva (`POST /api/reservar`):
1.  **Auth**: Usamos el mismo objeto `jwt` que ya tenemos para las hojas de cálculo.
2.  **Llamada a Calendar API**: Invocamos el endpoint de `events.insert`.
3.  **Mapeo de Datos**:
    *   `summary`: "[Club] Reserva Cancha - Cliente"
    *   `start`: Fecha + Hora Inicio
    *   `end`: Fecha + Hora Fin
    *   `description`: "Teléfono: [Tel] - Servicio: [Recurso]"
4.  **Confirmación**: Si la API de Calendar responde OK, el turno queda agendado visualmente en tu celular.

### 3. Ventajas
*   **Notificaciones**: Recibes alertas push en tu móvil cada vez que entra un turno.
*   **Vista de Agenda**: Puedes ver todos tus huecos libres del día desde cualquier dispositivo sin entrar a la App.

---
*Powered by Antigravity*
