const API_BASE_URL = "http://localhost:8080/api";
const token = localStorage.getItem("jwtToken");

async function loadTransactions() {
  const response = await fetch(`${API_BASE_URL}/transactions/1`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (response.ok) {
    const transactions = await response.json();
    document.getElementById("transactions").innerText = JSON.stringify(transactions, null, 2);
  } else {
    document.getElementById("transactions").innerText = "Failed to load transactions";
  }
}
loadTransactions();
