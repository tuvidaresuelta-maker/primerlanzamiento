// ============================================
// Webhook Event Processor
// ============================================

const instagramService = require('./instagram');
const facebookService = require('./facebook');

class WebhookProcessor {
  constructor() {
    this.eventHandlers = {
      'page': this.handlePageEvent.bind(this),
      'instagram': this.handleInstagramEvent.bind(this)
    };
  }

  // Procesar evento principal del webhook
  async processEvent(body) {
    const { object, entry } = body;

    console.log(`Processing ${object} event with ${entry?.length} entries`);

    // Manejar por tipo de objeto
    if (this.eventHandlers[object]) {
      for (const entryItem of entry || []) {
        await this.eventHandlers[object](entryItem);
      }
    } else {
      console.warn(`Unknown object type: ${object}`);
    }
  }

  // Manejar eventos de Facebook Page
  async handlePageEvent(entry) {
    const { id, time, messaging } = entry;

    console.log(`Processing page event for page ${id}`);

    for (const event of messaging || []) {
      await this.processMessagingEvent(event);
    }
  }

  // Manejar eventos de Instagram
  async handleInstagramEvent(entry) {
    const { id, time, changes } = entry;

    console.log(`Processing Instagram event for account ${id}`);

    for (const change of changes || []) {
      await this.processInstagramChange(change);
    }
  }

  // Procesar eventos de mensajería (Messenger)
  async processMessagingEvent(event) {
    const { sender, recipient, timestamp, message, postback } = event;

    console.log('Messaging event:', {
      sender: sender?.id,
      recipient: recipient?.id,
      type: message ? 'message' : postback ? 'postback' : 'unknown'
    });

    // Manejar mensajes entrantes
    if (message) {
      await this.handleIncomingMessage(sender.id, message);
    }

    // Manejar postbacks (botones)
    if (postback) {
      await this.handlePostback(sender.id, postback);
    }
  }

  // Procesar cambios en Instagram
  async processInstagramChange(change) {
    const { field, value } = change;

    console.log('Instagram change:', { field, value });

    switch (field) {
      case 'comments':
        await this.handleNewComment(value);
        break;
      case 'mentions':
        await this.handleMention(value);
        break;
      case 'story_insights':
        await this.handleStoryInsights(value);
        break;
      default:
        console.log(`Unhandled Instagram field: ${field}`);
    }
  }

  // Manejar mensaje entrante
  async handleIncomingMessage(senderId, message) {
    console.log('Incoming message:', {
      from: senderId,
      text: message.text,
      mid: message.mid
    });

    // Aquí puedes implementar:
    // 1. Chatbot con respuestas automáticas
    // 2. Guardar en base de datos
    // 3. Reenviar a un sistema de atención al cliente
    // 4. Log para análisis

    // Ejemplo: respuesta automática
    if (message.text?.toLowerCase() === 'hola') {
      await facebookService.sendMessage(senderId, '¡Hola! ¿En qué puedo ayudarte?');
    }
  }

  // Manejar postback
  async handlePostback(senderId, postback) {
    console.log('Postback received:', {
      from: senderId,
      payload: postback.payload,
      title: postback.title
    });

    // Implementar lógica según el payload
    switch (postback.payload) {
      case 'GET_STARTED':
        await facebookService.sendMessage(senderId, '¡Bienvenido! ¿Cómo puedo asistirte?');
        break;
      case 'HELP':
        await facebookService.sendMessage(senderId, 'Estoy aquí para ayudarte. ¿Qué necesitas?');
        break;
      default:
        console.log(`Unknown postback payload: ${postback.payload}`);
    }
  }

  // Manejar nuevo comentario en Instagram
  async handleNewComment(value) {
    console.log('New Instagram comment:', value);

    // Aquí puedes implementar:
    // 1. Respuesta automática a comentarios
    // 2. Notificaciones
    // 3. Análisis de sentimiento
    // 4. Filtrado de spam
  }

  // Manejar mención en Instagram
  async handleMention(value) {
    console.log('Instagram mention:', value);

    // Implementar lógica para menciones en stories o posts
  }

  // Manejar insights de stories
  async handleStoryInsights(value) {
    console.log('Story insights:', value);

    // Almacenar métricas de stories
  }
}

module.exports = new WebhookProcessor();
