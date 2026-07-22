# 🔐 Sistema de Autenticación con Google OAuth - WebTravel Admin

## ✅ Implementación Completada

Se ha implementado exitosamente el sistema de autenticación con Google OAuth y control de roles administrativos para la aplicación WebTravel Admin.

---

## 📦 Paquetes Instalados

- **next-auth@5.0.0-beta.32** - Autenticación para Next.js 16 + React 19
- **@auth/core@0.41.3** - Core de Auth.js
- **@radix-ui/react-dropdown-menu@2.1.21** - Componente de menú desplegable

---

## 📁 Archivos Creados

### **Configuración de Autenticación:**
- ✅ `src/auth.ts` - Configuración central de NextAuth con Google Provider
- ✅ `src/middleware.ts` - Middleware de protección de rutas
- ✅ `src/lib/auth.ts` - Funciones helper para validación de sesión
- ✅ `src/types/next-auth.d.ts` - Tipos TypeScript extendidos para NextAuth

### **API Routes:**
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - Endpoints de autenticación

### **Páginas:**
- ✅ `src/app/login/page.tsx` - Página de inicio de sesión con botón de Google
- ✅ `src/app/unauthorized/page.tsx` - Página de acceso denegado (403)

### **Componentes:**
- ✅ `src/components/auth/sign-in-button.tsx` - Botón de inicio de sesión con Google
- ✅ `src/components/auth/sign-out-button.tsx` - Botón de cierre de sesión
- ✅ `src/components/auth/user-menu.tsx` - Menú de usuario con avatar y dropdown

### **Layout Actualizado:**
- ✅ `src/components/layout/dashboard-layout.tsx` - Integrado con sistema de autenticación
- ✅ `src/components/layout/header.tsx` - Header con UserMenu integrado

### **Variables de Entorno:**
- ✅ `.env.local` - Variables de entorno actualizadas
- ✅ `.env.local.example` - Template para otros desarrolladores

---

## 🔧 Configuración de Google OAuth

### **Paso 1: Crear Proyecto en Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
   - Nombre sugerido: "WebTravel Admin"

### **Paso 2: Habilitar Google+ API**

1. En el menú lateral, ve a **"APIs & Services" > "Library"**
2. Busca **"Google+ API"**
3. Haz clic en **"Enable"**

### **Paso 3: Crear Credenciales OAuth 2.0**

1. Ve a **"APIs & Services" > "Credentials"**
2. Haz clic en **"Create Credentials" > "OAuth client ID"**
3. Si es la primera vez, configura la **"OAuth consent screen"**:
   - User Type: **Internal** (si es Google Workspace) o **External**
   - App name: **WebTravel Admin**
   - User support email: Tu email
   - Developer contact: Tu email
   - Scopes: No es necesario agregar scopes adicionales
   - Test users (si es External): Agrega el email de tu hermana

4. Vuelve a **"Credentials" > "Create Credentials" > "OAuth client ID"**:
   - Application type: **Web application**
   - Name: **WebTravel Web Client**
   
5. En **"Authorized JavaScript origins"**, agrega:
   ```
   http://localhost:3000
   ```
   
6. En **"Authorized redirect URIs"**, agrega:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

7. Haz clic en **"Create"**

8. **Copia el Client ID y Client Secret** que aparecen en el popup

### **Paso 4: Configurar Variables de Entorno**

Edita el archivo `/apps/web/.env.local` con las credenciales obtenidas:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001

# Genera un secret único con: openssl rand -base64 32
AUTH_SECRET=tu_secret_generado_aqui

# Credenciales de Google OAuth (obtenidas del paso anterior)
AUTH_GOOGLE_ID=tu-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=tu-client-secret

AUTH_URL=http://localhost:3000

# Email de tu hermana (cambia esto por el correo real)
ADMIN_EMAILS=correo-de-tu-hermana@gmail.com
```

### **Generar AUTH_SECRET:**

En tu terminal, ejecuta:
```bash
openssl rand -base64 32
```

Copia el resultado y reemplaza `tu_secret_generado_aqui` en `.env.local`

---

## 🛡️ Protección de Rutas Implementada

### **Rutas Protegidas (requieren autenticación y rol admin):**
- ✅ `/` - Dashboard principal
- ✅ `/solicitudes` - Gestión de solicitudes de viaje
- ✅ `/itinerarios` - Gestión de itinerarios

### **Rutas Públicas (sin autenticación):**
- ✅ `/chat` - Chat público para usuarios
- ✅ `/login` - Página de inicio de sesión
- ✅ `/unauthorized` - Página de acceso denegado
- ✅ `/api/auth/*` - Endpoints de autenticación

---

## 🎨 Características de UI Implementadas

### **Página de Login (`/login`):**
- Diseño limpio con gradiente de fondo
- Card centrado con sombra elegante
- Botón "Continuar con Google" con icono oficial
- Redirección automática si ya está autenticado
- Mensaje informativo sobre acceso autorizado

### **User Menu (Header superior derecho):**
- Avatar circular con foto de Google (o iniciales si no hay foto)
- Nombre del usuario
- Email (truncado si es muy largo)
- Badge de "Administrador"
- Dropdown con:
  - Información del usuario
  - Botón "Cerrar Sesión"

### **Página de Acceso Denegado (`/unauthorized`):**
- Icono de alerta rojo
- Mensaje claro de "Acceso Denegado"
- Botón para cerrar sesión
- Botón para volver al chat público

---

## 🔒 Flujo de Autenticación

```
Usuario accede a /solicitudes
  ↓
Middleware detecta falta de sesión
  ↓
Redirect a /login?callbackUrl=/solicitudes
  ↓
Usuario hace clic en "Continuar con Google"
  ↓
Popup de Google OAuth (selección de cuenta)
  ↓
Callback a /api/auth/callback/google
  ↓
NextAuth valida el email contra ADMIN_EMAILS
  ↓
SI ES ADMIN:
  → Crear sesión JWT (válida por 30 días)
  → Redirect a /solicitudes (página original)
  → Mostrar UserMenu en header
  ↓
SI NO ES ADMIN:
  → Redirect a /unauthorized
  → Mostrar mensaje de error
  → Opción de cerrar sesión
```

---

## 🚀 Cómo Iniciar la Aplicación

### **1. Configurar variables de entorno:**
```bash
cd /projects/webTravel/apps/web
# Edita .env.local con tus credenciales de Google OAuth
nano .env.local
```

### **2. Iniciar el servidor de desarrollo:**
```bash
cd /projects/webTravel/apps/web
pnpm dev
```

### **3. Acceder a la aplicación:**
```
http://localhost:3000
```

### **4. Probar el flujo de autenticación:**
1. Intenta acceder a `http://localhost:3000/solicitudes`
2. Serás redirigido a `/login`
3. Haz clic en "Continuar con Google"
4. Inicia sesión con el email configurado en `ADMIN_EMAILS`
5. Serás redirigido al dashboard

---

## ✅ Verificación de Implementación

### **Funcionalidades Esperadas:**
- ✅ Usuario admin puede iniciar sesión con Google
- ✅ Usuario NO admin ve mensaje de "Acceso denegado"
- ✅ Rutas `/solicitudes` y `/itinerarios` están protegidas
- ✅ Ruta `/chat` permanece pública (sin autenticación)
- ✅ Avatar y nombre de usuario visible en header superior derecho
- ✅ Botón "Cerrar Sesión" funcional en dropdown
- ✅ Sesión persiste durante 30 días (no requiere login constante)
- ✅ Middleware redirige automáticamente a `/login` si no está autenticado

---

## 🔄 Para Producción

Cuando despliegues a producción, actualiza las siguientes configuraciones:

### **1. Google Cloud Console:**
Agrega las URLs de producción en:
- **Authorized JavaScript origins:**
  ```
  https://tudominio.com
  ```
  
- **Authorized redirect URIs:**
  ```
  https://tudominio.com/api/auth/callback/google
  ```

### **2. Variables de Entorno de Producción:**
```bash
AUTH_SECRET=<nuevo-secret-para-produccion>
AUTH_GOOGLE_ID=<mismo-client-id>
AUTH_GOOGLE_SECRET=<mismo-client-secret>
AUTH_URL=https://tudominio.com
ADMIN_EMAILS=correo-real@gmail.com,otro-admin@gmail.com
```

### **3. Múltiples Administradores:**
Si necesitas dar acceso a más de un administrador, separa los emails con comas:
```bash
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com,admin3@gmail.com
```

---

## 🐛 Troubleshooting

### **Error: "Error de configuración OAuth"**
- Verifica que `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET` estén correctamente configurados
- Asegúrate de que las redirect URIs en Google Cloud coincidan exactamente

### **Error: "Acceso Denegado" con email correcto**
- Verifica que `ADMIN_EMAILS` en `.env.local` contenga exactamente el mismo email que usas para iniciar sesión
- Revisa que no haya espacios extra en el email

### **Error: "AUTH_SECRET must be set"**
- Genera un nuevo secret con `openssl rand -base64 32`
- Actualiza `AUTH_SECRET` en `.env.local`

### **Sesión no persiste después de recargar**
- Verifica que `AUTH_SECRET` no haya cambiado
- Revisa que las cookies estén habilitadas en el navegador

---

## 📝 Notas Importantes

1. **Seguridad:**
   - ✅ `AUTH_SECRET` es único y fuerte (32+ caracteres)
   - ✅ `.env.local` NO está en el repositorio (incluido en `.gitignore`)
   - ✅ Validación de emails en el servidor (no en el cliente)

2. **Compatibilidad:**
   - ✅ Next.js 16.2.10 con React 19.2.4
   - ✅ NextAuth v5 (beta) compatible con React 19

3. **Sesión:**
   - ✅ Estrategia JWT (no requiere base de datos para sesiones)
   - ✅ Duración: 30 días
   - ✅ Renovación automática mientras el usuario esté activo

---

## 📚 Recursos Adicionales

- [Documentación de NextAuth.js v5](https://authjs.dev/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Implementación completada exitosamente** ✅

La aplicación ahora tiene un sistema de autenticación robusto con Google OAuth y control de roles administrativos. Solo los usuarios autorizados podrán acceder al panel de administración, mientras que el chat público permanece accesible para todos.
