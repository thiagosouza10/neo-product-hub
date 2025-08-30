# 🔐 Gestão de Usuários - Neo Product Hub

## 📍 **Arquivos do Sistema**

### **Backend (Dados):**
```
backend/data/users.json          # Arquivo principal de usuários
backend/services/UserService.js  # Lógica de negócio
```

### **Frontend (Interface):**
```
frontend/src/services/UserService.ts    # Cliente da API
frontend/src/contexts/AuthContext.tsx   # Contexto de autenticação
frontend/src/components/UserManagement.tsx  # Gestão de usuários
```

---

## 🔧 **Como Alterar a Senha do Admin**

### **Método 1: Direto no arquivo JSON (Recomendado)**

1. **Abra o arquivo:** `backend/data/users.json`
2. **Localize o usuário admin:**
```json
{
  "id": "1",
  "name": "Administrador",
  "username": "admin",
  "password": "admin",  // ← ALTERE AQUI
  "role": "admin",
  "active": true
}
```
3. **Altere a senha** e salve o arquivo
4. **Reinicie o backend** para aplicar as mudanças

### **Método 2: Via interface (Recomendado para produção)**

1. **Faça login** como admin
2. **Acesse** a gestão de usuários
3. **Clique no botão** de alterar senha (ícone de escudo)
4. **Digite a nova senha** no prompt

---

## 👥 **Como Adicionar Novos Usuários**

### **Opção 1: Via Interface (Mais Fácil)**

1. **Faça login** como admin
2. **Clique em** "Adicionar Usuário"
3. **Preencha os campos:**
   - **Nome**: Nome completo
   - **Usuário**: Nome de login
   - **Senha**: Senha do usuário
   - **Perfil**: Admin, Manager ou User
   - **Ativo**: Marque se o usuário pode fazer login

### **Opção 2: Direto no arquivo JSON**

**Abra o arquivo:** `backend/data/users.json`

**Adicione novos usuários no array:**

```json
[
  {
    "id": "1",
    "name": "Administrador",
    "username": "admin",
    "password": "admin",
    "role": "admin",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": null
  },
  // ADICIONE AQUI SEUS NOVOS USUÁRIOS
  {
    "id": "2",
    "name": "João Silva",
    "username": "joao",
    "password": "senha123",
    "role": "manager",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": null
  }
]
```

---

## 🎭 **Perfis de Usuário Disponíveis**

### **Admin** 🔴
- **Acesso total** ao sistema
- **Pode gerenciar** usuários
- **Pode gerenciar** produtos
- **Não pode ser deletado**

### **Manager** 🔵
- **Pode gerenciar** produtos
- **Pode visualizar** usuários
- **Acesso limitado** ao sistema

### **User** ⚪
- **Pode visualizar** produtos
- **Acesso básico** ao sistema
- **Não pode gerenciar** nada

---

## 🚀 **Usuários Padrão do Sistema**

| Usuário | Senha | Perfil | Status |
|---------|-------|--------|--------|
| `admin` | `admin` | Admin | ✅ Ativo |

---

## 📝 **Estrutura de um Usuário**

```typescript
interface UserConfig {
  id: string;           // ID único (gerado automaticamente)
  name: string;         // Nome completo
  username: string;     // Nome de login
  password: string;     // Senha (em texto plano - NÃO SEGURO)
  role: 'admin' | 'manager' | 'user';  // Perfil
  active: boolean;      // Se pode fazer login
}
```

---

## ⚠️ **⚠️ IMPORTANTE - Segurança**

### **🚨 ATENÇÃO:**
- **Senhas são armazenadas em texto plano** (não criptografadas)
- **Este sistema é apenas para desenvolvimento**
- **Para produção, use criptografia e JWT**

### **🔒 Recomendações de Segurança:**
1. **Altere a senha padrão** do admin
2. **Use senhas fortes** (mínimo 8 caracteres)
3. **Não compartilhe** credenciais
4. **Desative usuários** em vez de deletar
5. **Monitore** acessos ao sistema

---

## 🛠️ **Comandos para Gestão**

### **Via API (Recomendado):**
```bash
# Criar usuário
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Usuário","username":"novo","password":"senha123","role":"user"}'

# Alterar senha
curl -X PUT http://localhost:3001/api/users/admin/password \
  -H "Content-Type: application/json" \
  -d '{"newPassword":"nova_senha_123"}'

# Listar usuários
curl http://localhost:3001/api/users
```

---

## 🔄 **Reset do Sistema de Usuários**

### **Para voltar aos usuários padrão:**
1. **Pare o backend** (Ctrl+C)
2. **Delete o arquivo:** `backend/data/users.json`
3. **Reinicie o backend** - ele criará usuários padrão automaticamente

### **Ou via API:**
```bash
# Deletar todos os usuários (exceto admin)
curl -X DELETE http://localhost:3001/api/users/2
curl -X DELETE http://localhost:3001/api/users/3
```

---

## 📋 **Checklist de Configuração**

- [ ] **Alterar senha** do admin padrão
- [ ] **Adicionar usuários** necessários
- [ ] **Definir perfis** adequados
- [ ] **Testar login** de todos os usuários
- [ ] **Configurar permissões** se necessário
- [ ] **Fazer backup** da configuração

---

## 🆘 **Solução de Problemas**

### **Usuário não consegue fazer login:**
- Verifique se o usuário está **ativo**
- Confirme se **username e senha** estão corretos
- Verifique se não há **erros no console**

### **Senha não é alterada:**
- **Limpe o cache** do navegador
- **Recarregue a página** após alteração
- Verifique se o **localStorage** foi atualizado

### **Usuário não aparece na lista:**
- **Recarregue a página** de gestão
- Verifique se o usuário foi **salvo corretamente**
- Confirme se não há **erros no console**

---

## 🎯 **Próximos Passos Recomendados**

1. **Implementar criptografia** de senhas (bcrypt)
2. **Adicionar autenticação JWT** para sessões
3. **Criar sistema de permissões** granular
4. **Implementar logs** de acesso
5. **Adicionar validação** de força de senha
6. **Criar sistema de recuperação** de senha

---

**💡 Dica:** Para desenvolvimento, use o arquivo `users.ts`. Para produção, implemente um sistema de autenticação mais robusto!
