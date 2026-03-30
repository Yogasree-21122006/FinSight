const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

async function getFinancialContext() {
  const transactions = await Transaction.find();
  if (transactions.length === 0) return null;

  let totalIncome = 0, totalExpenses = 0;
  const categoryMap = {};
  for (const t of transactions) {
    if (t.type === 'income') totalIncome += t.amount;
    else {
      totalExpenses += t.amount;
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    }
  }
  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    savings: totalIncome - totalExpenses,
    savingsRate,
    topCategory: topCategory ? topCategory[0] : null,
    topCategoryAmount: topCategory ? topCategory[1] : 0,
    transactionCount: transactions.length,
    categoryMap,
  };
}

function generateResponse(message, ctx) {
  const msg = message.toLowerCase().trim();

  if (!ctx) {
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "👋 Hello! I'm FinBot, your personal finance assistant. Please upload a CSV bank statement first so I can analyze your finances!";
    }
    return "📁 No financial data found yet. Please upload a CSV bank statement from the Upload page so I can give you personalized insights!";
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `👋 Hello! I'm FinBot. I've analyzed your ${ctx.transactionCount} transactions. Your savings rate is ${ctx.savingsRate.toFixed(1)}%. How can I help you today?`;
  }

  if (msg.includes('income') || msg.includes('earn') || msg.includes('salary')) {
    return `💰 Your total income is **${formatCurrency(ctx.totalIncome)}** based on ${ctx.transactionCount} transactions analyzed.`;
  }

  if (msg.includes('expense') || msg.includes('spend') || msg.includes('spent')) {
    return `💸 Your total expenses are **${formatCurrency(ctx.totalExpenses)}**. Your top spending category is **${ctx.topCategory}** at ${formatCurrency(ctx.topCategoryAmount)}.`;
  }

  if (msg.includes('saving') || msg.includes('save')) {
    const advice = ctx.savingsRate >= 20
      ? '✅ Excellent! You\'re above the recommended 20% savings rate. Consider investing your surplus!'
      : '⚠️ Your savings rate is below 20%. Try reducing discretionary spending to hit the 20% target.';
    return `🏦 You're saving **${formatCurrency(ctx.savings)}** (${ctx.savingsRate.toFixed(1)}% of income). ${advice}`;
  }

  if (msg.includes('score') || msg.includes('health') || msg.includes('rating')) {
    const score = ctx.savingsRate >= 30 ? 85 : ctx.savingsRate >= 20 ? 70 : ctx.savingsRate >= 10 ? 50 : 30;
    const label = score >= 80 ? 'Excellent 🌟' : score >= 60 ? 'Good 👍' : score >= 40 ? 'Fair ⚠️' : 'Needs Work 🔴';
    return `📊 Your estimated financial score is **${score}/100** — ${label}. Check the Dashboard for full details.`;
  }

  if (msg.includes('top') || msg.includes('most') || msg.includes('biggest') || msg.includes('largest')) {
    return `🏆 Your biggest expense category is **${ctx.topCategory}** at **${formatCurrency(ctx.topCategoryAmount)}**, which is ${((ctx.topCategoryAmount / ctx.totalExpenses) * 100).toFixed(1)}% of your total expenses.`;
  }

  if (msg.includes('budget') || msg.includes('plan') || msg.includes('tip') || msg.includes('advice') || msg.includes('suggest')) {
    const tips = [
      '📌 Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
      '🔄 Automate your savings — pay yourself first before spending.',
      '📱 Review subscriptions monthly and cancel ones you don\'t use.',
      '🍳 Meal prepping can reduce food expenses by up to 30%.',
      '🎯 Set a specific savings goal to stay motivated.',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  if (msg.includes('category') || msg.includes('categories') || msg.includes('breakdown')) {
    const cats = Object.entries(ctx.categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat}: ${formatCurrency(amt)}`)
      .join(', ');
    return `📂 Your top 3 expense categories are: **${cats}**. Visit the Dashboard for a full breakdown with charts!`;
  }

  if (msg.includes('thank') || msg.includes('thanks')) {
    return "😊 You're welcome! Let me know if you have any other financial questions. I'm here to help you achieve your financial goals!";
  }

  if (msg.includes('help') || msg.includes('what can you')) {
    return `🤖 I'm FinBot! I can help you with:\n• **Income & Expenses** — Ask "What's my total income?"\n• **Savings** — Ask "How much am I saving?"\n• **Financial Score** — Ask "What's my financial score?"\n• **Top Spending** — Ask "What's my biggest expense?"\n• **Tips** — Ask "Give me a budget tip"`;
  }

  return `🤔 I'm not sure about that. Try asking: "What's my savings rate?", "What are my top expenses?", or "Give me a budget tip". I'm always learning! 📚`;
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ctx = await getFinancialContext();
    const response = generateResponse(message, ctx);

    return res.json({ response, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
