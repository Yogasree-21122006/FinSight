const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

function computeFinancialScore(savingsRate, totalIncome, numCategories) {
  if (totalIncome === 0) return 0;
  let score = 0;
  if (savingsRate >= 30) score += 40;
  else if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 10) score += 20;
  else if (savingsRate >= 0) score += 10;
  if (numCategories >= 5) score += 20;
  else if (numCategories >= 3) score += 15;
  else score += 5;
  if (totalIncome > 0) score += 25;
  if (savingsRate >= 20) score += 15;
  return Math.min(100, Math.max(0, score));
}

function generateSuggestions(savingsRate, categoryBreakdown, totalIncome) {
  const suggestions = [];

  if (savingsRate < 20) {
    suggestions.push('💡 Aim to save at least 20% of your monthly income to build a healthy emergency fund.');
  } else {
    suggestions.push('✅ Great job! You are saving more than 20% of your income. Consider investing the surplus for long-term growth.');
  }

  const food = categoryBreakdown.find((c) =>
    c.category.toLowerCase().includes('food') || c.category.toLowerCase().includes('dining')
  );
  if (food && food.percentage > 20) {
    suggestions.push(`🍔 Your food & dining expenses (${food.percentage.toFixed(1)}%) are high. Try meal prepping to cut costs.`);
  }

  const entertainment = categoryBreakdown.find((c) =>
    c.category.toLowerCase().includes('entertainment') || c.category.toLowerCase().includes('subscription')
  );
  if (entertainment && entertainment.percentage > 15) {
    suggestions.push(`🎬 Review your entertainment/subscriptions (${entertainment.percentage.toFixed(1)}%). Cancel unused ones to save more.`);
  }

  const shopping = categoryBreakdown.find((c) => c.category.toLowerCase().includes('shopping'));
  if (shopping && shopping.percentage > 20) {
    suggestions.push('🛍️ Shopping is a big chunk of your expenses. Apply the 48-hour rule before non-essential purchases.');
  }

  if (suggestions.length < 3) {
    suggestions.push('📊 Track every expense consistently to spot hidden spending patterns.');
    suggestions.push('💰 Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings.');
  }

  if (totalIncome > 0 && savingsRate >= 20) {
    suggestions.push('🤖 You\'re on track! Automate your savings to maintain this healthy habit.');
  }

  return suggestions.slice(0, 5);
}

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();

    if (transactions.length === 0) {
      return res.json({
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        savingsRate: 0,
        financialScore: 0,
        categoryBreakdown: [],
        suggestions: ['📁 Upload your bank statement CSV to get personalized financial insights.'],
        transactionCount: 0,
      });
    }

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryMap = {};

    for (const t of transactions) {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpenses += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    }

    const totalSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const financialScore = computeFinancialScore(savingsRate, totalIncome, categoryBreakdown.length);
    const suggestions = generateSuggestions(savingsRate, categoryBreakdown, totalIncome);

    return res.json({
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      totalSavings: Math.round(totalSavings * 100) / 100,
      savingsRate: Math.round(savingsRate * 100) / 100,
      financialScore,
      categoryBreakdown,
      suggestions,
      transactionCount: transactions.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
