// ============================================
// Webhook Routes - Meta Integration
// ============================================

const express = require('express');
const router = express.Router();
const config = require('../config/meta');
const webhookProcessor = require('../services/webhookProcessor');

// GET /webhook - Verificación del Webhook
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification request:', { mode, token });
  console.log('Config verifyToken:', config.verifyToken);
  console.log('Token match:', token === config.verifyToken);

  if (mode === 'subscribe' && token === config.verifyToken) {
    console.log('✅ Webhook verificado exitosamente');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Verificación fallida - Token no coincide');
    res.sendStatus(403);
  }
});

// POST /webhook - Recepción de eventos
router.post('/', async (req, res) => {
  const body = req.body;

  console.log('📨 Webhook event received:', {
    object: body.object,
    entryCount: body.entry?.length
  });

  // Responder inmediatamente a Meta (requerido)
  res.status(200).send('EVENT_RECEIVED');

  // Procesar eventos de forma asíncrona
  try {
    await webhookProcessor.processEvent(body);
  } catch (error) {
    console.error('Error procesando webhook:', error.message);
  }
});

// GET /webhook/test - Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({
    status: 'Webhook endpoint active',
    verifyToken: config.verifyToken ? 'Configurado' : 'NO CONFIGURADO',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
