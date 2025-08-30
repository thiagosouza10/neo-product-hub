// Configurações do Backend
export const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost'
  },
  
  // Configurações da API
  api: {
    basePath: '/api',
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
      credentials: true
    }
  },
  
  // Configurações de dados
  data: {
    productsFile: 'data/products.json',
    backupDir: 'data/backups'
  },
  
  // Configurações do Swagger
  swagger: {
    title: 'Neo Product Hub API',
    version: '1.0.0',
    description: 'API para gerenciamento de produtos com persistência em arquivo JSON'
  }
};
