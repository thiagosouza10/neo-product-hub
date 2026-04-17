# 🚀 Neo Product Hub

Sistema completo de gestão de produtos com autenticação de usuários, backend API REST e frontend React moderno.

## 📋 **Visão Geral**

- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js + Express + API REST
- **Persistência**: Arquivos JSON (produtos e usuários)
- **Autenticação**: Sistema de usuários com perfis (admin, manager, user)

## 🚀 **Início Rápido**

### **1. Instalar Dependências**
```bash
# Instalar tudo de uma vez
npm run install:all
```

### **2. Executar o Sistema**
```bash
# Executar frontend + backend simultaneamente
npm run dev
```

**Pronto!** 🎉 O sistema estará rodando em:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3001
- **Swagger**: http://localhost:3001/swagger

---

## 📁 **Estrutura do Projeto**

```
neo-product-hub/
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Serviços da API
│   │   ├── contexts/        # Contextos (Auth)
│   │   └── config/          # Configurações
│   └── package.json
├── backend/                  # Node.js + Express
│   ├── data/                # Arquivos JSON
│   │   ├── products.json    # Dados dos produtos
│   │   └── users.json       # Dados dos usuários
│   ├── services/            # Lógica de negócio
│   └── server.js            # API endpoints
└── package.json              # Scripts principais
```

---

## 🔐 **Credenciais de Acesso**

| Usuário | Senha | Perfil |
|---------|-------|--------|
| `admin` | `admin` | Administrador |

---

## 🛠️ **Comandos Principais**

```bash
# Instalar todas as dependências
npm run install:all

# Executar sistema completo
npm run dev

# Apenas backend
npm run dev:backend

# Apenas frontend
npm run dev:frontend

# Build do frontend
npm run build
```

---

## 🔗 **Endpoints da API**

### **Produtos**
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto por ID
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### **Usuários**
- `POST /api/auth/login` - Fazer login
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `PUT /api/users/:username/password` - Alterar senha
- `PUT /api/users/:id/toggle-status` - Ativar/desativar usuário
- `DELETE /api/users/:id` - Deletar usuário

### **Documentação**
- `GET /swagger` - Interface Swagger UI
- `GET /api-docs` - Especificação OpenAPI

---

## 🎯 **Funcionalidades**

### **Gestão de Produtos**
- ✅ Cadastrar produtos
- ✅ Editar produtos
- ✅ Deletar produtos
- ✅ Controle de estoque
- ✅ Status ativo/inativo
- ✅ Exportar/Importar JSON

### **Gestão de Usuários**
- ✅ Sistema de login
- ✅ Perfis de acesso (admin, manager, user)
- ✅ CRUD de usuários
- ✅ Alterar senhas
- ✅ Ativar/desativar usuários

### **Interface**
- ✅ Dashboard responsivo
- ✅ Tabelas com filtros
- ✅ Formulários validados
- ✅ Notificações toast
- ✅ Tema escuro/claro

---

## 🔧 **Configuração**

### **Variáveis de Ambiente**
```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Neo Product Hub

# Backend
PORT=3001
CORS_ORIGIN=http://localhost:8080
```

### **Portas**
- **Frontend**: 8080
- **Backend**: 3001

---

## 🚨 **Solução de Problemas**

### **Login não funciona**
1. Verifique se o backend está rodando
2. Confirme credenciais: `admin` / `admin`
3. Verifique console do navegador (F12)

### **API não responde**
1. Verifique se o backend está na porta 3001
2. Confirme se não há erros no terminal
3. Teste: `http://localhost:3001/api/products`

### **Dependências não instalam**
1. Use `npm run install:all`
2. Verifique versão do Node.js (>=16)
3. Limpe cache: `npm cache clean --force`

---

## 📚 **Documentação Adicional**

- **`backend/README.md`** - Documentacao completa do backend com regras de negocio, payloads, status codes e exemplos de response
- **`SISTEMA_USUARIOS_JSON.md`** - Detalhes do sistema de usuários
- **`GESTAO_USUARIOS.md`** - Guia de gestão de usuários
- **`SOLUCAO_LOGIN.md`** - Soluções para problemas de login

---

## 🎉 **Resultado**

Sistema **profissional** com:
- ✅ **Arquitetura limpa** (frontend/backend separados)
- ✅ **API REST** completa e documentada
- ✅ **Persistência** em arquivos JSON
- ✅ **Autenticação** robusta
- ✅ **Interface** moderna e responsiva
- ✅ **Fácil manutenção** e escalabilidade

---

## 🚀 **Próximos Passos**

1. **Testar** todas as funcionalidades
2. **Personalizar** interface conforme necessário
3. **Implementar** criptografia de senhas (opcional)
4. **Adicionar** JWT para produção (opcional)
5. **Deploy** em servidor de produção

---

**💡 Dica:** Use `npm run dev` para executar o sistema completo de uma vez! 🎯
