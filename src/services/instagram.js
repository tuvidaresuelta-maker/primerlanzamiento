// ============================================
// Instagram Graph API Service
// ============================================

const axios = require('axios');
const config = require('../config/meta');

class InstagramService {
  constructor() {
    this.baseUrl = config.graphApiBase;
    this.accessToken = config.pageAccessToken;
    this.accountId = config.instagramAccountId;
  }

  // Obtener perfil de Instagram Business
  async getProfile() {
    const response = await axios.get(
      `${this.baseUrl}/${this.accountId}`,
      {
        params: {
          fields: 'id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url',
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Obtener publicaciones (media)
  async getMedia(limit = 10) {
    const response = await axios.get(
      `${this.baseUrl}/${this.accountId}/media`,
      {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          limit,
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Obtener publicación específica
  async getMediaById(mediaId) {
    const response = await axios.get(
      `${this.baseUrl}/${mediaId}`,
      {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,children{media_url,media_type}',
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Obtener comentarios de una publicación
  async getComments(mediaId) {
    const response = await axios.get(
      `${this.baseUrl}/${mediaId}/comments`,
      {
        params: {
          fields: 'id,text,timestamp,username',
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Responder a un comentario
  async replyToComment(mediaId, message) {
    const response = await axios.post(
      `${this.baseUrl}/${mediaId}/comments`,
      {
        message
      },
      {
        params: {
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Enviar mensaje directo (DM)
  async sendDirectMessage(recipientId, message) {
    const response = await axios.post(
      `${this.baseUrl}/me/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message }
      },
      {
        params: {
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Obtener insights de la cuenta
  async getInsights(metric = 'impressions', period = 'day') {
    const response = await axios.get(
      `${this.baseUrl}/${this.accountId}/insights`,
      {
        params: {
          metric,
          period,
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }
}

module.exports = new InstagramService();
