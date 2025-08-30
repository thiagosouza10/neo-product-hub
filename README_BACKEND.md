# Sistema Backend com Arquivo JSON - Neo Product Hub

## 🚀 Nova Implementação

Agora o sistema salva os produtos diretamente no arquivo `data/products.json` em vez de usar o localStorage do navegador!

## 📋 Pré-requisitos

- Node.js instalado
- Dependências instaladas: `express` e `cors`

## 🏃‍♂️ Como Executar

### 1. Iniciar o Servidor Backend
```bash
npm run server
```
O servidor rodará na porta 3001.

### 2. Iniciar o Frontend (em outro terminal)
```bash
npm run dev
```
O frontend rodará na porta 8080.

### 3. Executar Ambos Simultaneamente
```bash
npm run dev:full
```

## 🔧 Como Funciona

### Servidor Backend (`server.js`)
- **Porta**: 3001
- **Arquivo**: Lê/escreve em `data/products.json`
- **APIs**:
  - `GET /api/products` - Lista todos os produtos
  - `POST /api/products` - Cria novo produto
  - `PUT /api/products/:id` - Atualiza produto
  - `DELETE /api/products/:id` - Remove produto

### Frontend (`ProductService.ts`)
- Agora faz chamadas HTTP para o servidor
- Não usa mais localStorage
- Todos os dados são persistidos no arquivo JSON

## 📁 Estrutura dos Arquivos

```
neo-product-hub/
├── server.js              # Servidor backend
├── data/
│   └── products.json      # Banco de dados JSON
├── src/
│   └── services/
│       └── ProductService.ts  # Serviço atualizado
└── README_BACKEND.md      # Esta documentação
```

## ✅ Vantagens da Nova Implementação

1. **Persistência Real**: Dados salvos em arquivo, não no navegador
2. **Backup Automático**: Cada operação atualiza o arquivo JSON
3. **Portabilidade**: Arquivo pode ser movido, copiado, versionado
4. **Transparência**: Dados visíveis diretamente no arquivo
5. **Escalabilidade**: Fácil migrar para banco de dados real

## 🚨 Importante

- **Sempre inicie o servidor antes do frontend**
- **O arquivo `products.json` é atualizado automaticamente**
- **Mantenha o servidor rodando durante o uso**
- **Backup regular do arquivo JSON é recomendado**

## 🔍 Verificando se Funciona

1. Inicie o servidor: `npm run server`
2. Inicie o frontend: `npm run dev`
3. Cadastre um produto no site
4. Verifique o arquivo `data/products.json` - deve conter o novo produto!

## 🛠️ Solução de Problemas

### Erro "Cannot connect to server"
- Verifique se o servidor está rodando na porta 3001
- Confirme que não há outro processo usando a porta

### Produtos não aparecem
- Verifique o console do navegador para erros
- Confirme que o servidor está respondendo em `http://localhost:3001`

### Arquivo não é atualizado
- Verifique permissões de escrita na pasta `data/`
- Confirme que o servidor tem acesso ao arquivo

## 🔄 Próximos Passos

1. **Banco de Dados Real**: Migrar para PostgreSQL/MySQL
2. **Autenticação**: Adicionar sistema de login
3. **Validação**: Validação mais robusta dos dados
4. **Logs**: Sistema de logs para auditoria
5. **Backup Automático**: Backup automático do arquivo JSON
