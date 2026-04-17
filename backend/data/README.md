# Sistema de Dados - Produtos

Este diretorio contem os dados persistidos dos produtos em formato JSON.

## Arquivo: `products.json`

Cada produto salvo pelo backend segue esta estrutura:

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 3999.99,
  "stock": 15,
  "active": true,
  "createdAt": "2026-04-17T18:48:37.815Z",
  "updatedAt": "2026-04-17T18:48:37.815Z"
}
```

## Regras aplicadas pelo backend

- `name`: obrigatorio no `POST`, entre `3` e `120` caracteres
- `description`: obrigatorio no `POST`, entre `10` e `500` caracteres
- `price`: obrigatorio no `POST`, entre `0.01` e `999999.99`, com no maximo `2` casas decimais
- `stock`: obrigatorio no `POST`, inteiro entre `0` e `999999`
- `active`: obrigatorio no `POST`, booleano
- `id`, `createdAt` e `updatedAt`: gerados automaticamente pelo backend

## Como funciona

1. Quando a aplicacao inicia, ela le os produtos deste arquivo.
2. Toda criacao, edicao ou exclusao sobrescreve o arquivo inteiro.
3. O backend valida o payload antes de persistir novos dados.
4. Campos extras enviados pelo cliente sao rejeitados.

## Operacoes suportadas

- Criar produto
- Editar produto
- Excluir produto
- Listar produtos
- Buscar produto por ID

## Importante

- Nao edite este arquivo manualmente enquanto a aplicacao estiver rodando.
- O arquivo deve manter a estrutura esperada pelo backend.
- A documentacao oficial das regras da API esta em `backend/README.md`.
