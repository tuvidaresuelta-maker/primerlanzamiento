// ============================================
// Auth Routes - OAuth Facebook Login
// ============================================

const express = require('express');
const router = express.Router();
const config = require('../config/meta');
const tokenManager = require('../services/tokenManager');

// GET /auth/login - Redirigir a Facebook para autorización
router.get('/login', (req, res) => {
  const authUrl = `${config.oauthUrl}?client_id=${config.appId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scopes}&response_type=code`;
  
  console.log('🔐 Redirigiendo a Facebook OAuth...');
  res.redirect(authUrl);
});

// GET /auth/facebook/callback - Callback después de la autorización
router.get('/facebook/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    console.error('❌ OAuth error:', error, error_description);
    return res.status(400).json({
      error: 'Authorization failed',
      details: error_description
    });
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code received' });
  }

  try {
    console.log('🔑 Intercambiando código por token de corta duración...');
    
    // Intercambiar código por token de corta duración
    const shortLivedToken = await tokenManager.exchangeCodeForToken(code);
    
    console.log('🔄 Obteniendo token de larga duración...');
    
    // Intercambiar por token de larga duración
    const longLivedToken = await tokenManager.getLongLivedToken(shortLivedToken);
    
    console.log('📄 Obteniendo páginas del usuario...');
    
    // Obtener páginas del usuario
    const pages = await tokenManager.getUserPages(longLivedToken);
    
    res.json({
      success: true,
      message: 'Token obtenido exitosamente',
      data: {
        longLivedToken: longLivedToken.substring(0, 20) + '...',
        pages: pages
      },
      instructions: [
        '1. Selecciona una página de la lista',
        '2. Usa POST /auth/select-page con el pageId',
        '3. Esto guardará el Page Access Token'
      ]
    });
  } catch (error) {
    console.error('❌ Error en OAuth callback:', error.message);
    res.status(500).json({
      error: 'Token exchange failed',
      message: error.message
    });
  }
});

// POST /auth/select-page - Seleccionar página y obtener token
router.post('/select-page', async (req, res) => {
  const { pageId, userAccessToken } = req.body;

  if (!pageId || !userAccessToken) {
    return res.status(400).json({
      error: 'pageId and userAccessToken are required'
    });
  }

  try {
    console.log(`📄 Seleccionando página ${pageId}...`);
    
    const pageData = await tokenManager.getPageAccessToken(pageId, userAccessToken);
    
    // Obtener Instagram Business Account vinculado
    const instagramAccount = await tokenManager.getInstagramAccountId(pageId, pageData.accessToken);
    
    res.json({
      success: true,
      message: 'Página seleccionada exitosamente',
      data: {
        pageId: pageId,
        pageName: pageData.name,
        pageAccessToken: pageData.accessToken.substring(0, 20) + '...',
        instagramAccountId: instagramAccount
      },
      instructions: [
        '1. Copia estos valores a tu archivo .env',
        '2. PAGE_ACCESS_TOKEN=' + pageData.accessToken,
        '3. FACEBOOK_PAGE_ID=' + pageId,
        '4. INSTAGRAM_ACCOUNT_ID=' + (instagramAccount || 'No vinculada')
      ]
    });
  } catch (error) {
    console.error('❌ Error seleccionando página:', error.message);
    res.status(500).json({
      error: 'Page selection failed',
      message: error.message
    });
  }
});

// GET /auth/status - Verificar estado de autenticación
router.get('/status', (req, res) => {
  res.json({
    configured: {
      appId: !!config.appId,
      appSecret: !!config.appSecret,
      pageAccessToken: !!config.pageAccessToken,
      instagramAccountId: !!config.instagramAccountId,
      facebookPageId: !!config.facebookPageId
    },
    redirectUri: config.redirectUri
  });
});

module.exports = router;
