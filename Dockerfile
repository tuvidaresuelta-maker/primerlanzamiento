# ============================================
# Primerlanzamiento - Meta API Integration
# Dockerfile para Node.js/Express
# ============================================

FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variable de entorno
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "src/server.js"]
