import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Caminho para o arquivo products.json
const productsFilePath = path.join(__dirname, 'data', 'products.json');

// Documentação Swagger inline
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Neo Product Hub API',
    description: 'API para gerenciamento de produtos com persistência em arquivo JSON',
    version: '1.0.0',
    contact: {
      name: 'Neo Product Hub',
      email: 'admin@neoproducthub.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de Desenvolvimento'
    }
  ],
  paths: {
    '/api/products': {
      get: {
        summary: 'Listar todos os produtos',
        description: 'Retorna uma lista de todos os produtos cadastrados',
        responses: {
          '200': {
            description: 'Lista de produtos retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product'
                  }
                }
              }
            }
          },
          '500': {
            description: 'Erro interno do servidor'
          }
        }
      },
      post: {
        summary: 'Criar novo produto',
        description: 'Cria um novo produto no sistema',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'price', 'stock', 'active'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nome do produto'
                  },
                  description: {
                    type: 'string',
                    description: 'Descrição do produto'
                  },
                  price: {
                    type: 'number',
                    description: 'Preço do produto'
                  },
                  stock: {
                    type: 'number',
                    description: 'Quantidade em estoque'
                  },
                  active: {
                    type: 'boolean',
                    description: 'Status ativo do produto'
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Produto criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          },
          '500': {
            description: 'Erro interno do servidor'
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        summary: 'Buscar produto por ID',
        description: 'Retorna um produto específico pelo ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do produto',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Produto encontrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          },
          '404': {
            description: 'Produto não encontrado'
          },
          '500': {
            description: 'Erro interno do servidor'
          }
        }
      },
      put: {
        summary: 'Atualizar produto',
        description: 'Atualiza um produto existente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do produto',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nome do produto'
                  },
                  description: {
                    type: 'string',
                    description: 'Descrição do produto'
                  },
                  price: {
                    type: 'number',
                    description: 'Preço do produto'
                  },
                  stock: {
                    type: 'number',
                    description: 'Quantidade em estoque'
                  },
                  active: {
                    type: 'boolean',
                    description: 'Status ativo do produto'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Produto atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          },
          '404': {
            description: 'Produto não encontrado'
          },
          '500': {
            description: 'Erro interno do servidor'
          }
        }
      },
      delete: {
        summary: 'Deletar produto',
        description: 'Remove um produto do sistema',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do produto',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '204': {
            description: 'Produto deletado com sucesso'
          },
          '404': {
            description: 'Produto não encontrado'
          },
          '500': {
            description: 'Erro interno do servidor'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        required: ['id', 'name', 'description', 'price', 'stock', 'active', 'createdAt', 'updatedAt'],
        properties: {
          id: {
            type: 'string',
            description: 'ID único do produto'
          },
          name: {
            type: 'string',
            description: 'Nome do produto'
          },
          description: {
            type: 'string',
            description: 'Descrição do produto'
          },
          price: {
            type: 'number',
            description: 'Preço do produto'
          },
          stock: {
            type: 'number',
            description: 'Quantidade em estoque'
          },
          active: {
            type: 'boolean',
            description: 'Status ativo do produto'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização'
          }
        }
      }
    }
  }
};

// Rota para documentação Swagger
app.get('/api-docs', (req, res) => {
  res.json(swaggerDocument);
});

// Rota para interface Swagger UI
app.get('/swagger', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neo Product Hub API - Swagger</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        <style>
            html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin:0; background: #fafafa; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function() {
                const ui = SwaggerUIBundle({
                    url: '/api-docs',
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "StandaloneLayout"
                });
            };
        </script>
    </body>
    </html>
  `;
  res.send(html);
});

// Função para ler produtos do arquivo
function readProductsFromFile() {
  try {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    return [];
  }
}

// Função para escrever produtos no arquivo
function writeProductsToFile(products) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
    return false;
  }
}

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
  try {
    const products = readProductsFromFile();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler produtos' });
  }
});

// Rota para obter produto por ID
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Rota para criar novo produto
app.post('/api/products', (req, res) => {
  try {
    const products = readProductsFromFile();
    const newProduct = {
      ...req.body,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    
    if (writeProductsToFile(products)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ error: 'Erro ao salvar produto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Rota para atualizar produto
app.put('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    const updatedProduct = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    
    products[index] = updatedProduct;
    
    if (writeProductsToFile(products)) {
      res.json(updatedProduct);
    } else {
      res.status(500).json({ error: 'Erro ao salvar produto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Rota para deletar produto
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    if (writeProductsToFile(filteredProducts)) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Arquivo de produtos: ${productsFilePath}`);
  console.log(`📚 Documentação da API: http://localhost:${PORT}/swagger`);
  console.log(`🔗 Endpoint da API: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Teste da API: http://localhost:${PORT}/api/products`);
});
