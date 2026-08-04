# Primerlanzamiento - Meta API Integration

Integración con Instagram Business API y Facebook Pages API para automatización de mensajería y gestión de publicaciones.

## 🚀 Inicio Rápido

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Meta:

```
APP_ID=tu_app_id
APP_SECRET=tu_app_secret
VERIFY_TOKEN=tu_token_secreto
REDIRECT_URI=https://<tu-ngrok-id>.ngrok-free.dev/auth/facebook/callback
```

### 2. Levantar con Docker

```bash
docker-compose up --build
```

El servidor estará disponible en: `http://localhost:3001`

### 3. Configurar ngrok (para Webhooks)

En otra terminal:

```bash
ngrok http 3001
```

Copia la URL pública (ej: `https://abc123.ngrok-free.dev`) y úsala en:
- Meta Dashboard → Webhooks → URL de callback: `https://abc123.ngrok-free.dev/webhook`
- Meta Dashboard → Facebook Login → Valid OAuth Redirect URIs: `https://abc123.ngrok-free.dev/auth/facebook/callback`

## 📁 Estructura del Proyecto

```
Primerlanzamiento/
├── docker-compose.yml      # Orquestación Docker
├── Dockerfile              # imagen de la app
├── .env.example            # Plantilla de variables
├── package.json            # Dependencias Node.js
└── src/
    ├── server.js           # Entry point Express
    ├── config/
    │   └── meta.js         # Configuración de Meta API
    ├── routes/
    │   ├── webhook.js      # Verificación y recepción de eventos
    │   ├── auth.js         # OAuth flow
    │   └── api.js          # Endpoints Graph API
    ├── services/
    │   ├── instagram.js    # Instagram Graph API
    │   ├── facebook.js     # Facebook Pages API
    │   ├── tokenManager.js # Gestión de tokens
    │   └── webhookProcessor.js # Procesamiento de eventos
    └── middleware/
        └── verifyWebhook.js # Middleware de verificación
```

## 🔑 Flujo de Autenticación

### Paso 1: Iniciar OAuth

```
GET http://localhost:3000/auth/login
```

Redirige a Facebook para autorización.

### Paso 2: Callback de Facebook

Después de autorizar, Facebook redirige a:
```
GET /auth/facebook/callback?code=TU_CODIGO
```

### Paso 3: Obtener tokens

El servidor automáticamente:
1. Intercambia el código por un token de corta duración
2. Lo convierte en token de larga duración (60 días)
3. Lista tus páginas de Facebook

### Paso 4: Seleccionar página

```
POST /auth/select-page
{
  "pageId": "ID_DE_LA_PAGINA",
  "userAccessToken": "TOKEN_DE_LARGA_DURACION"
}
```

Esto guarda el Page Access Token y el Instagram Business Account ID.

## 📡 Endpoints Disponibles

### Health Check
```
GET /health
```

### Webhook
```
GET /webhook              # Verificación
POST /webhook             # Recepción de eventos
GET /webhook/test         # Estado del webhook
```

### Autenticación
```
GET /auth/login           # Iniciar OAuth
GET /auth/facebook/callback # Callback
POST /auth/select-page    # Seleccionar página
GET /auth/status          # Estado de autenticación
```

### Instagram API
```
GET /api/instagram/profile    # Perfil
GET /api/instagram/media      # Publicaciones
GET /api/instagram/media/:id  # Publicación específica
GET /api/instagram/comments/:mediaId # Comentarios
POST /api/instagram/comment   # Responder comentario
POST /api/instagram/message   # Enviar DM
```

### Facebook Pages API
```
GET /api/facebook/pages       # Listar páginas
GET /api/facebook/page/:id    # Detalles de página
POST /api/facebook/post       # Crear publicación
GET /api/facebook/feed        # Feed de la página
POST /api/facebook/message    # Enviar mensaje Messenger
```

## 🔧 Configuración en Meta for Developers

### 1. Crear App
1. Ir a `developers.facebook.com`
2. Mis Apps → Crear App → Tipo: Business
3. Asignar Business Portfolio

### 2. Añadir Productos
- Instagram Graph API
- Facebook Login
- Webhooks
- Pages API
- Messenger Platform

### 3. Configurar Facebook Login
- Valid OAuth Redirect URIs: `https://<tu-dominio>/auth/facebook/callback`
- Web OAuth Login: ✅ ON

### 4. Configurar Webhook
- URL: `https://<tu-dominio>/webhook`
- Token de verificación: Igual al `VERIFY_TOKEN` en `.env`
- Suscribir a: `messages`, `messaging_postbacks`

### 5. Permisos Requeridos
```
instagram_basic
instagram_manage_comments
instagram_manage_messages
pages_show_list
pages_messaging
pages_read_engagement
pages_manage_posts
```

## 🐛 Troubleshooting

### Error: "Variable de entorno faltante"
Verifica que `.env` exista y tenga todos los valores requeridos.

### Error: "Webhook verification failed"
- Asegúrate de que `VERIFY_TOKEN` en `.env` coincida con el configurado en Meta Dashboard
- Verifica que ngrok esté corriendo y la URL sea correcta

### Error: "Invalid redirect_uri"
- La URL en Meta Dashboard debe coincidir exactamente con `REDIRECT_URI` en `.env`
- Incluye `https://` y el puerto si es necesario

### Error: "Token expired"
Los tokens de larga duración duran 60 días. Implementa auto-renovación o renueva manualmente.

## 📚 Recursos

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Facebook Pages API Docs](https://developers.facebook.com/docs/pages-api)
- [Webhooks Guide](https://developers.facebook.com/docs/graph-api/webhooks)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)

## 📄 Licencia

ISC
