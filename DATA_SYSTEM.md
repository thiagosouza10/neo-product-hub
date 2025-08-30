# Sistema de Dados em JSON - Neo Product Hub

## Visão Geral

Este projeto foi modificado para trabalhar com arquivos JSON para persistência de dados dos produtos. O sistema oferece uma solução híbrida que combina o melhor dos dois mundos: armazenamento local no navegador com funcionalidades de exportação/importação para arquivos JSON.

## Como Funciona

### 1. **Armazenamento Local (localStorage)**
- Os produtos são salvos no localStorage do navegador
- Dados persistem entre sessões do navegador
- Funciona offline
- Rápido e eficiente

### 2. **Produtos Iniciais**
- Ao iniciar a aplicação pela primeira vez, produtos de exemplo são carregados automaticamente
- Estes produtos incluem:
  - Smartphone Galaxy S23
  - Notebook Dell Inspiron  
  - Fone de Ouvido Bluetooth

### 3. **Funcionalidades de Arquivo JSON**

#### **Exportar JSON**
- Botão "Exportar JSON" no Dashboard
- Baixa um arquivo `produtos.json` com todos os produtos
- Formato legível e bem estruturado
- Útil para backup e migração de dados

#### **Importar JSON**
- Botão "Importar JSON" no Dashboard
- Aceita arquivos `.json` válidos
- Substitui todos os produtos existentes pelos importados
- Validação automática do formato

## Estrutura do Arquivo JSON

```json
[
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
]
```

## Operações Suportadas

- ✅ **Criar produto**: Adiciona novo produto ao sistema
- ✅ **Editar produto**: Modifica produto existente
- ✅ **Excluir produto**: Remove produto do sistema
- ✅ **Listar produtos**: Exibe todos os produtos
- ✅ **Buscar produtos**: Filtra por nome ou descrição
- ✅ **Exportar dados**: Salva todos os produtos em arquivo JSON
- ✅ **Importar dados**: Carrega produtos de arquivo JSON

## Vantagens da Nova Implementação

1. **Persistência**: Dados não são perdidos ao fechar o navegador
2. **Portabilidade**: Pode exportar/importar dados entre dispositivos
3. **Backup**: Fácil backup dos dados em arquivo
4. **Migração**: Pode transferir dados para outros sistemas
5. **Desenvolvimento**: Produtos de exemplo sempre disponíveis
6. **Compatibilidade**: Funciona em qualquer navegador moderno

## Como Usar

### **Exportar Dados**
1. Clique no botão "Exportar JSON"
2. O arquivo `produtos.json` será baixado automaticamente
3. Guarde este arquivo como backup

### **Importar Dados**
1. Clique no botão "Importar JSON"
2. Selecione um arquivo `.json` válido
3. Os produtos serão importados automaticamente
4. Produtos existentes serão substituídos

### **Backup Regular**
- Exporte seus dados regularmente
- Mantenha múltiplas versões do arquivo
- Use nomes descritivos (ex: `produtos_2024_01_15.json`)

## Arquivos do Sistema

- `src/services/ProductService.ts` - Serviço principal de produtos
- `src/components/Dashboard.tsx` - Interface com botões de exportar/importar
- `data/products.json` - Arquivo de exemplo (opcional)
- `data/README.md` - Documentação do sistema de dados

## Considerações Técnicas

- **Formato**: JSON padrão com UTF-8
- **Tamanho**: Sem limite prático (depende do localStorage)
- **Validação**: Verificação automática de formato
- **Erro**: Tratamento robusto de erros
- **Performance**: Operações assíncronas para melhor UX

## Próximos Passos (Sugestões)

1. **Backup automático**: Salvar automaticamente em intervalos
2. **Sincronização**: Sincronizar com servidor remoto
3. **Versionamento**: Histórico de versões dos dados
4. **Compressão**: Comprimir arquivos grandes
5. **Criptografia**: Proteger dados sensíveis

## Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador para erros
2. Confirme que o arquivo JSON tem formato válido
3. Teste com arquivo pequeno primeiro
4. Verifique permissões do navegador para download/upload

