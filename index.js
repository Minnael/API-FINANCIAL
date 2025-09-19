const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');



connectDB();

const app = express();
app.use(cors({
	origin: 'http://localhost:8081',
	credentials: true
}));
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth service rodando na porta ${PORT}`));