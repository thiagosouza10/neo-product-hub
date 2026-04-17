# Backend - Documentacao de Produto

## Objetivo

Esta documentacao descreve o contrato atual do backend do Neo Product Hub apos a atualizacao das regras de validacao.

Ela cobre:

- rotas disponiveis
- regras de negocio
- campos obrigatorios por metodo
- tamanhos e formatos validados
- exemplos de response com status code
- padrao de mensagens de erro

## Visao Geral

- Stack: Node.js + Express
- Porta padrao: `3001`
- Base URL local: `http://localhost:3001`
- Persistencia: arquivos JSON
- Usuarios: `backend/data/users.json`
- Produtos: `backend/data/products.json`
- Swagger UI: `GET /swagger`
- OpenAPI JSON: `GET /api-docs`

## Regras Globais

- Todas as rotas de negocio trabalham com JSON.
- `POST` exige todos os campos do recurso.
- `PUT` aceita atualizacao parcial, mas exige ao menos um campo valido.
- Campos extras sao rejeitados em `POST` e `PUT`.
- IDs de rota devem ter entre `1` e `40` caracteres e aceitar apenas letras, numeros, `_` e `-`.
- O backend retorna `400 Bad Request` para erro de validacao.
- O backend retorna `404 Not Found` quando o recurso nao existe.
- O backend retorna `409 Conflict` para `username` duplicado.
- O backend nao usa token, sessao nem middleware de autorizacao.
- Senhas continuam armazenadas em texto puro no arquivo JSON.

## Resposta Padrao de Validacao

Quando uma validacao falha, o backend responde neste formato:

```json
{
  "error": "Nome do produto deve ter no minimo 3 caracteres.",
  "details": [
    {
      "field": "name",
      "message": "Nome do produto deve ter no minimo 3 caracteres."
    }
  ]
}
```

Regras desse retorno:

- `error`: primeira mensagem valida que deve ser exibida para o usuario.
- `details`: lista completa dos erros encontrados no payload ou nos parametros.

## Matriz de Validacao

### Campos de Usuario

| Campo | Tipo | POST obrigatorio | PUT obrigatorio | Regras |
| --- | --- | --- | --- | --- |
| `name` | `string` | sim | nao | `3` a `100` caracteres |
| `username` | `string` | sim | nao | `3` a `30` caracteres, apenas letras, numeros, `.`, `_`, `-` |
| `password` | `string` | sim | nao | `4` a `60` caracteres |
| `role` | `string` | sim | nao | valores permitidos: `admin`, `manager`, `user` |
| `active` | `boolean` | sim | nao | aceita apenas `true` ou `false` |

### Campos de Produto

| Campo | Tipo | POST obrigatorio | PUT obrigatorio | Regras |
| --- | --- | --- | --- | --- |
| `name` | `string` | sim | nao | `3` a `120` caracteres |
| `description` | `string` | sim | nao | `10` a `500` caracteres |
| `price` | `number` | sim | nao | de `0.01` a `999999.99`, no maximo `2` casas decimais |
| `stock` | `number` | sim | nao | inteiro de `0` a `999999` |
| `active` | `boolean` | sim | nao | aceita apenas `true` ou `false` |

### Parametros de Rota

| Parametro | Tipo | Regras |
| --- | --- | --- |
| `id` | `string` | `1` a `40` caracteres, apenas letras, numeros, `_`, `-` |
| `username` | `string` | `3` a `30` caracteres, apenas letras, numeros, `.`, `_`, `-` |

## Regras de Negocio de Usuarios

- `username` deve ser unico.
- O usuario principal `admin` nao pode ser removido.
- O usuario principal `admin` nao pode ser desativado.
- O usuario principal `admin` nao pode ter `username`, `role` ou `active` alterados em `PUT /api/users/:id`.
- O login so funciona para usuarios ativos.
- O login atualiza `lastLogin`.
- Responses de usuarios nao retornam `password`.

## Regras de Negocio de Produtos

- `id`, `createdAt` e `updatedAt` sao gerados pelo backend.
- `PUT /api/products/:id` nao aceita campos extras e nao permite alterar `id`, `createdAt` ou `updatedAt` pelo payload.
- `updatedAt` e recalculado automaticamente em toda atualizacao.

## Endpoints

### 1. POST `/api/auth/login`

Autentica um usuario ativo.

#### Request body

| Campo | Tipo | Obrigatorio | Regras |
| --- | --- | --- | --- |
| `username` | `string` | sim | `3` a `30` caracteres, formato valido de username |
| `password` | `string` | sim | `4` a `60` caracteres |

#### Responses

`200 OK`

```json
{
  "success": true,
  "message": "Login realizado com sucesso.",
  "user": {
    "id": "1",
    "name": "Administrador",
    "username": "admin",
    "role": "admin",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2026-04-17T18:47:30.697Z"
  }
}
```

`400 Bad Request`

```json
{
  "error": "Username e obrigatorio.",
  "details": [
    {
      "field": "username",
      "message": "Username e obrigatorio."
    }
  ]
}
```

`401 Unauthorized`

```json
{
  "error": "Credenciais invalidas ou usuario inativo."
}
```

`500 Internal Server Error`

```json
{
  "error": "Erro interno do servidor ao realizar login."
}
```

### 2. GET `/api/users`

Lista todos os usuarios sem `password`.

#### Responses

`200 OK`

```json
[
  {
    "id": "1",
    "name": "Administrador",
    "username": "admin",
    "role": "admin",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2026-04-17T18:47:30.697Z"
  }
]
```

`500 Internal Server Error`

```json
{
  "error": "Erro ao obter usuarios."
}
```

### 3. GET `/api/users/:id`

Busca um usuario pelo ID.

#### Responses

`200 OK`

```json
{
  "id": "1",
  "name": "Administrador",
  "username": "admin",
  "role": "admin",
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2026-04-17T18:47:30.697Z"
}
```

`400 Bad Request`

```json
{
  "error": "ID do usuario possui formato invalido.",
  "details": [
    {
      "field": "id",
      "message": "ID do usuario possui formato invalido."
    }
  ]
}
```

`404 Not Found`

```json
{
  "error": "Usuario nao encontrado."
}
```

### 4. POST `/api/users`

Cria um novo usuario.

#### Request body

| Campo | Tipo | Obrigatorio | Regras |
| --- | --- | --- | --- |
| `name` | `string` | sim | `3` a `100` caracteres |
| `username` | `string` | sim | `3` a `30` caracteres, formato valido |
| `password` | `string` | sim | `4` a `60` caracteres |
| `role` | `string` | sim | `admin`, `manager`, `user` |
| `active` | `boolean` | sim | `true` ou `false` |

#### Responses

`201 Created`

```json
{
  "id": "1713379200000",
  "name": "Maria Santos",
  "username": "maria",
  "role": "user",
  "active": true,
  "createdAt": "2026-04-17T12:00:00.000Z",
  "lastLogin": null
}
```

`400 Bad Request`

```json
{
  "error": "Status do usuario e obrigatorio.",
  "details": [
    {
      "field": "active",
      "message": "Status do usuario e obrigatorio."
    }
  ]
}
```

`409 Conflict`

```json
{
  "error": "O username informado ja esta em uso."
}
```

`500 Internal Server Error`

```json
{
  "error": "Erro ao criar usuario."
}
```

### 5. PUT `/api/users/:id`

Atualiza parcialmente um usuario.

#### Regras especificas

- Aceita apenas `name`, `username`, `password`, `role`, `active`.
- Exige ao menos um campo valido no body.
- O admin principal nao pode ter `username`, `role` ou `active` alterados.

#### Responses

`200 OK`

```json
{
  "id": "2",
  "name": "Joao Silva",
  "username": "joao",
  "role": "manager",
  "active": false,
  "createdAt": "2026-04-17T12:00:00.000Z",
  "lastLogin": null
}
```

`400 Bad Request`

```json
{
  "error": "Informe ao menos um campo valido para atualizar o usuario.",
  "details": [
    {
      "field": "body",
      "message": "Informe ao menos um campo valido para atualizar o usuario."
    }
  ]
}
```

`403 Forbidden`

```json
{
  "error": "O usuario admin principal nao pode ter username, perfil ou status alterados."
}
```

`404 Not Found`

```json
{
  "error": "Usuario nao encontrado."
}
```

`409 Conflict`

```json
{
  "error": "O username informado ja esta em uso."
}
```

### 6. DELETE `/api/users/:id`

Remove um usuario.

#### Responses

`204 No Content`

Sem corpo de resposta.

`400 Bad Request`

```json
{
  "error": "ID do usuario deve ter entre 1 e 40 caracteres.",
  "details": [
    {
      "field": "id",
      "message": "ID do usuario deve ter entre 1 e 40 caracteres."
    }
  ]
}
```

`403 Forbidden`

```json
{
  "error": "Nao e possivel deletar o usuario admin principal."
}
```

`404 Not Found`

```json
{
  "error": "Usuario nao encontrado."
}
```

### 7. PUT `/api/users/:username/password`

Altera a senha de um usuario pelo `username`.

#### Request body

| Campo | Tipo | Obrigatorio | Regras |
| --- | --- | --- | --- |
| `newPassword` | `string` | sim | `4` a `60` caracteres |

#### Responses

`200 OK`

```json
{
  "message": "Senha alterada com sucesso."
}
```

`400 Bad Request`

```json
{
  "error": "Nova senha deve ter no minimo 4 caracteres.",
  "details": [
    {
      "field": "newPassword",
      "message": "Nova senha deve ter no minimo 4 caracteres."
    }
  ]
}
```

`404 Not Found`

```json
{
  "error": "Usuario nao encontrado."
}
```

### 8. PUT `/api/users/:id/toggle-status`

Alterna o status `active` do usuario.

#### Responses

`200 OK`

```json
{
  "id": "2",
  "name": "Joao Silva",
  "username": "joao",
  "role": "manager",
  "active": false,
  "createdAt": "2026-04-17T12:00:00.000Z",
  "lastLogin": null
}
```

`400 Bad Request`

```json
{
  "error": "ID do usuario possui formato invalido.",
  "details": [
    {
      "field": "id",
      "message": "ID do usuario possui formato invalido."
    }
  ]
}
```

`403 Forbidden`

```json
{
  "error": "Nao e possivel desativar o usuario admin principal."
}
```

`404 Not Found`

```json
{
  "error": "Usuario nao encontrado."
}
```

## Endpoints de Produtos

### 9. GET `/api/products`

Lista todos os produtos.

#### Responses

`200 OK`

```json
[
  {
    "id": "1",
    "name": "Smartphone Galaxy S23",
    "description": "Smartphone Samsung Galaxy S23 com 128GB, tela de 6.1 polegadas e camera de 50MP",
    "price": 3999.99,
    "stock": 15,
    "active": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

`500 Internal Server Error`

```json
{
  "error": "Erro ao ler produtos."
}
```

### 10. GET `/api/products/:id`

Busca um produto pelo ID.

#### Responses

`200 OK`

```json
{
  "id": "1",
  "name": "Smartphone Galaxy S23",
  "description": "Smartphone Samsung Galaxy S23 com 128GB, tela de 6.1 polegadas e camera de 50MP",
  "price": 3999.99,
  "stock": 15,
  "active": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

`400 Bad Request`

```json
{
  "error": "ID do produto possui formato invalido.",
  "details": [
    {
      "field": "id",
      "message": "ID do produto possui formato invalido."
    }
  ]
}
```

`404 Not Found`

```json
{
  "error": "Produto nao encontrado."
}
```

### 11. POST `/api/products`

Cria um novo produto.

#### Request body

| Campo | Tipo | Obrigatorio | Regras |
| --- | --- | --- | --- |
| `name` | `string` | sim | `3` a `120` caracteres |
| `description` | `string` | sim | `10` a `500` caracteres |
| `price` | `number` | sim | `0.01` a `999999.99`, maximo `2` casas decimais |
| `stock` | `number` | sim | inteiro de `0` a `999999` |
| `active` | `boolean` | sim | `true` ou `false` |

#### Responses

`201 Created`

```json
{
  "id": "mo39hi2fe6a3rc5qw4",
  "name": "Samsung Galaxy S26 Ultra",
  "description": "Smartphone premium com 512GB de armazenamento.",
  "price": 7900,
  "stock": 5,
  "active": true,
  "createdAt": "2026-04-17T18:48:37.815Z",
  "updatedAt": "2026-04-17T18:48:37.815Z"
}
```

`400 Bad Request`

```json
{
  "error": "Preco do produto deve ser maior ou igual a 0.01.",
  "details": [
    {
      "field": "price",
      "message": "Preco do produto deve ser maior ou igual a 0.01."
    }
  ]
}
```

`500 Internal Server Error`

```json
{
  "error": "Erro ao criar produto."
}
```

### 12. PUT `/api/products/:id`

Atualiza parcialmente um produto.

#### Regras especificas

- Aceita apenas `name`, `description`, `price`, `stock`, `active`.
- Exige ao menos um campo valido no body.
- Nao aceita alterar `id`, `createdAt` ou `updatedAt` pelo payload.

#### Responses

`200 OK`

```json
{
  "id": "1",
  "name": "Smartphone Galaxy S23",
  "description": "Versao atualizada do produto.",
  "price": 4299.99,
  "stock": 10,
  "active": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2026-04-17T19:00:00.000Z"
}
```

`400 Bad Request`

```json
{
  "error": "O campo \"createdAt\" nao e permitido nesta operacao.",
  "details": [
    {
      "field": "createdAt",
      "message": "O campo \"createdAt\" nao e permitido nesta operacao."
    }
  ]
}
```

`404 Not Found`

```json
{
  "error": "Produto nao encontrado."
}
```

### 13. DELETE `/api/products/:id`

Remove um produto.

#### Responses

`204 No Content`

Sem corpo de resposta.

`400 Bad Request`

```json
{
  "error": "ID do produto deve ter entre 1 e 40 caracteres.",
  "details": [
    {
      "field": "id",
      "message": "ID do produto deve ter entre 1 e 40 caracteres."
    }
  ]
}
```

`404 Not Found`

```json
{
  "error": "Produto nao encontrado."
}
```

## Endpoints de Documentacao

### 14. GET `/api-docs`

Retorna a especificacao OpenAPI do backend.

#### Responses

`200 OK`

Exemplo resumido:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Neo Product Hub API",
    "version": "2.0.0"
  },
  "paths": {
    "/api/auth/login": {},
    "/api/users": {},
    "/api/products": {}
  }
}
```

### 15. GET `/swagger`

Retorna a interface Swagger UI.

#### Responses

`200 OK`

Resposta HTML.

## Credenciais Iniciais

Se `users.json` for recriado automaticamente pelo backend, os usuarios base serao:

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `admin` | `admin` |
| `joao` | `senha123` | `manager` |
| `maria` | `senha456` | `user` |

## Resumo Executivo

O backend agora trabalha com um contrato mais rigido e previsivel:

- `POST` sempre exige payload completo
- `PUT` aceita apenas campos permitidos e validados
- validacoes de tamanho e tipo foram centralizadas
- mensagens de erro seguem um padrao unico
- Swagger e README refletem as mesmas regras do codigo

Para produto e frontend, este passa a ser o contrato oficial do backend.
