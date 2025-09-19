const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    descricao: { type: String },
    preco: { type: Number, required: true },
    categoria: { type: String },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
