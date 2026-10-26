
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const file = path.join(__dirname, 'loans.json');

app.use(cors());
app.use(express.json());

// Create JSON file if missing
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, '[]');
}

// Check loan eligibility
app.post('/apply', (req, res) => {
  const { name, age, income, amount } = req.body;

  if (!name || age < 18 || income <= 0 || amount <= 0) {
    return res.status(400).json({ message: 'Invalid details' });
  }

  const status = age >= 21 && income >= 20000 &&
    amount <= income * 20 ? 'Eligible' : 'Not Eligible';

  const loans = JSON.parse(fs.readFileSync(file, 'utf8'));
  loans.push({ name, age, income, amount, status });
  fs.writeFileSync(file, JSON.stringify(loans, null, 2));

  res.json({ message: status });
});

// View saved applications
app.get('/loans', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(file, 'utf8')));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
