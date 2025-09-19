# AuthFake - Node.js Authentication Microservice

## Context
AuthFake is a microservice designed to handle user authentication for distributed systems. It provides endpoints for user registration, login, and token validation, using JWT and secure cookies. The service is built with Node.js, Express, and MongoDB, and is ready for integration with other applications.

**🆕 Now includes a complete web frontend for user interface!**

## Features
- ✅ User registration and authentication
- ✅ Product management per user
- ✅ JWT-based security with HTTP-only cookies
- ✅ Complete REST API
- ✅ **Web Frontend Interface**
- ✅ User isolation (each user sees only their products)
- ✅ Complete CRUD operations for products
- ✅ Responsive design for mobile and desktop

## How to Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   - Create a `.env` file with your MongoDB URI and JWT secret:
     ```env
     PORT=3000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
3. **Start the service:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
   Or, using Docker:
   ```bash
   docker build -t auth-micro-service .
   docker run -p 3000:3000 --env-file .env auth-micro-service
   ```

4. **Access the web interface:**
   - Open your browser and go to: `http://localhost:3000`
   - The frontend is automatically served by the backend
   - Create an account or login to start managing products

## Endpoints

### POST `/api/register`
Registers a new user.
- **Body:**
  ```json
  {
    "login": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "id": "...",
    "login": "user@example.com"
  }
  ```

### POST `/api/login`
Authenticates a user and returns a JWT token as a secure cookie.
- **Body:**
  ```json
  {
    "login": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "perfil": {
      "id": "...",
      "login": "user@example.com"
    }
  }
  ```
- **Cookie:** `token` (JWT)

### POST `/api/check`
Validates the JWT token from the cookie and returns the user's profile.
- **Response:**
  ```json
  {
    "perfil": {
      "id": "...",
      "login": "user@example.com"
    }
  }
  ```
- **Error 401:**
  ```json
  {
    "error": "CREDENCIAIS_INVALIDAS",
    "message": "Login ou senha inválidos."
  }
  ```

### Produtos

### POST `/api/products`
Cria um novo produto para o usuário autenticado.
- **Headers:** Cookie com token JWT
- **Body:**
  ```json
  {
    "nome": "Nome do Produto",
    "descricao": "Descrição do produto",
    "preco": 99.99,
    "categoria": "Categoria"
  }
  ```
- **Response:**
  ```json
  {
    "id": "...",
    "nome": "Nome do Produto",
    "descricao": "Descrição do produto",
    "preco": 99.99,
    "categoria": "Categoria",
    "createdAt": "2025-09-01T...",
    "updatedAt": "2025-09-01T..."
  }
  ```

### GET `/api/products`
Lista todos os produtos do usuário autenticado.
- **Headers:** Cookie com token JWT
- **Response:**
  ```json
  {
    "usuario": {
      "id": "...",
      "login": "user@example.com"
    },
    "produtos": [
      {
        "id": "...",
        "nome": "Nome do Produto",
        "descricao": "Descrição",
        "preco": 99.99,
        "categoria": "Categoria",
        "createdAt": "2025-09-01T...",
        "updatedAt": "2025-09-01T..."
      }
    ]
  }
  ```

### GET `/api/products/:id`
Busca um produto específico do usuário autenticado.
- **Headers:** Cookie com token JWT
- **Response:** Dados do produto ou 404 se não encontrado

### PUT `/api/products/:id`
Atualiza um produto do usuário autenticado.
- **Headers:** Cookie com token JWT
- **Body:** Campos a serem atualizados
- **Response:** Produto atualizado

### DELETE `/api/products/:id`
Remove um produto do usuário autenticado.
- **Headers:** Cookie com token JWT
- **Response:**
  ```json
  {
    "message": "Produto deletado com sucesso"
  }
  ```

### GET `/api/profile`
Retorna o perfil completo do usuário com timestamps e todos os seus produtos.
- **Headers:** Cookie com token JWT
- **Response:**
  ```json
  {
    "usuario": {
      "id": "...",
      "login": "user@example.com",
      "createdAt": "2025-09-01T...",
      "updatedAt": "2025-09-01T..."
    },
    "produtos": [
      {
        "id": "...",
        "nome": "Produto 1",
        "descricao": "Descrição",
        "preco": 99.99,
        "categoria": "Categoria",
        "createdAt": "2025-09-01T...",
        "updatedAt": "2025-09-01T..."
      }
    ],
    "totalProdutos": 1
  }
  ```

## Project Structure
```
├── config/
│   ├── db.js
│   └── logger.js
├── models/
│   ├── User.js
│   └── Product.js
├── routes/
│   ├── auth.js
│   └── products.js
├── tests/
│   ├── auth.test.js
│   └── products.test.js
├── frontend/                  # 🆕 Web Interface
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── README.md
├── index.js
├── package.json
├── .env
├── Dockerfile
├── EXEMPLO_USO.md
└── README.md
```

## Web Interface Features

The frontend provides a complete user interface with:

### 🔐 Authentication
- User registration form
- Login form with validation
- Automatic session management
- Secure logout

### 📦 Product Management
- Add new products with name, price, category, and description
- View all user products in an organized list
- Edit existing products inline
- Delete products with confirmation dialog
- Real-time timestamps for created/updated dates

### 🎨 User Experience
- Responsive design for mobile and desktop
- Modern gradient theme with smooth animations
- Real-time notifications for all actions
- Loading states and empty state handling
- Modal confirmations for destructive actions

### 🔒 Security
- JWT authentication via HTTP-only cookies
- Client-side form validation
- CORS properly configured
- User data isolation (users only see their own products)

---

## Usage Examples

### Web Interface (Recommended)
1. Start the server: `npm start`
2. Open browser: `http://localhost:3000`
3. Register a new account or login
4. Start adding and managing products through the web interface

### API Usage (for developers)
See `EXEMPLO_USO.md` for complete API documentation with curl examples.

### Development
- Use `npm run dev` for development with auto-reload
- Frontend files are in the `/frontend` directory
- API endpoints are under `/api` prefix
- Logs are saved to `auth.log`

---
This microservice is ideal for authentication in scalable, distributed systems. For questions or integration help, feel free to reach out!
