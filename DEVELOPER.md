# 🔧 Developer Guide - Neo Product Hub

## 🏗️ **Arquitetura Técnica**

### **Stack Tecnológico**
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js + Express + ES Modules
- **Persistência**: Arquivos JSON (produtos.json, users.json)
- **Autenticação**: Sistema local com perfis de usuário

### **Estrutura de Pastas**
```
neo-product-hub/
├── frontend/                 # React App
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Clientes da API
│   │   ├── contexts/        # React Contexts
│   │   ├── hooks/           # Custom Hooks
│   │   ├── lib/             # Utilitários
│   │   └── types/           # TypeScript interfaces
│   ├── public/              # Assets estáticos
│   └── package.json
├── backend/                  # Node.js API
│   ├── data/                # Arquivos de dados
│   ├── services/            # Lógica de negócio
│   ├── server.js            # Servidor Express
│   └── package.json
└── package.json              # Scripts root
```

---

## 🚀 **Desenvolvimento Local**

### **Scripts Disponíveis**
```bash
# Root
npm run install:all          # Instala todas as dependências
npm run dev                  # Executa frontend + backend
npm run dev:frontend         # Apenas frontend
npm run dev:backend          # Apenas backend
npm run build                # Build do frontend

# Frontend
cd frontend
npm run dev                  # Dev server (porta 8080)
npm run build                # Build de produção
npm run preview              # Preview do build

# Backend
cd backend
npm run dev                  # Dev server (porta 3001)
npm start                    # Produção
```

### **Variáveis de Ambiente**
```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Neo Product Hub

# Backend
PORT=3001
CORS_ORIGIN=http://localhost:8080
```

---

## 🔗 **API Endpoints**

### **Base URL**: `http://localhost:3001/api`

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/products` | Listar produtos | - |
| `POST` | `/products` | Criar produto | `{name, description, price, stock, active}` |
| `GET` | `/products/:id` | Buscar produto | - |
| `PUT` | `/products/:id` | Atualizar produto | `{name?, description?, price?, stock?, active?}` |
| `DELETE` | `/products/:id` | Deletar produto | - |
| `POST` | `/auth/login` | Login | `{username, password}` |
| `GET` | `/users` | Listar usuários | - |
| `POST` | `/users` | Criar usuário | `{name, username, password, role, active?}` |
| `PUT` | `/users/:id` | Atualizar usuário | `{name?, username?, password?, role?, active?}` |
| `DELETE` | `/users/:id` | Deletar usuário | - |

### **Respostas da API**
```typescript
// Sucesso
{
  "success": true,
  "data": {...} | [...]
}

// Erro
{
  "error": "Mensagem de erro",
  "status": 400
}
```

---

## 📊 **Estruturas de Dados**

### **Product Interface**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
}
```

### **User Interface**
```typescript
interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'manager' | 'user';
  active: boolean;
  createdAt: string;        // ISO date
  lastLogin: string | null; // ISO date
}
```

---

## 🔐 **Sistema de Autenticação**

### **Perfis de Usuário**
- **admin**: Acesso total ao sistema
- **manager**: Pode gerenciar produtos
- **user**: Apenas visualização

### **Fluxo de Login**
1. Frontend envia `{username, password}` para `/api/auth/login`
2. Backend valida credenciais no `users.json`
3. Retorna usuário autenticado (sem senha)
4. Frontend salva sessão no `localStorage`

---

## 🛠️ **Desenvolvimento**

### **Adicionar Nova Funcionalidade**
1. **Backend**: Criar endpoint em `server.js`
2. **Frontend**: Criar serviço em `services/`
3. **Interface**: Criar componente em `components/`
4. **Tipos**: Atualizar interfaces TypeScript

### **Padrões de Código**
- **Frontend**: TypeScript strict, ESLint, Prettier
- **Backend**: ES Modules, async/await, try/catch
- **API**: RESTful, status codes HTTP, JSON responses
- **Erros**: Tratamento consistente, mensagens claras

---

## 🧪 **Testes**

### **Testar API**
```bash
# Swagger UI
http://localhost:3001/swagger

# cURL
curl http://localhost:3001/api/products
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### **Testar Frontend**
- Console do navegador (F12)
- React DevTools
- Network tab para requisições

---

## 🚨 **Debugging**

### **Problemas Comuns**
1. **CORS**: Verificar `CORS_ORIGIN` no backend
2. **Portas**: Confirmar 3001 (backend) e 8080 (frontend)
3. **Dependências**: Executar `npm run install:all`
4. **Arquivos**: Verificar permissões em `backend/data/`

### **Logs**
- **Backend**: Console do terminal
- **Frontend**: Console do navegador
- **API**: Network tab do DevTools

---

## 📚 **Recursos Adicionais**

- **`README.md`** - Visão geral do projeto
- **`SISTEMA_USUARIOS_JSON.md`** - Sistema de usuários
- **`GESTAO_USUARIOS.md`** - Gestão de usuários
- **`SOLUCAO_LOGIN.md`** - Troubleshooting

---

**💡 Dica**: Use `npm run dev` para desenvolvimento rápido! 🚀
