const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, default: 'Uncategorized' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
