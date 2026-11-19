// ===== CART STATE =====
let cart = [];

// ===== NAVBAR SCROLL =====
window.addEventListener("scroll", () => {
  const header = document.getElementById("mainHeader");
  if (window.scrollY > 50) {
    header.style.background = "rgba(10,10,10,0.98)";
  } else {
    header.style.background = "rgba(15,15,15,0.92)";
  }
});

// ===== MOBILE NAV =====
function toggleNav() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("open");
}
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

// ===== CATEGORY FILTER =====
function filterCategory(cat, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".product-card").forEach(card => {
    if (cat === "all" || card.dataset.category === cat) {
      card.classList.remove("hidden");
      card.style.animation = "fadeInUp 0.4s ease both";
    } else {
      card.classList.add("hidden");
    }
  });
}

// ===== ADD TO CART =====
function addToCart(name, variant, price, img) {
  const key = name + "_" + variant;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, name, variant, price, img, qty: 1 });
  }
  updateCartUI();
  openCart();
  showToast("Added: " + name + " (" + variant + ")");
}

// ===== REMOVE FROM CART =====
function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  updateCartUI();
}

// ===== CHANGE QTY =====
function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(key);
  else updateCartUI();
}

// ===== UPDATE CART UI =====
function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartCount").textContent = count;

  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const footerEl = document.getElementById("cartFooter");

  if (cart.length === 0) {
    emptyEl.style.display = "flex";
    footerEl.style.display = "none";
    // Clear all items except empty msg
    Array.from(itemsEl.children).forEach(child => {
      if (!child.id || child.id !== "cartEmpty") child.remove();
    });
    return;
  }

  emptyEl.style.display = "none";
  footerEl.style.display = "flex";

  // Rebuild items
  Array.from(itemsEl.children).forEach(child => {
    if (child.id !== "cartEmpty") child.remove();
  });

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.id = "cartitem-" + item.key.replace(/\s+/g, "-");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.variant}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${item.key}', -1)">-</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
          <span class="cart-item-price">₹${item.price * item.qty}</span>
          <button class="remove-btn" onclick="removeFromCart('${item.key}')">✕</button>
        </div>
      </div>
    `;
    itemsEl.appendChild(div);
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("cartTotal").textContent = "₹" + total;
}

// ===== CART TOGGLE =====
function toggleCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  drawer.classList.toggle("open");
  overlay.classList.toggle("open");
}
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

// ===== CHECKOUT VIA WHATSAPP =====
function checkoutWhatsApp() {
  if (cart.length === 0) return;
  let msg = "Hello Vinni's! I'd like to place an order:\n\n";
  cart.forEach(item => {
    msg += `• ${item.name} (${item.variant}) x${item.qty} = ₹${item.price * item.qty}\n`;
  });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  msg += `\n*Total: ₹${total}*\n\nPlease confirm availability and delivery. Thank you!`;
  const url = "https://wa.me/919985555713?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
}

// ===== TOAST =====
function showToast(message) {
  const t = document.getElementById("toast");
  t.textContent = "✅ " + message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease both";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".product-card, .stat-card, .trust-item").forEach(el => {
  observer.observe(el);
});

