const Finance = require('../models/FinancialData');

// Controller to add financial data
const addFinancialData = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have userId in req.user from JWT
    const { income } = req.body;

    // Calculate expenses as 30% of income
    const expenses = income * 0.3;

    // Calculate net income and savings
    const netIncome = income - expenses;
    const savings = netIncome > 0 ? netIncome : 0;

    // Check if finance data already exists for the user
    let financeData = await Finance.findOne({ user: userId });

    if (!financeData) {
      // Create new finance data if not exists
      financeData = new Finance({ user: userId, income, expenses, savings });
    } else {
      // Update existing finance data
      financeData.income += income;
      financeData.expenses += expenses;
      financeData.savings += savings;
    }

    // Check if expenses exceed 30% of income
    if (financeData.expenses > financeData.income * 0.3) {
      return res.status(400).json({ message: 'Expenses cannot exceed 30% of income' });
    }

    await financeData.save();

    res.json({ message: 'Financial data added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get summary data
const getSummary = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have userId in req.user from JWT
    const financeData = await Finance.findOne({ user: userId });

    if (!financeData) {
      return res.status(404).json({ message: 'Finance data not found' });
    }

    const { income, expenses, savings } = financeData;
    const netIncome = income - expenses;

    res.json({ income, expenses, netIncome, savings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get analytics (Placeholder - Implement as per your needs)
const getAnalytics = async (req, res) => {
  try {
    // Implement analytics logic based on your requirements
    res.json({ message: 'Analytics generated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addFinancialData, getSummary, getAnalytics };
