# Exemplo de Uso da API de Produtos

Este documento demonstra como usar as novas funcionalidades de produtos do AuthFake.

## 1. Registrar um usuário

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "login": "usuario@teste.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "id": "66d4b123456789abcdef0123",
  "login": "usuario@teste.com"
}
```

## 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "login": "usuario@teste.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "perfil": {
    "id": "66d4b123456789abcdef0123",
    "login": "usuario@teste.com"
  }
}
```

O cookie JWT será salvo em `cookies.txt` para uso nas próximas requisições.

## 3. Criar um produto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nome": "Smartphone XYZ",
    "descricao": "Smartphone com 128GB de armazenamento",
    "preco": 899.99,
    "categoria": "Eletrônicos"
  }'
```

**Resposta:**
```json
{
  "id": "66d4b987654321fedcba9876",
  "nome": "Smartphone XYZ",
  "descricao": "Smartphone com 128GB de armazenamento",
  "preco": 899.99,
  "categoria": "Eletrônicos",
  "createdAt": "2025-09-01T21:30:00.000Z",
  "updatedAt": "2025-09-01T21:30:00.000Z"
}
```

## 4. Listar produtos do usuário

```bash
curl -X GET http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Resposta:**
```json
{
  "usuario": {
    "id": "66d4b123456789abcdef0123",
    "login": "usuario@teste.com"
  },
  "produtos": [
    {
      "id": "66d4b987654321fedcba9876",
      "nome": "Smartphone XYZ",
      "descricao": "Smartphone com 128GB de armazenamento",
      "preco": 899.99,
      "categoria": "Eletrônicos",
      "createdAt": "2025-09-01T21:30:00.000Z",
      "updatedAt": "2025-09-01T21:30:00.000Z"
    }
  ]
}
```

## 5. Buscar um produto específico

```bash
curl -X GET http://localhost:3000/api/products/66d4b987654321fedcba9876 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## 6. Atualizar um produto

```bash
curl -X PUT http://localhost:3000/api/products/66d4b987654321fedcba9876 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nome": "Smartphone XYZ Pro",
    "preco": 999.99
  }'
```

## 7. Obter perfil completo (usuário + produtos + timestamps)

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Resposta:**
```json
{
  "usuario": {
    "id": "66d4b123456789abcdef0123",
    "login": "usuario@teste.com",
    "createdAt": "2025-09-01T20:00:00.000Z",
    "updatedAt": "2025-09-01T20:00:00.000Z"
  },
  "produtos": [
    {
      "id": "66d4b987654321fedcba9876",
      "nome": "Smartphone XYZ Pro",
      "descricao": "Smartphone com 128GB de armazenamento",
      "preco": 999.99,
      "categoria": "Eletrônicos",
      "createdAt": "2025-09-01T21:30:00.000Z",
      "updatedAt": "2025-09-01T21:35:00.000Z"
    }
  ],
  "totalProdutos": 1
}
```

## 8. Deletar um produto

```bash
curl -X DELETE http://localhost:3000/api/products/66d4b987654321fedcba9876 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Resposta:**
```json
{
  "message": "Produto deletado com sucesso"
}
```

## Isolamento de Dados

Cada usuário só pode ver e gerenciar seus próprios produtos. O sistema garante que:

- Usuário A não pode acessar produtos do Usuário B
- Listagens são filtradas automaticamente por usuário
- Tentativas de acesso a produtos de outros usuários retornam 404

## Estrutura de Dados Retornada

O endpoint `/api/profile` retorna exatamente o que foi solicitado:
- Login do usuário
- Timestamps de criação/atualização do usuário
- Lista completa de produtos do usuário com seus respectivos timestamps
- Contador total de produtos

Esta estrutura permite uma visão completa do usuário e seus dados associados.
