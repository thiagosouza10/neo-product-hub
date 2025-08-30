# 🚀 Configuração do Sistema Backend - Neo Product Hub

## ✅ O que foi implementado

Transformei seu sistema de **localStorage** para **arquivo JSON real**! Agora quando você cadastrar produtos, eles serão salvos automaticamente no arquivo `data/products.json`.

## 📋 Passos para Configurar

### 1. Instalar Dependências
```bash
npm install express cors
npm install --save-dev @types/express @types/cors
```

### 2. Iniciar o Servidor Backend
```bash
npm run server
```
**Mensagem esperada**: "Servidor rodando na porta 3001"

### 3. Iniciar o Frontend (em outro terminal)
```bash
npm run dev
```

## 🔧 Como Funciona Agora

### Antes (localStorage):
- ❌ Produtos salvos apenas no navegador
- ❌ Dados perdidos ao fechar o navegador
- ❌ Arquivo `products.json` não era atualizado

### Agora (Arquivo JSON):
- ✅ Produtos salvos no arquivo `data/products.json`
- ✅ Dados persistem mesmo fechando o navegador
- ✅ Arquivo atualizado automaticamente a cada operação
- ✅ Backup automático dos dados

## 📁 Arquivos Modificados

1. **`server.js`** - Novo servidor backend
2. **`src/services/ProductService.ts`** - Atualizado para usar APIs HTTP
3. **`src/components/Dashboard.tsx`** - Ajustado para APIs assíncronas
4. **`package.json`** - Novos scripts adicionados

## 🧪 Testando o Sistema

### 1. Verificar se o servidor está rodando:
- Abra: http://localhost:3001/api/products
- Deve retornar a lista de produtos em JSON

### 2. Cadastrar um produto:
- Acesse o site
- Cadastre um novo produto
- Verifique o arquivo `data/products.json` - deve conter o novo produto!

### 3. Verificar no arquivo:
```bash
# O arquivo deve ser atualizado automaticamente
cat data/products.json
```

## 🚨 Solução de Problemas

### Erro "Cannot connect to server"
```bash
# Verificar se a porta 3001 está livre
netstat -an | findstr :3001

# Se estiver ocupada, mude a porta no server.js
```

### Erro "Module not found"
```bash
# Reinstalar dependências
npm install
```

### Arquivo não é atualizado
- Verifique se o servidor está rodando
- Confirme permissões de escrita na pasta `data/`
- Verifique o console do navegador para erros

## 🔄 Comandos Úteis

```bash
# Iniciar apenas o servidor
npm run server

# Iniciar apenas o frontend  
npm run dev

# Iniciar ambos simultaneamente
npm run dev:full

# Parar servidor
Ctrl + C
```

## 📊 Verificando se Funcionou

### ✅ Sucesso:
- Servidor roda na porta 3001
- Produtos aparecem no site
- Arquivo `products.json` é atualizado automaticamente
- Não há erros no console

### ❌ Problema:
- Servidor não inicia
- Produtos não aparecem
- Erros no console do navegador
- Arquivo não é atualizado

## 🎯 Próximos Passos

1. **Testar cadastro** de produtos
2. **Verificar** se o arquivo é atualizado
3. **Reiniciar** o navegador para confirmar persistência
4. **Fazer backup** do arquivo `products.json`

## 💡 Dica Importante

**SEMPRE inicie o servidor antes do frontend!** O sistema não funcionará sem o servidor rodando.

---

## 🆘 Ainda com Problemas?

1. Verifique se Node.js está instalado: `node --version`
2. Confirme que as dependências foram instaladas
3. Verifique se a porta 3001 não está sendo usada
4. Confirme que o arquivo `server.js` foi criado corretamente

**Resultado esperado**: Produtos salvos automaticamente no arquivo `data/products.json`! 🎉
