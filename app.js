const form = document.getElementById("add-item-form");
const cartBody = document.getElementById("cart-body");
const toggleBtn = document.getElementById("theme-toggle");
const alertBox = document.getElementById("alert-box");

const cartSection = document.getElementById("cart-section");
const checkoutSection = document.getElementById("checkout-section");

const summaryList = document.getElementById("summary-list");
const summaryTotal = document.getElementById("summary-total");

let cartItems = [];

/* ALERT */
function showAlert() {
  alertBox.classList.remove("hidden");
  setTimeout(() => alertBox.classList.add("hidden"), 2000);
}

/* STORAGE */
function loadCart() {
  const data = localStorage.getItem("cart");
  if (data) cartItems = JSON.parse(data);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

/* FORMAT */
function formatCurrency(val) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
}

/* RENDER */
function renderCart() {
  cartBody.innerHTML = "";

  if (cartItems.length === 0) {
    cartBody.innerHTML = `<tr><td colspan="5">🛒 Cart is empty</td></tr>`;
    return;
  }

  cartItems.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.qty}</td>
      <td>${formatCurrency(item.price * item.qty)}</td>
      <td><button class="btn-remove" data-index="${index}">🗑</button></td>
    `;

    cartBody.appendChild(row);
  });

  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      cartItems.splice(e.target.dataset.index, 1);
      saveCart();
      renderCart();
    });
  });
}

/* ADD ITEM */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("item-name").value.trim();
  const price = parseFloat(document.getElementById("item-price").value);
  const qty = parseInt(document.getElementById("item-qty").value);

  if (!name || price <= 0 || qty <= 0) return;

  cartItems.push({ name, price, qty });

  saveCart();
  renderCart();
  form.reset();
});

/* 🔥 CHECKOUT */
document.getElementById("calculate-btn").addEventListener("click", () => {
  if (cartItems.length === 0) {
    showAlert();
    return;
  }

  let total = 0;
  summaryList.innerHTML = "";

  cartItems.forEach((item) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.qty}) - ${formatCurrency(subtotal)}`;
    summaryList.appendChild(li);
  });

  const finalTotal = total * 1.05;
  summaryTotal.textContent = `Total: ${formatCurrency(finalTotal)}`;

  /* 🔥 HIDE CART, SHOW CHECKOUT */
  cartSection.classList.add("hidden");
  checkoutSection.classList.remove("hidden");
});

/* 🔥 NEW ORDER */
document.getElementById("new-order-btn").addEventListener("click", () => {
  cartItems = [];
  saveCart();
  renderCart();

  checkoutSection.classList.add("hidden");
  cartSection.classList.remove("hidden");
});

/* THEME */
function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* INIT */
loadTheme();
loadCart();
renderCart();
