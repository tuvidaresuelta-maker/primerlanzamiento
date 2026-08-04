// ============================================
// API Routes - Graph API Operations
// ============================================

const express = require('express');
const router = express.Router();
const instagramService = require('../services/instagram');
const facebookService = require('../services/facebook');
const config = require('../config/meta');

// Middleware de verificación de token
const requireToken = (req, res, next) => {
  if (!config.pageAccessToken) {
    return res.status(400).json({
      error: 'Page Access Token not configured',
      instructions: 'Complete OAuth flow at /auth/login first'
    });
  }
  next();
};

// ============================================
// Instagram Endpoints
// ============================================

// GET /api/instagram/profile - Obtener perfil de Instagram
router.get('/instagram/profile', requireToken, async (req, res) => {
  try {
    const profile = await instagramService.getProfile();
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/instagram/media - Obtener publicaciones
router.get('/instagram/media', requireToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const media = await instagramService.getMedia(limit);
    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/instagram/media/:id - Obtener publicación específica
router.get('/instagram/media/:id', requireToken, async (req, res) => {
  try {
    const media = await instagramService.getMediaById(req.params.id);
    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/instagram/comments/:mediaId - Obtener comentarios
router.get('/instagram/comments/:mediaId', requireToken, async (req, res) => {
  try {
    const comments = await instagramService.getComments(req.params.mediaId);
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/instagram/comment - Responder comentario
router.post('/instagram/comment', requireToken, async (req, res) => {
  try {
    const { mediaId, message } = req.body;
    const result = await instagramService.replyToComment(mediaId, message);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/instagram/message - Enviar mensaje directo
router.post('/instagram/message', requireToken, async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const result = await instagramService.sendDirectMessage(recipientId, message);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Facebook Pages Endpoints
// ============================================

// GET /api/facebook/pages - Obtener páginas
router.get('/facebook/pages', requireToken, async (req, res) => {
  try {
    const pages = await facebookService.getPages();
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/facebook/page/:id - Obtener detalles de página
router.get('/facebook/page/:id', requireToken, async (req, res) => {
  try {
    const page = await facebookService.getPageDetails(req.params.id);
    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/facebook/post - Crear publicación
router.post('/facebook/post', requireToken, async (req, res) => {
  try {
    const { message, link } = req.body;
    const result = await facebookService.createPost(message, link);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/facebook/feed - Obtener feed de la página
router.get('/facebook/feed', requireToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const feed = await facebookService.getPageFeed(limit);
    res.json({ success: true, data: feed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/facebook/message - Enviar mensaje vía Messenger
router.post('/facebook/message', requireToken, async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const result = await facebookService.sendMessage(recipientId, message);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Token Management Endpoints
// ============================================

// POST /api/token/refresh - Renovar token de larga duración
router.post('/token/refresh', async (req, res) => {
  try {
    const { userAccessToken } = req.body;
    const newToken = await tokenManager.getLongLivedToken(userAccessToken);
    res.json({ success: true, data: { longLivedToken: newToken } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
