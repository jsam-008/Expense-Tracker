<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expense Tracker Dashboard</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      background: #0d1b2a;
      color: #fff;
      font-family: "Segoe UI", sans-serif;
      padding: 20px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cards {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }

    .card {
      background: #1e3a8a;
      padding: 20px;
      border-radius: 12px;
      flex: 1;
      text-align: center;
      box-shadow: 0px 4px 12px rgba(0,0,0,0.3);
    }

    .card h3 {
      margin-bottom: 10px;
      font-size: 18px;
    }

    .card p {
      font-size: 22px;
      font-weight: bold;
    }

    .chart-container {
      background: #fff;
      color: #000;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: #fff;
      color: #000;
      border-radius: 12px;
      overflow: hidden;
    }

    table th, table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    table th {
      background: #1e3a8a;
      color: #fff;
    }

    .form-container {
      background: #fff;
      color: #000;
      padding: 20px;
      border-radius: 12px;
      margin-top: 20px;
    }

    .form-container input, 
    .form-container select, 
    .form-container button {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border-radius: 8px;
      border: 1px solid #ccc;
    }

    .form-container button {
      background: #1e3a8a;
      color: #fff;
      cursor: pointer;
      border: none;
      transition: background 0.3s;
    }

    .form-container button:hover {
      background: #0a2472;
    }
  </style>
</head>
<body>
  <div class="dashboard-header">
    <h1>Expense Tracker Dashboard</h1>
    <button onclick="logout()">Logout</button>
  </div>

  <!-- Summary Cards -->
  <div class="cards">
    <div class="card">
      <h3>Income</h3>
      <p id="income">$0.00</p>
    </div>
    <div class="card">
      <h3>Expense</h3>
      <p id="expense">$0.00</p>
    </div>
    <div class="card">
      <h3>Balance</h3>
      <p id="balance">$0.00</p>
    </div>
  </div>

  <!-- Chart -->
  <div class="chart-container">
    <h2>Monthly Summary Chart</h2>
    <canvas id="summaryChart"></canvas>
  </div>

  <!-- Transactions -->
  <h2>Transactions</h2>
  <table id="transactionTable">
    <thead>
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Category</th>
        <th>Description</th>
        <th>Amount ($)</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>

  <!-- Add Transaction Form -->
  <div class="form-container">
    <h2>Add New Transaction</h2>
    <form id="transactionForm">
      <input type="number" id="amount" placeholder="Amount" required>
      <select id="type">
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="text" id="category" placeholder="Category" required>
      <input type="text" id="description" placeholder="Description (optional)">
      <button type="submit">Add Transaction</button>
    </form>
  </div>

  <script>
    let transactions = [];
    let income = 0, expense = 0;

    const incomeEl = document.getElementById("income");
    const expenseEl = document.getElementById("expense");
    const balanceEl = document.getElementById("balance");
    const tableBody = document.querySelector("#transactionTable tbody");

    // Chart.js setup
    const ctx = document.getElementById("summaryChart").getContext("2d");
    const summaryChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expense"],
        datasets: [{
          data: [0, 0],
          backgroundColor: ["#4CAF50", "#E63946"]
        }]
      }
    });

    // Update summary
    function updateSummary() {
      income = transactions.filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      expense = transactions.filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      incomeEl.textContent = `$${income.toFixed(2)}`;
      expenseEl.textContent = `$${expense.toFixed(2)}`;
      balanceEl.textContent = `$${(income - expense).toFixed(2)}`;

      summaryChart.data.datasets[0].data = [income, expense];
      summaryChart.update();
    }

    // Render table
    function renderTable() {
      tableBody.innerHTML = "";
      transactions.forEach((t, index) => {
        const row = `<tr>
          <td>${index + 1}</td>
          <td>${t.type}</td>
          <td>${t.category}</td>
          <td>${t.description}</td>
          <td>$${t.amount.toFixed(2)}</td>
        </tr>`;
        tableBody.innerHTML += row;
      });
    }

    // Handle form
    document.getElementById("transactionForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("amount").value);
      const type = document.getElementById("type").value;
      const category = document.getElementById("category").value;
      const description = document.getElementById("description").value;

      transactions.push({ amount, type, category, description });
      renderTable();
      updateSummary();

      e.target.reset();
    });

    // Logout
    function logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      window.location.href = "index.html";
    }
  </script>
</body>
</html>
