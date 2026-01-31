// ---- Product Data ----
var products = [
  { id: 1, name: "Leather Bag",    emoji: "👜", price: 89,  desc: "Handcrafted leather tote bag." },
  { id: 2, name: "Watch",          emoji: "⌚", price: 149, desc: "Classic analog wristwatch." },
  { id: 3, name: "Sneakers",       emoji: "👟", price: 120, desc: "Comfortable running shoes." },
  { id: 4, name: "Sunglasses",     emoji: "🕶️", price: 65,  desc: "Polarised UV400 sunglasses." },
  { id: 5, name: "Backpack",       emoji: "🎒", price: 78,  desc: "Durable 25L hiking backpack." },
  { id: 6, name: "Coffee Mug",     emoji: "☕", price: 22,  desc: "Ceramic mug, 350ml." },
  { id: 7, name: "Wool Scarf",     emoji: "🧣", price: 45,  desc: "Soft merino wool scarf." },
  { id: 8, name: "Desk Lamp",      emoji: "💡", price: 55,  desc: "Minimalist USB desk lamp." }
];

// ---- Cart (in memory) ----
var cart = [];

// ---- Toast ----
function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 2200);
}

// ---- Cart Functions ----
function addToCart(id) {
  var product = products.find(function(p) { return p.id === id; });
  var existing = cart.find(function(i) { return i.id === id; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, emoji: product.emoji, price: product.price, qty: 1 });
  }
  updateBadge();
  showToast(product.name + " added to cart!");
}

function removeItem(id) {
  cart = cart.filter(function(i) { return i.id !== id; });
  updateBadge();
  renderCart();
}

function changeQty(id, delta) {
  var item = cart.find(function(i) { return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeItem(id); return; }
  updateBadge();
  renderCart();
}

function updateBadge() {
  var badge = document.getElementById("cartBadge");
  if (!badge) return;
  var count = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline" : "none";
}

// ---- Render Products (index.html) ----
function renderProducts() {
  var grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = products.map(function(p) {
    return '<div class="card">' +
      '<div class="card-img">' + p.emoji + '</div>' +
      '<div class="card-body">' +
        '<h3>' + p.name + '</h3>' +
        '<p class="desc">' + p.desc + '</p>' +
        '<div class="price">$' + p.price + '</div>' +
        '<button class="btn btn-full" onclick="addToCart(' + p.id + ')">Add to Cart</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ---- Render Cart (cart.html) ----
function renderCart() {
  var container = document.getElementById("cartContainer");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="empty-box">' +
        '<h2>🛒 Your cart is empty</h2>' +
        '<p>Add some items from our store!</p>' +
        '<a href="index.html" class="btn">Browse Products</a>' +
      '</div>';
    var sum = document.getElementById("cartSummary");
    if (sum) sum.style.display = "none";
    return;
  }

  var sum = document.getElementById("cartSummary");
  if (sum) sum.style.display = "block";

  var subtotal = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  var shipping = subtotal >= 200 ? 0 : 10;
  var total = subtotal + shipping;

  var html = '<table class="cart-table">' +
    '<thead><tr>' +
      '<th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th>' +
    '</tr></thead><tbody>';

  cart.forEach(function(item) {
    html +=
      '<tr>' +
        '<td><div class="cart-item-name"><span class="cart-emoji">' + item.emoji + '</span>' + item.name + '</div></td>' +
        '<td>$' + item.price + '</td>' +
        '<td>' +
          '<div class="qty-wrap">' +
            '<button class="qty-btn" onclick="changeQty(' + item.id + ',-1)">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="changeQty(' + item.id + ',1)">+</button>' +
          '</div>' +
        '</td>' +
        '<td>$' + (item.price * item.qty) + '</td>' +
        '<td><button class="btn-remove" onclick="removeItem(' + item.id + ')">✕</button></td>' +
      '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;

  // Update summary
  document.getElementById("subtotalVal").textContent = "$" + subtotal;
  document.getElementById("shippingVal").textContent = shipping === 0 ? "Free" : "$" + shipping;
  document.getElementById("totalVal").textContent = "$" + total;
}

// ---- Contact Form (contact.html) ----
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var valid = true;

    // Clear errors
    form.querySelectorAll(".form-group").forEach(function(g) { g.classList.remove("error"); });

    // Name
    var name = document.getElementById("cName");
    if (name.value.trim().length < 2) {
      name.closest(".form-group").classList.add("error");
      valid = false;
    }

    // Email
    var email = document.getElementById("cEmail");
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailOk) {
      email.closest(".form-group").classList.add("error");
      valid = false;
    }

    // Subject
    var subject = document.getElementById("cSubject");
    if (!subject.value) {
      subject.closest(".form-group").classList.add("error");
      valid = false;
    }

    // Message
    var msg = document.getElementById("cMessage");
    if (msg.value.trim().length < 10) {
      msg.closest(".form-group").classList.add("error");
      valid = false;
    }

    if (!valid) {
      showToast("Please fix the errors above.");
      return;
    }

    // Show success
    form.style.display = "none";
    document.getElementById("successMsg").classList.add("show");
    showToast("Message sent successfully!");
  });

  // Clear error on input
  form.querySelectorAll("input, select, textarea").forEach(function(el) {
    el.addEventListener("input", function() {
      this.closest(".form-group").classList.remove("error");
    });
  });
}

function resetContactForm() {
  document.getElementById("successMsg").classList.remove("show");
  document.getElementById("contactForm").style.display = "block";
  document.getElementById("contactForm").reset();
}

// ---- Init on page load ----
document.addEventListener("DOMContentLoaded", function() {
  updateBadge();
  renderProducts();
  renderCart();
  initContactForm();
});
