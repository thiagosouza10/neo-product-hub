import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllUsers,
  getUserById,
  authenticateUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  toggleUserStatus,
} from './services/UserService.js';
import {
  USER_ROLE_VALUES,
  FIELD_LIMITS,
  createValidationErrorResponse,
  validateIdParam,
  validateUsernameParam,
  validateLoginPayload,
  validatePasswordChangePayload,
  validateUserPayload,
  validateProductPayload,
} from './validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, 'data', 'products.json');

const createValidationErrorSchema = () => ({
  type: 'object',
  required: ['error', 'details'],
  properties: {
    error: {
      type: 'string',
      example: 'Nome do produto deve ter no minimo 3 caracteres.',
    },
    details: {
      type: 'array',
      items: {
        type: 'object',
        required: ['field', 'message'],
        properties: {
          field: {
            type: 'string',
            example: 'name',
          },
          message: {
            type: 'string',
            example: 'Nome do produto deve ter no minimo 3 caracteres.',
          },
        },
      },
    },
  },
});

const createBasicErrorSchema = example => ({
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'string',
      example,
    },
  },
});

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Neo Product Hub API',
    description:
      'API REST para gerenciamento de usuarios e produtos com persistencia em arquivo JSON.',
    version: '2.0.0',
    contact: {
      name: 'Neo Product Hub',
      email: 'admin@neoproducthub.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Servidor de desenvolvimento',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Autenticacao de usuarios' },
    { name: 'Users', description: 'Gestao de usuarios' },
    { name: 'Products', description: 'Gestao de produtos' },
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Realizar login',
        description:
          'Autentica um usuario ativo pelo par username e password e atualiza o ultimo login.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'message', 'user'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Login realizado com sucesso.',
                    },
                    user: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Erro de validacao',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '401': {
            description: 'Credenciais invalidas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar usuarios',
        description: 'Retorna todos os usuarios cadastrados sem o campo password.',
        responses: {
          '200': {
            description: 'Lista de usuarios retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Criar usuario',
        description:
          'Cria um novo usuario. Todos os campos do body sao obrigatorios e campos extras nao sao permitidos.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserCreateRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            description: 'Erro de validacao',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '409': {
            description: 'Username ja utilizado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar usuario por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.id.min,
              maxLength: FIELD_LIMITS.id.max,
              pattern: '^[A-Za-z0-9_-]+$',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Usuario encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            description: 'ID invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '404': {
            description: 'Usuario nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Atualizar usuario',
        description:
          'Atualiza parcialmente um usuario. Aceita apenas name, username, password, role e active.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.id.min,
              maxLength: FIELD_LIMITS.id.max,
              pattern: '^[A-Za-z0-9_-]+$',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserUpdateRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuario atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            description: 'Erro de validacao',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '403': {
            description: 'Alteracao nao permitida para o admin principal',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '404': {
            description: 'Usuario nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '409': {
            description: 'Username ja utilizado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Remover usuario',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.id.min,
              maxLength: FIELD_LIMITS.id.max,
              pattern: '^[A-Za-z0-9_-]+$',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Usuario removido com sucesso',
          },
          '400': {
            description: 'ID invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '403': {
            description: 'Nao permite remover o admin principal',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '404': {
            description: 'Usuario nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
    '/api/users/{username}/password': {
      put: {
        tags: ['Users'],
        summary: 'Alterar senha',
        description: 'Atualiza a senha de um usuario usando o username informado na rota.',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.username.min,
              maxLength: FIELD_LIMITS.username.max,
              pattern: '^[A-Za-z0-9._-]+$',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PasswordChangeRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Senha alterada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Senha alterada com sucesso.',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Erro de validacao',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '404': {
            description: 'Usuario nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
    '/api/users/{id}/toggle-status': {
      put: {
        tags: ['Users'],
        summary: 'Alternar status do usuario',
        description: 'Inverte o valor de active para o usuario informado.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.id.min,
              maxLength: FIELD_LIMITS.id.max,
              pattern: '^[A-Za-z0-9_-]+$',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Status alterado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            description: 'ID invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '403': {
            description: 'Nao permite desativar o admin principal',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '404': {
            description: 'Usuario nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Listar produtos',
        description: 'Retorna todos os produtos cadastrados.',
        responses: {
          '200': {
            description: 'Lista de produtos retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Criar produto',
        description:
          'Cria um novo produto. Todos os campos do body sao obrigatorios e campos extras nao sao permitidos.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductCreateRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Produto criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          '400': {
            description: 'Erro de validacao',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Buscar produto por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.id.min,
              maxLength: FIELD_LIMITS.id.max,
              pattern: '^[A-Za-z0-9_-]+$',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Produto encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          '400': {
            description: 'ID invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '404': {
            description: 'Produto nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Atualizar produto',
        description:
          'Atualiza parcialmente um produto. Aceita apenas name, description, price, stock e active.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.id.min,
              maxLength: FIELD_LIMITS.id.max,
              pattern: '^[A-Za-z0-9_-]+$',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductUpdateRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Produto atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          '400': {
            description: 'Erro de validacao',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '404': {
            description: 'Produto nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Remover produto',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              minLength: FIELD_LIMITS.id.min,
              maxLength: FIELD_LIMITS.id.max,
              pattern: '^[A-Za-z0-9_-]+$',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Produto removido com sucesso',
          },
          '400': {
            description: 'ID invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          },
          '404': {
            description: 'Produto nao encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BasicError',
                },
              },
            },
          },
          '500': {
            description: 'Erro interno do servidor',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ValidationError: createValidationErrorSchema(),
      BasicError: createBasicErrorSchema('Recurso nao encontrado.'),
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        additionalProperties: false,
        properties: {
          username: {
            type: 'string',
            minLength: FIELD_LIMITS.username.min,
            maxLength: FIELD_LIMITS.username.max,
            pattern: '^[A-Za-z0-9._-]+$',
            example: 'admin',
          },
          password: {
            type: 'string',
            minLength: FIELD_LIMITS.password.min,
            maxLength: FIELD_LIMITS.password.max,
            example: 'admin123',
          },
        },
      },
      PasswordChangeRequest: {
        type: 'object',
        required: ['newPassword'],
        additionalProperties: false,
        properties: {
          newPassword: {
            type: 'string',
            minLength: FIELD_LIMITS.password.min,
            maxLength: FIELD_LIMITS.password.max,
            example: 'novaSenha123',
          },
        },
      },
      User: {
        type: 'object',
        required: ['id', 'name', 'username', 'role', 'active', 'createdAt', 'lastLogin'],
        properties: {
          id: {
            type: 'string',
            example: '1',
          },
          name: {
            type: 'string',
            example: 'Administrador',
          },
          username: {
            type: 'string',
            example: 'admin',
          },
          role: {
            type: 'string',
            enum: USER_ROLE_VALUES,
            example: 'admin',
          },
          active: {
            type: 'boolean',
            example: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-17T18:47:30.697Z',
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T18:47:30.697Z',
          },
        },
      },
      UserCreateRequest: {
        type: 'object',
        required: ['name', 'username', 'password', 'role', 'active'],
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            minLength: FIELD_LIMITS.name.min,
            maxLength: FIELD_LIMITS.name.max,
            example: 'Maria Santos',
          },
          username: {
            type: 'string',
            minLength: FIELD_LIMITS.username.min,
            maxLength: FIELD_LIMITS.username.max,
            pattern: '^[A-Za-z0-9._-]+$',
            example: 'maria',
          },
          password: {
            type: 'string',
            minLength: FIELD_LIMITS.password.min,
            maxLength: FIELD_LIMITS.password.max,
            example: 'senha123',
          },
          role: {
            type: 'string',
            enum: USER_ROLE_VALUES,
            example: 'user',
          },
          active: {
            type: 'boolean',
            example: true,
          },
        },
      },
      UserUpdateRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            minLength: FIELD_LIMITS.name.min,
            maxLength: FIELD_LIMITS.name.max,
          },
          username: {
            type: 'string',
            minLength: FIELD_LIMITS.username.min,
            maxLength: FIELD_LIMITS.username.max,
            pattern: '^[A-Za-z0-9._-]+$',
          },
          password: {
            type: 'string',
            minLength: FIELD_LIMITS.password.min,
            maxLength: FIELD_LIMITS.password.max,
          },
          role: {
            type: 'string',
            enum: USER_ROLE_VALUES,
          },
          active: {
            type: 'boolean',
          },
        },
      },
      Product: {
        type: 'object',
        required: [
          'id',
          'name',
          'description',
          'price',
          'stock',
          'active',
          'createdAt',
          'updatedAt',
        ],
        properties: {
          id: {
            type: 'string',
            example: 'mo39hi2fe6a3rc5qw4',
          },
          name: {
            type: 'string',
            example: 'Smartphone Galaxy S23',
          },
          description: {
            type: 'string',
            example: 'Smartphone Samsung Galaxy S23 com 128GB e camera de 50MP.',
          },
          price: {
            type: 'number',
            minimum: FIELD_LIMITS.price.min,
            maximum: FIELD_LIMITS.price.max,
            example: 3999.99,
          },
          stock: {
            type: 'integer',
            minimum: FIELD_LIMITS.stock.min,
            maximum: FIELD_LIMITS.stock.max,
            example: 15,
          },
          active: {
            type: 'boolean',
            example: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-17T18:48:37.815Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-04-17T18:48:37.815Z',
          },
        },
      },
      ProductCreateRequest: {
        type: 'object',
        required: ['name', 'description', 'price', 'stock', 'active'],
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            minLength: FIELD_LIMITS.productName.min,
            maxLength: FIELD_LIMITS.productName.max,
            example: 'Notebook Dell Inspiron',
          },
          description: {
            type: 'string',
            minLength: FIELD_LIMITS.description.min,
            maxLength: FIELD_LIMITS.description.max,
            example: 'Notebook Dell Inspiron 15 com Intel i5, 8GB RAM e 256GB SSD.',
          },
          price: {
            type: 'number',
            minimum: FIELD_LIMITS.price.min,
            maximum: FIELD_LIMITS.price.max,
            example: 2899.99,
          },
          stock: {
            type: 'integer',
            minimum: FIELD_LIMITS.stock.min,
            maximum: FIELD_LIMITS.stock.max,
            example: 8,
          },
          active: {
            type: 'boolean',
            example: true,
          },
        },
      },
      ProductUpdateRequest: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: {
            type: 'string',
            minLength: FIELD_LIMITS.productName.min,
            maxLength: FIELD_LIMITS.productName.max,
          },
          description: {
            type: 'string',
            minLength: FIELD_LIMITS.description.min,
            maxLength: FIELD_LIMITS.description.max,
          },
          price: {
            type: 'number',
            minimum: FIELD_LIMITS.price.min,
            maximum: FIELD_LIMITS.price.max,
          },
          stock: {
            type: 'integer',
            minimum: FIELD_LIMITS.stock.min,
            maximum: FIELD_LIMITS.stock.max,
          },
          active: {
            type: 'boolean',
          },
        },
      },
    },
  },
};

function sendValidationError(res, errors) {
  return res.status(400).json(createValidationErrorResponse(errors));
}

function sanitizeUserForResponse(user) {
  if (!user) {
    return user;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function isProtectedAdminUser(user) {
  return user?.username === 'admin';
}

function readProductsFromFile() {
  try {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf8');
      return JSON.parse(data);
    }

    return [];
  } catch (error) {
    console.error('Erro ao ler arquivo de produtos:', error);
    return [];
  }
}

function writeProductsToFile(products) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo de produtos:', error);
    return false;
  }
}

function createProductId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

app.post('/api/auth/login', (req, res) => {
  try {
    const validation = validateLoginPayload(req.body);

    if (!validation.valid) {
      return sendValidationError(res, validation.errors);
    }

    const { username, password } = validation.data;
    const user = authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais invalidas ou usuario inativo.',
      });
    }

    return res.json({
      success: true,
      message: 'Login realizado com sucesso.',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno do servidor ao realizar login.',
    });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = getAllUsers().map(sanitizeUserForResponse);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter usuarios.' });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const idValidation = validateIdParam(req.params.id, 'ID do usuario');

    if (!idValidation.valid) {
      return sendValidationError(res, idValidation.errors);
    }

    const user = getUserById(idValidation.data);

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }

    return res.json(sanitizeUserForResponse(user));
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuario.' });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const validation = validateUserPayload(req.body, 'create');

    if (!validation.valid) {
      return sendValidationError(res, validation.errors);
    }

    const newUser = createUser(validation.data);
    return res.status(201).json(newUser);
  } catch (error) {
    if (error.message === 'USERNAME_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'O username informado ja esta em uso.' });
    }

    return res.status(500).json({ error: 'Erro ao criar usuario.' });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const idValidation = validateIdParam(req.params.id, 'ID do usuario');

    if (!idValidation.valid) {
      return sendValidationError(res, idValidation.errors);
    }

    const validation = validateUserPayload(req.body, 'update');

    if (!validation.valid) {
      return sendValidationError(res, validation.errors);
    }

    const currentUser = getUserById(idValidation.data);

    if (!currentUser) {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }

    const { username, role, active } = validation.data;

    if (
      isProtectedAdminUser(currentUser) &&
      (
        (username !== undefined && username !== currentUser.username) ||
        (role !== undefined && role !== currentUser.role) ||
        active === false
      )
    ) {
      return res.status(403).json({
        error:
          'O usuario admin principal nao pode ter username, perfil ou status alterados.',
      });
    }

    const updatedUser = updateUser(idValidation.data, validation.data);
    return res.json(updatedUser);
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }

    if (error.message === 'USERNAME_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'O username informado ja esta em uso.' });
    }

    return res.status(500).json({ error: 'Erro ao atualizar usuario.' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const idValidation = validateIdParam(req.params.id, 'ID do usuario');

    if (!idValidation.valid) {
      return sendValidationError(res, idValidation.errors);
    }

    deleteUser(idValidation.data);
    return res.status(204).send();
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }

    if (error.message === 'PROTECTED_ADMIN_DELETE') {
      return res.status(403).json({ error: 'Nao e possivel deletar o usuario admin principal.' });
    }

    return res.status(500).json({ error: 'Erro ao deletar usuario.' });
  }
});

app.put('/api/users/:username/password', (req, res) => {
  try {
    const usernameValidation = validateUsernameParam(req.params.username);

    if (!usernameValidation.valid) {
      return sendValidationError(res, usernameValidation.errors);
    }

    const validation = validatePasswordChangePayload(req.body);

    if (!validation.valid) {
      return sendValidationError(res, validation.errors);
    }

    changePassword(usernameValidation.data, validation.data.newPassword);
    return res.json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }

    return res.status(500).json({ error: 'Erro ao alterar senha.' });
  }
});

app.put('/api/users/:id/toggle-status', (req, res) => {
  try {
    const idValidation = validateIdParam(req.params.id, 'ID do usuario');

    if (!idValidation.valid) {
      return sendValidationError(res, idValidation.errors);
    }

    const updatedUser = toggleUserStatus(idValidation.data);
    return res.json(sanitizeUserForResponse(updatedUser));
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }

    if (error.message === 'PROTECTED_ADMIN_TOGGLE') {
      return res
        .status(403)
        .json({ error: 'Nao e possivel desativar o usuario admin principal.' });
    }

    return res.status(500).json({ error: 'Erro ao alterar status do usuario.' });
  }
});

app.get('/api-docs', (req, res) => {
  return res.json(swaggerDocument);
});

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
            html { box-sizing: border-box; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin: 0; background: #fafafa; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function() {
                SwaggerUIBundle({
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
                    layout: 'StandaloneLayout'
                });
            };
        </script>
    </body>
    </html>
  `;

  return res.send(html);
});

app.get('/api/products', (req, res) => {
  try {
    const products = readProductsFromFile();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao ler produtos.' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const idValidation = validateIdParam(req.params.id, 'ID do produto');

    if (!idValidation.valid) {
      return sendValidationError(res, idValidation.errors);
    }

    const products = readProductsFromFile();
    const product = products.find(item => item.id === idValidation.data);

    if (!product) {
      return res.status(404).json({ error: 'Produto nao encontrado.' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const validation = validateProductPayload(req.body, 'create');

    if (!validation.valid) {
      return sendValidationError(res, validation.errors);
    }

    const products = readProductsFromFile();
    const timestamp = new Date().toISOString();
    const newProduct = {
      ...validation.data,
      id: createProductId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    products.push(newProduct);

    if (!writeProductsToFile(products)) {
      return res.status(500).json({ error: 'Erro ao salvar produto.' });
    }

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar produto.' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const idValidation = validateIdParam(req.params.id, 'ID do produto');

    if (!idValidation.valid) {
      return sendValidationError(res, idValidation.errors);
    }

    const validation = validateProductPayload(req.body, 'update');

    if (!validation.valid) {
      return sendValidationError(res, validation.errors);
    }

    const products = readProductsFromFile();
    const index = products.findIndex(item => item.id === idValidation.data);

    if (index === -1) {
      return res.status(404).json({ error: 'Produto nao encontrado.' });
    }

    const updatedProduct = {
      ...products[index],
      ...validation.data,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;

    if (!writeProductsToFile(products)) {
      return res.status(500).json({ error: 'Erro ao salvar produto.' });
    }

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const idValidation = validateIdParam(req.params.id, 'ID do produto');

    if (!idValidation.valid) {
      return sendValidationError(res, idValidation.errors);
    }

    const products = readProductsFromFile();
    const filteredProducts = products.filter(item => item.id !== idValidation.data);

    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Produto nao encontrado.' });
    }

    if (!writeProductsToFile(filteredProducts)) {
      return res.status(500).json({ error: 'Erro ao deletar produto.' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar produto.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Arquivo de produtos: ${productsFilePath}`);
  console.log(`Arquivo de usuarios: ${path.join(__dirname, 'data', 'users.json')}`);
  console.log(`Documentacao da API: http://localhost:${PORT}/swagger`);
  console.log(`Endpoint OpenAPI: http://localhost:${PORT}/api-docs`);
});
