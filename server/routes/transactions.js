const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const Transaction = require('../models/Transaction');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const content = req.file.buffer.toString('utf-8');

    let records;
    try {
      records = parse(content, { skip_empty_lines: true, trim: true });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid CSV format' });
    }

    if (!records || records.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty' });
    }

    const headerRow = records[0].map((h) => h.toLowerCase().trim());
    const hasHeader =
      headerRow.includes('date') ||
      headerRow.includes('description') ||
      headerRow.includes('amount');

    const dataRows = hasHeader ? records.slice(1) : records;

    if (dataRows.length === 0) {
      return res.status(400).json({ error: 'No data rows found' });
    }

    const toInsert = dataRows
      .map((row) => {
        if (row.length < 4) return null;
        const [date, description, category, amountStr, typeRaw] = row;
        const amount = parseFloat((amountStr || '').replace(/[^0-9.-]/g, ''));
        if (isNaN(amount)) return null;

        const typeNorm = (typeRaw || '').toLowerCase().trim();
        const type = typeNorm === 'income' ? 'income' : 'expense';

        return {
          date: (date || '').trim(),
          description: (description || '').trim(),
          category: (category || 'Uncategorized').trim(),
          amount: Math.abs(amount),
          type,
        };
      })
      .filter(Boolean);

    if (toInsert.length === 0) {
      return res.status(400).json({ error: 'No valid transactions found in CSV' });
    }

    const inserted = await Transaction.insertMany(toInsert);

    return res.json({
      message: 'Transactions uploaded successfully',
      count: inserted.length,
      transactions: inserted,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return res.json(transactions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Transaction.deleteMany({});
    return res.json({ message: 'All transactions cleared' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
