// ============================================
// Token Manager - OAuth & Token Exchange
// ============================================

const axios = require('axios');
const config = require('../config/meta');

class TokenManager {
  constructor() {
    this.baseUrl = config.graphApiBase;
  }

  // Intercambiar código de autorización por token de corta duración
  async exchangeCodeForToken(code) {
    const response = await axios.get(
      `${this.baseUrl}/oauth/access_token`,
      {
        params: {
          client_id: config.appId,
          client_secret: config.appSecret,
          redirect_uri: config.redirectUri,
          code
        }
      }
    );
    return response.data.access_token;
  }

  // Intercambiar token de corta duración por token de larga duración (60 días)
  async getLongLivedToken(shortLivedToken) {
    const response = await axios.get(
      `${this.baseUrl}/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: config.appId,
          client_secret: config.appSecret,
          fb_exchange_token: shortLivedToken
        }
      }
    );
    return response.data.access_token;
  }

  // Obtener páginas del usuario con sus tokens
  async getUserPages(userAccessToken) {
    const response = await axios.get(
      `${this.baseUrl}/me/accounts`,
      {
        params: {
          fields: 'id,name,access_token,category',
          access_token: userAccessToken
        }
      }
    );
    return response.data.data;
  }

  // Obtener token de acceso de página
  async getPageAccessToken(pageId, userAccessToken) {
    const response = await axios.get(
      `${this.baseUrl}/${pageId}`,
      {
        params: {
          fields: 'id,name,access_token',
          access_token: userAccessToken
        }
      }
    );
    return {
      id: response.data.id,
      name: response.data.name,
      accessToken: response.data.access_token
    };
  }

  // Obtener Instagram Business Account ID vinculado a una página
  async getInstagramAccountId(pageId, pageAccessToken) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${pageId}`,
        {
          params: {
            fields: 'instagram_business_account',
            access_token: pageAccessToken
          }
        }
      );
      return response.data.instagram_business_account?.id || null;
    } catch (error) {
      console.warn('No Instagram Business Account linked to this page');
      return null;
    }
  }

  // Verificar si un token es válido
  async debugToken(token) {
    const response = await axios.get(
      `${this.baseUrl}/debug_token`,
      {
        params: {
          input_token: token,
          access_token: `${config.appId}|${config.appSecret}`
        }
      }
    );
    return response.data.data;
  }

  // Renovar token de larga duración (llamar antes de que expire)
  async refreshLongLivedToken(longLivedToken) {
    const response = await axios.get(
      `${this.baseUrl}/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: config.appId,
          client_secret: config.appSecret,
          fb_exchange_token: longLivedToken
        }
      }
    );
    return response.data.access_token;
  }
}

module.exports = new TokenManager();
