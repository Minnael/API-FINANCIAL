const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Product = require('../models/Product');
const User = require('../models/User');
const logger = require('../config/logger');

const router = express.Router();
router.use(cookieParser());

// Middleware para verificar autenticação
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    logger.warn('Tentativa de acesso sem token.');
    return res.status(401).json({ error: 'CREDENCIAIS_INVALIDAS', message: 'Token de acesso necessário.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Token inválido fornecido.');
    return res.status(401).json({ error: 'CREDENCIAIS_INVALIDAS', message: 'Token inválido.' });
  }
}

// POST /api/products - Criar produto
router.post('/products', authenticateToken, async (req, res) => {
  const { nome, descricao, preco, categoria } = req.body;
  
  if (!nome || !preco) {
    logger.warn(`Tentativa de criar produto sem nome ou preço. Usuário: ${req.user.login}`);
    return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
  }

  try {
    const product = await Product.create({
      nome,
      descricao,
      preco,
      categoria,
      userId: req.user.id
    });

    logger.info(`Produto criado com sucesso: ${nome} pelo usuário: ${req.user.login}`);
    return res.status(201).json({
      id: product._id,
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      categoria: product.categoria,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  } catch (error) {
    logger.error(`Erro ao criar produto: ${error.message}`);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

// GET /api/products - Listar produtos do usuário autenticado
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    logger.info(`Produtos listados para usuário: ${req.user.login}. Total: ${products.length}`);
    return res.json({
      usuario: {
        id: req.user.id,
        login: req.user.login
      },
      produtos: products.map(product => ({
        id: product._id,
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        categoria: product.categoria,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))
    });
  } catch (error) {
    logger.error(`Erro ao listar produtos: ${error.message}`);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

// GET /api/products/:id - Buscar produto específico do usuário
router.get('/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id: id, userId: req.user.id });
    
    if (!product) {
      logger.warn(`Produto não encontrado ou não pertence ao usuário: ${req.user.login}. ID: ${id}`);
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    logger.info(`Produto encontrado: ${product.nome} para usuário: ${req.user.login}`);
    return res.json({
      id: product._id,
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      categoria: product.categoria,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  } catch (error) {
    logger.error(`Erro ao buscar produto: ${error.message}`);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

// PUT /api/products/:id - Atualizar produto do usuário
router.put('/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria } = req.body;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { nome, descricao, preco, categoria },
      { new: true, runValidators: true }
    );

    if (!product) {
      logger.warn(`Produto não encontrado para atualização. Usuário: ${req.user.login}. ID: ${id}`);
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    logger.info(`Produto atualizado: ${product.nome} pelo usuário: ${req.user.login}`);
    return res.json({
      id: product._id,
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      categoria: product.categoria,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  } catch (error) {
    logger.error(`Erro ao atualizar produto: ${error.message}`);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

// DELETE /api/products/:id - Deletar produto do usuário
router.delete('/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!product) {
      logger.warn(`Produto não encontrado para exclusão. Usuário: ${req.user.login}. ID: ${id}`);
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    logger.info(`Produto deletado: ${product.nome} pelo usuário: ${req.user.login}`);
    return res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    logger.error(`Erro ao deletar produto: ${error.message}`);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

// GET /api/profile - Obter perfil completo do usuário com seus produtos
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!user) {
      logger.warn(`Usuário não encontrado no banco. ID: ${req.user.id}`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    logger.info(`Perfil completo acessado pelo usuário: ${user.login}`);
    return res.json({
      usuario: {
        id: user._id,
        login: user.login,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      produtos: products.map(product => ({
        id: product._id,
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        categoria: product.categoria,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })),
      totalProdutos: products.length
    });
  } catch (error) {
    logger.error(`Erro ao obter perfil: ${error.message}`);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
