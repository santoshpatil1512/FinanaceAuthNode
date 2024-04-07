const Budget = require('../models/Budget');
const Finance = require('../models/FinancialData');

// Controller to set monthly budget
const setBudget = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have userId in req.user from JWT
    const { category, amount } = req.body;

    // Check if budget already exists for the category and user
    let existingBudget = await Budget.findOne({ user: userId, category });

    if (existingBudget) {
      // Update existing budget amount
      existingBudget.amount = amount;
      await existingBudget.save();
    } else {
      // Create new budget entry
      const budget = new Budget({ user: userId, category, amount });
      await budget.save();
    }

    // Deduct amount from financial data expenses
    const financeData = await Finance.findOne({ user: userId });
    if (!financeData) {
      return res.status(404).json({ message: 'Finance data not found' });
    }

    if (amount > financeData.expenses) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    financeData.expenses -= amount;
    await financeData.save();

    res.json({ message: 'Budget set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get user's budgets
const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have userId in req.user from JWT
    const budgets = await Budget.find({ user: userId });

    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { setBudget, getBudgets };
