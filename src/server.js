// ============================================
// Primerlanzamiento - Server Entry Point
// ============================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Importar rutas
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// Importar configuración
const config = require('./config/meta');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================

// Seguridad
app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan('combined'));

// Parsing de body - IMPORTANTE: Webhook necesita raw body para verificación
app.use(express.json({ verify: (req, res, buf) => {
  req.rawBody = buf;
}}));
app.use(express.urlencoded({ extended: true }));

// ============================================
// Rutas
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Primerlanzamiento',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Webhook routes
app.use('/webhook', webhookRoutes);

// Auth routes (OAuth flow)
app.use('/auth', authRoutes);

// API routes
app.use('/api', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    service: 'Primerlanzamiento - Meta API Integration',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      webhook: '/webhook',
      auth: '/auth',
      api: '/api'
    }
  });
});

// ============================================
// Error handling
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// Iniciar servidor
// ============================================

app.listen(PORT, () => {
  console.log(`
  ===================================
  Primerlanzamiento Server
  ===================================
  Puerto:        ${PORT}
  Entorno:       ${process.env.NODE_ENV || 'development'}
  Meta App:      ${config.appId ? 'Configurada' : 'NO CONFIGURADA'}
  Verify Token:  ${config.verifyToken || 'NO CONFIGURADO'}
  ===================================
  `);
});

module.exports = app;
