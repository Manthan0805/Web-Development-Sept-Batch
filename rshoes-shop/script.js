const products = [
  { id: "court-one", name: "Court One", category: "Classic", badge: "BESTSELLER", description: "An easy classic. Clean lines, all-day comfort.", price: 2499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=780&q=80", bg: "#f0e9e2" },
  { id: "everyday-low", name: "Everyday Low", category: "Lifestyle", badge: "EVERYDAY", description: "Your go-to low top, ready for anywhere.", price: 2199, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=780&q=80", bg: "#e8e7e1" },
  { id: "pace-runner", name: "Pace Runner", category: "Running", badge: "LIGHTWEIGHT", description: "Light on your feet. Made to keep you moving.", price: 3299, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=780&q=80", bg: "#e9e9e4" },
  { id: "court-clean", name: "Court Clean", category: "Classic", badge: "NEW IN", description: "A fresh white profile that goes with everything.", price: 2799, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=780&q=80", bg: "#ece9e1" },
  { id: "city-walk", name: "City Walk", category: "Lifestyle", badge: "CUSTOMER PICK", description: "Comfortable cushioning for long city days.", price: 2899, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=780&q=80", bg: "#ebe8e2" },
  { id: "swift-move", name: "Swift Move", category: "Running", badge: "RUN READY", description: "A responsive pair for a little extra momentum.", price: 3599, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=780&q=80", bg: "#ece7df" },
  { id: "retro-club", name: "Retro Club", category: "Classic", badge: "THROWBACK", description: "Old-school shape. Very much a today shoe.", price: 2699, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=780&q=80", bg: "#e7e5dd" },
  { id: "daily-knit", name: "Daily Knit", category: "Lifestyle", badge: "SOFT STEP", description: "An easy, flexible knit for busy everyday plans.", price: 2399, image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=780&q=80", bg: "#eae8e0" },
  { id: "trail-light", name: "Trail Light", category: "Running", badge: "LIGHTWEIGHT", description: "A grippy, go-anywhere option for active days.", price: 3899, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=780&q=80", bg: "#e6e8df" },
  { id: "street-low", name: "Street Low", category: "Lifestyle", badge: "JUST LANDED", description: "A modern everyday sneaker with a relaxed profile.", price: 2599, image: "https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=780&q=80", bg: "#eee8e1" },
  { id: "classic-canvas", name: "Classic Canvas", category: "Classic", badge: "EASY CLASSIC", description: "A laid-back canvas staple with a timeless shape.", price: 1899, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=780&q=80", bg: "#e8e7df" },
  { id: "active-flex", name: "Active Flex", category: "Running", badge: "MOVE MORE", description: "Everyday flexibility for a day in motion.", price: 3199, image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=780&q=80", bg: "#e8e7e1" }
];

const cartStorageKey = "rshoes-shop-cart";
const accountStorageKey = "rshoes-shop-reader";
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#product-search");
const sortSelect = document.querySelector("#sort-products");
const resultsCount = document.querySelector("#results-count");
const emptyResults = document.querySelector("#empty-results");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const toast = document.querySelector("#toast");
let activeCategory = "All";
let showAllProducts = false;
let toastTimer;
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(item =>
      item &&
      products.some(product => product.id === item.productId) &&
      Number.isInteger(item.size) &&
      item.size >= 6 && item.size <= 12 &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    console.error("Could not load the saved shopping bag.", error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the shopping bag.", error);
    showToast("Your bag couldn't be saved on this device.");
  }
}

function getVisibleProducts() {
  const query = searchInput?.value.trim().toLocaleLowerCase() || "";
  let filtered = products.filter(product => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  const sortOrder = sortSelect?.value || "featured";
  if (sortOrder === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortOrder === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortOrder === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  return filtered;
}

function renderProducts() {
  if (!productGrid || !searchInput || !resultsCount || !emptyResults) return;
  const filtered = getVisibleProducts();
  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap" style="--product-bg: ${product.bg}">
        <span class="product-badge">${product.badge}</span>
        <img class="product-image" src="${product.image}" alt="${product.name} sneaker" loading="lazy">
      </div>
      <div class="product-info">
        <div><h2 class="product-name">${product.name}</h2><p class="product-category">${product.category}</p></div>
        <span class="product-price">₹${product.price.toLocaleString("en-IN")}</span>
      </div>
      <p class="product-description">${product.description}</p>
      <div class="product-buy-row">
        <label class="visually-hidden" for="size-${product.id}">Choose UK size for ${product.name}</label>
        <select class="size-select" id="size-${product.id}" data-size-select="${product.id}">
          <option value="">UK size</option>
          ${[6, 7, 8, 9, 10, 11, 12].map(size => `<option value="${size}">${size}</option>`).join("")}
        </select>
        <button class="add-to-bag" type="button" data-product-id="${product.id}" aria-label="Add ${product.name} to bag">Add to bag <span aria-hidden="true">+</span></button>
      </div>
    </article>
  `).join("");

  const columnCount = getComputedStyle(productGrid).gridTemplateColumns.split(" ").length;
  const initialCount = columnCount * 2;
  const visibleCount = showAllProducts ? filtered.length : Math.min(filtered.length, initialCount);
  productGrid.querySelectorAll(".product-card").forEach((card, index) => {
    card.hidden = index >= visibleCount;
  });
  const showMoreButton = document.querySelector("#show-more-products");
  if (showMoreButton) {
    showMoreButton.hidden = filtered.length <= initialCount;
    showMoreButton.setAttribute("aria-expanded", String(showAllProducts));
    showMoreButton.textContent = showAllProducts ? "Show fewer shoes ↑" : "Show more shoes ↓";
  }
  resultsCount.textContent = visibleCount < filtered.length
    ? `Showing ${visibleCount} of ${filtered.length} pairs`
    : `Showing ${filtered.length} ${filtered.length === 1 ? "pair" : "pairs"}`;
  emptyResults.hidden = filtered.length > 0;
}

function cartTotalQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
  const count = cartTotalQuantity();
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#bag-item-count").textContent = `(${count})`;
  document.querySelector("#cart-empty").hidden = cart.length > 0;
  document.querySelector("#cart-items").innerHTML = cart.map(item => {
    const product = products.find(entry => entry.id === item.productId);
    return `
      <article class="cart-item">
        <img class="cart-item-image" src="${product.image}" alt="" loading="lazy">
        <div>
          <h3 class="cart-item-title">${product.name}</h3>
          <p class="cart-item-size">UK ${item.size} · ₹${product.price.toLocaleString("en-IN")}</p>
          <div class="quantity-control" aria-label="Quantity for ${product.name}, UK ${item.size}">
            <button type="button" data-cart-action="decrease" data-product-id="${product.id}" data-size="${item.size}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-product-id="${product.id}" data-size="${item.size}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <span class="cart-item-price">₹${(product.price * item.quantity).toLocaleString("en-IN")}</span>
      </article>
    `;
  }).join("");
  const subtotal = cart.reduce((total, item) => {
    const product = products.find(entry => entry.id === item.productId);
    return total + product.price * item.quantity;
  }, 0);
  document.querySelector("#cart-subtotal").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  document.querySelector("#checkout-button").disabled = cart.length === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000);
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.querySelector("#cart-button").setAttribute("aria-expanded", "true");
  document.body.classList.add("scroll-locked");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.querySelector("#cart-button").setAttribute("aria-expanded", "false");
  document.body.classList.remove("scroll-locked");
  document.querySelector("#cart-button").focus();
}

if (productGrid) {
  productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-product-id]");
    if (!button) return;
    const { productId } = button.dataset;
    const sizeSelect = productGrid.querySelector(`[data-size-select="${productId}"]`);
    const size = Number(sizeSelect.value);
    if (!size) {
      sizeSelect.focus();
      showToast("Choose a UK shoe size before adding this pair to your bag.");
      return;
    }
    const existing = cart.find(item => item.productId === productId && item.size === size);
    if (existing) existing.quantity += 1;
    else cart.push({ productId, size, quantity: 1 });
    saveCart();
    renderCart();
    const product = products.find(entry => entry.id === productId);
    showToast(`${product.name}, UK ${size}, added to your bag.`);
  });

  document.querySelector(".category-list")?.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    showAllProducts = false;
    document.querySelectorAll(".category-button").forEach(categoryButton => {
      const isActive = categoryButton === button;
      categoryButton.classList.toggle("active", isActive);
      categoryButton.setAttribute("aria-pressed", String(isActive));
    });
    renderProducts();
  });

  searchInput.addEventListener("input", () => {
    showAllProducts = false;
    renderProducts();
  });

  sortSelect?.addEventListener("change", () => {
    showAllProducts = false;
    renderProducts();
  });

  document.querySelector("#show-more-products")?.addEventListener("click", () => {
    showAllProducts = !showAllProducts;
    renderProducts();
  });

  window.addEventListener("resize", renderProducts);
}

document.querySelector("#cart-button").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
});

document.querySelector("#cart-items").addEventListener("click", event => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;
  const { productId, cartAction } = button.dataset;
  const size = Number(button.dataset.size);
  const item = cart.find(entry => entry.productId === productId && entry.size === size);
  if (!item) return;
  if (cartAction === "increase") item.quantity += 1;
  if (cartAction === "decrease") {
    item.quantity -= 1;
    if (item.quantity === 0) cart = cart.filter(entry => entry !== item);
  }
  saveCart();
  renderCart();
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  if (cart.length === 0) return;
  closeCart();
  document.querySelector("#checkout-dialog").showModal();
});

const loginDialog = document.querySelector("#login-dialog");
const checkoutDialog = document.querySelector("#checkout-dialog");
const loginButton = document.querySelector("#login-button");

function updateAccountButton() {
  let email;
  try {
    email = localStorage.getItem(accountStorageKey);
  } catch (error) {
    console.error("Could not read the saved demo sign-in.", error);
  }
  loginButton.textContent = email ? `Hi, ${email.split("@")[0]}` : "Sign in";
  loginButton.setAttribute("aria-label", email ? `Signed in as ${email}. Click to sign out.` : "Sign in");
}

loginButton.addEventListener("click", () => {
  let email;
  try {
    email = localStorage.getItem(accountStorageKey);
    if (email) {
      localStorage.removeItem(accountStorageKey);
      updateAccountButton();
      showToast("You've been signed out.");
      return;
    }
  } catch (error) {
    console.error("Could not access the saved demo sign-in.", error);
    showToast("Sign-in is unavailable in this browser.");
    return;
  }
  loginDialog.showModal();
});

document.querySelectorAll("[data-close-dialog]").forEach(button => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

loginDialog.addEventListener("click", event => {
  if (event.target === loginDialog) loginDialog.close();
});
checkoutDialog.addEventListener("click", event => {
  if (event.target === checkoutDialog) checkoutDialog.close();
});

document.querySelector("#checkout-form").addEventListener("submit", event => {
  event.preventDefault();
  const orderNumber = Math.random().toString(36).slice(2, 8).toUpperCase();
  cart = [];
  saveCart();
  renderCart();
  checkoutDialog.close();
  event.currentTarget.reset();
  showToast(`Demo order ${orderNumber} confirmed. No payment was collected.`);
});

document.querySelector("#login-form").addEventListener("submit", event => {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("email").toString().trim();
  try {
    localStorage.setItem(accountStorageKey, email);
  } catch (error) {
    console.error("Could not save the demo sign-in.", error);
    showToast("Sign-in couldn't be saved on this device.");
    return;
  }
  updateAccountButton();
  loginDialog.close();
  event.currentTarget.reset();
  showToast("You're signed in on this device.");
});

document.querySelector("#contact-form")?.addEventListener("submit", event => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Thanks for your note! This demo form isn't connected to a mailbox.");
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
updateAccountButton();
