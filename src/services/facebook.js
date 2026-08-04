// ============================================
// Facebook Pages API Service
// ============================================

const axios = require('axios');
const config = require('../config/meta');

class FacebookService {
  constructor() {
    this.baseUrl = config.graphApiBase;
    this.accessToken = config.pageAccessToken;
    this.pageId = config.facebookPageId;
  }

  // Obtener páginas del usuario
  async getPages() {
    const response = await axios.get(
      `${this.baseUrl}/me/accounts`,
      {
        params: {
          fields: 'id,name,access_token,category,category_list',
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Obtener detalles de una página
  async getPageDetails(pageId = this.pageId) {
    const response = await axios.get(
      `${this.baseUrl}/${pageId}`,
      {
        params: {
          fields: 'id,name,about,description,category,website,followers_count,link',
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Crear publicación en la página
  async createPost(message, link = null) {
    const postData = { message };
    if (link) postData.link = link;

    const response = await axios.post(
      `${this.baseUrl}/${this.pageId}/feed`,
      postData,
      {
        params: {
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Obtener feed de la página
  async getPageFeed(limit = 10) {
    const response = await axios.get(
      `${this.pageId}/feed`,
      {
        params: {
          fields: 'id,message,created_time,full_picture,permalink_url,likes.summary(true),comments.summary(true)',
          limit,
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Enviar mensaje vía Messenger
  async sendMessage(recipientId, message) {
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

  // Obtener conversaciones
  async getConversations(limit = 10) {
    const response = await axios.get(
      `${this.pageId}/conversations`,
      {
        params: {
          fields: 'id,snippet,unread_count,updated_time',
          limit,
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  // Obtener mensajes de una conversación
  async getConversationMessages(conversationId) {
    const response = await axios.get(
      `${this.baseUrl}/${conversationId}/messages`,
      {
        params: {
          fields: 'id,message,created_time,from',
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }
}

module.exports = new FacebookService();
