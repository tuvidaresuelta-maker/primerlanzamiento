// ============================================
// Meta API Configuration
// ============================================

const config = {
  // App Credentials
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  
  // Webhook
  verifyToken: process.env.VERIFY_TOKEN,
  
  // OAuth
  redirectUri: process.env.REDIRECT_URI,
  
  // Tokens
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
  userAccessToken: process.env.USER_ACCESS_TOKEN,
  
  // Account IDs
  instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID,
  facebookPageId: process.env.FACEBOOK_PAGE_ID,
  
  // API Versions
  graphApiVersion: 'v19.0',
  
  // Base URLs
  get graphApiBase() {
    return `https://graph.facebook.com/${this.graphApiVersion}`;
  },
  
  get oauthUrl() {
    return `https://www.facebook.com/${this.graphApiVersion}/dialog/oauth`;
  },
  
  // Scopes requeridos
  scopes: [
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_messages',
    'pages_show_list',
    'pages_messaging',
    'pages_read_engagement',
    'pages_manage_posts'
  ].join(','),
  
  // Validar configuración
  validate() {
    const required = ['appId', 'appSecret', 'verifyToken'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      console.warn(`⚠️  Variables de entorno faltantes: ${missing.join(', ')}`);
      console.warn('   Copia .env.example como .env y completa los valores');
      return false;
    }
    return true;
  }
};

module.exports = config;
