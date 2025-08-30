# Sistema de Dados - Produtos

Este diretório contém os dados dos produtos em formato JSON.

## Arquivo: `products.json`

O arquivo `products.json` armazena todos os produtos cadastrados no sistema. Cada produto possui a seguinte estrutura:

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

## Como Funciona

1. **Carregamento**: Quando a aplicação inicia, ela automaticamente carrega os produtos deste arquivo
2. **Persistência**: Todas as operações (criar, editar, excluir) são salvas automaticamente neste arquivo
3. **Versionamento**: Este arquivo é versionado no Git, permitindo rastrear mudanças nos produtos
4. **Backup**: Os dados são persistidos localmente e não são perdidos ao reiniciar a aplicação

## Operações Suportadas

- ✅ **Criar produto**: Adiciona novo produto ao arquivo
- ✅ **Editar produto**: Atualiza produto existente no arquivo  
- ✅ **Excluir produto**: Remove produto do arquivo
- ✅ **Listar produtos**: Carrega todos os produtos do arquivo
- ✅ **Buscar produto**: Encontra produto específico por ID

## Localização

O arquivo está localizado em: `./data/products.json`

## Importante

- Não edite este arquivo manualmente enquanto a aplicação estiver rodando
- A aplicação gerencia automaticamente a criação e manutenção deste arquivo
- Em caso de corrupção, a aplicação recriará o arquivo automaticamente

