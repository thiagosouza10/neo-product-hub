# 🚀 Neo Product Hub

Sistema completo de gerenciamento de produtos com **frontend React** e **backend Node.js**, oferecendo uma solução moderna e escalável para controle de estoque.

## 🏗️ Arquitetura do Sistema

O projeto está organizado em **duas camadas principais**:

```
neo-product-hub/
├── 📁 frontend/          # Aplicação React (Interface do usuário)
├── 📁 backend/           # API Node.js (Servidor e lógica de negócio)
├── 📁 backend/data/      # Banco de dados JSON
└── 📄 package.json       # Gerenciamento centralizado
```

### **Frontend (React + TypeScript)**
- **Interface moderna** com Tailwind CSS e Shadcn/ui
- **Gerenciamento de estado** com React Hooks
- **Roteamento** com React Router
- **Formulários** com React Hook Form e validação Zod
- **Componentes reutilizáveis** e responsivos

### **Backend (Node.js + Express)**
- **API REST** completa com documentação Swagger
- **Persistência de dados** em arquivo JSON
- **Validação** e tratamento de erros
- **CORS** configurado para desenvolvimento
- **Swagger UI** integrado para testes da API

## 🚀 Como Executar o Sistema

### **Pré-requisitos**
- Node.js 18+ instalado
- npm ou yarn

### **1. Instalação Completa**
```bash
# Na raiz do projeto
npm run install:all
```

### **2. Executar Ambos os Serviços Simultaneamente**
```bash
# Na raiz do projeto
npm run dev
```

### **3. Executar Serviços Separadamente**

#### **Backend (API)**
```bash
# Terminal 1 - Backend
npm run dev:backend
# ou
cd backend && npm run dev
```

#### **Frontend (Interface)**
```bash
# Terminal 2 - Frontend
npm run dev:frontend
# ou
cd frontend && npm run dev
```

## 🌐 URLs de Acesso

### **Frontend**
- **Interface do usuário**: http://localhost:8080
- **Dashboard**: http://localhost:8080/dashboard

### **Backend**
- **API Base**: http://localhost:3001
- **Swagger UI**: http://localhost:3001/swagger
- **Documentação JSON**: http://localhost:3001/api-docs
- **Produtos**: http://localhost:3001/api/products

## 📚 Documentação da API

### **Endpoints Disponíveis**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/products` | Listar todos os produtos |
| `POST` | `/api/products` | Criar novo produto |
| `GET` | `/api/products/:id` | Buscar produto por ID |
| `PUT` | `/api/products/:id` | Atualizar produto |
| `DELETE` | `/api/products/:id` | Deletar produto |

### **Estrutura do Produto**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "active": "boolean",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

## 🔧 Funcionalidades

### **✅ Gerenciamento de Produtos**
- Criar, editar, excluir e listar produtos
- Controle de estoque
- Status ativo/inativo
- Timestamps automáticos

### **✅ Interface Moderna**
- Design responsivo com Tailwind CSS
- Componentes reutilizáveis (Shadcn/ui)
- Formulários validados
- Notificações toast
- Sistema de autenticação

### **✅ API Profissional**
- Documentação Swagger completa
- Validação de dados
- Tratamento de erros
- CORS configurado
- Estrutura escalável

### **✅ Persistência de Dados**
- Arquivo JSON como banco de dados
- Backup automático a cada operação
- Dados persistentes entre sessões
- Fácil migração para banco real

## 🛠️ Desenvolvimento

### **Estrutura de Pastas**

#### **Frontend**
```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── contexts/       # Contextos (Auth, etc.)
│   ├── hooks/          # Hooks customizados
│   ├── lib/            # Utilitários e configurações
│   ├── pages/          # Páginas da aplicação
│   └── services/       # Serviços de API
├── public/             # Arquivos estáticos
└── package.json        # Dependências do frontend
```

#### **Backend**
```
backend/
├── server.js           # Servidor Express
├── data/               # Banco de dados JSON
│   └── products.json   # Arquivo de produtos
└── package.json        # Dependências do backend
```

### **Scripts Disponíveis**

#### **Raiz do Projeto**
```bash
npm run install:all     # Instala todas as dependências
npm run dev             # Executa frontend e backend
npm run dev:frontend    # Executa apenas o frontend
npm run dev:backend     # Executa apenas o backend
npm run build           # Build do frontend
npm run start           # Inicia o backend
```

#### **Frontend**
```bash
cd frontend
npm run dev             # Desenvolvimento
npm run build           # Build de produção
npm run preview         # Preview do build
npm run lint            # Linting
```

#### **Backend**
```bash
cd backend
npm run dev             # Desenvolvimento
npm start               # Produção
```

## 🚨 Solução de Problemas

### **Erro "Cannot connect to server"**
- Verifique se o backend está rodando na porta 3001
- Confirme que não há outro processo usando a porta

### **Erro "Module not found"**
- Execute `npm run install:all` na raiz
- Verifique se as dependências foram instaladas

### **Produtos não aparecem**
- Verifique o console do navegador
- Confirme que o backend está respondendo
- Teste a API em http://localhost:3001/api/products

### **Arquivo não é atualizado**
- Verifique permissões de escrita na pasta `backend/data/`
- Confirme que o servidor tem acesso ao arquivo

## 🔄 Próximos Passos

1. **Banco de Dados Real**: Migrar para PostgreSQL/MySQL
2. **Autenticação JWT**: Sistema de login mais robusto
3. **Validação Avançada**: Validação mais complexa dos dados
4. **Logs e Monitoramento**: Sistema de logs para auditoria
5. **Testes Automatizados**: Unit tests e integration tests
6. **Docker**: Containerização da aplicação
7. **CI/CD**: Pipeline de deploy automático

## 📊 Vantagens da Arquitetura

✅ **Separação de responsabilidades**: Frontend e backend independentes
✅ **Escalabilidade**: Fácil adicionar novos recursos
✅ **Manutenibilidade**: Código organizado e bem estruturado
✅ **Desenvolvimento**: Equipes podem trabalhar em paralelo
✅ **Deploy**: Pode fazer deploy separado de cada camada
✅ **Testes**: Testar cada camada independentemente

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🎯 **Resultado Final**

Agora você tem um **sistema profissional** com:
- **Frontend React** moderno e responsivo
- **Backend Node.js** com API REST completa
- **Documentação Swagger** integrada
- **Persistência de dados** em arquivo JSON
- **Arquitetura escalável** e bem organizada

**Para começar**: Execute `npm run install:all` e depois `npm run dev`! 🚀
