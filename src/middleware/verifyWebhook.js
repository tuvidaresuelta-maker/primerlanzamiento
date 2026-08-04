// ============================================
// Webhook Verification Middleware
// ============================================

const config = require('../config/meta');

/**
 * Middleware para verificar la firma del webhook de Meta
 * Nota: Meta no envía firma HMAC como WhatsApp, pero es buena práctica
 * tener un middleware de verificación para otros usos
 */
const verifyWebhook = (req, res, next) => {
  // Para webhooks de Facebook/Instagram, la verificación es por token
  // Este middleware es para verificación adicional si es necesaria
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];

  // Si es una solicitud de verificación
  if (mode === 'subscribe') {
    if (token !== config.verifyToken) {
      console.error('Webhook verification failed: Invalid token');
      return res.sendStatus(403);
    }
    // La verificación real se hace en la ruta
    return next();
  }

  // Para solicitudes POST, verificar que venga de Meta
  // (En producción, verificar IPs de Meta o usar HTTPS)
  next();
};

/**
 * Middleware para logging de webhooks
 */
const logWebhook = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const bodySize = JSON.stringify(req.body || {}).length;

  console.log(`[${timestamp}] Webhook ${method} ${path} (${bodySize} bytes)`);

  next();
};

module.exports = {
  verifyWebhook,
  logWebhook
};
