/* ========================================
   LUXORA E-COMMERCE - MAIN.JS
   ALL FEATURES PROPERLY CONNECTED & FIXED
   ======================================== */

// ========================================
// SECTION 1: WELCOME SCREEN & NAVIGATION
// ========================================

// Welcome screen skip button
function skipWelcome() {
  const welcomeScreen = document.getElementById("welcome-screen");
  if (welcomeScreen) {
    welcomeScreen.style.opacity = "0";
    setTimeout(() => (welcomeScreen.style.display = "none"), 500);
  }
}

// Show/Hide sections with proper .hidden class toggle
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".page-section").forEach(section => {
    section.classList.add("hidden");
  });

  // Show target section
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
    
    // Auto-load content based on section
    if (sectionId === "orders") renderOrders();
    if (sectionId === "wishlist") renderWishlist();
    if (sectionId === "cart") renderCart();
    if (sectionId === "profile") renderProfile();
    if (sectionId === "notifications") loadNotifications();
  }
}

// Category navigation
function showCategoryProducts(category) {
  showSection('products');
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.value = category;
    filterProducts();
  }
}

// Navigation function (legacy support)
function navigateTo(sectionId) {
  showSection(sectionId);
}

// ========================================
// SECTION 2: AUTHENTICATION SYSTEM
// ========================================

// User signup
function signupUser(event) {
  event.preventDefault();

  const name = document.getElementById("signup-name")?.value.trim();
  const email = document.getElementById("signup-email")?.value.trim();
  const password = document.getElementById("signup-password")?.value.trim();

  if (!name || !email || !password) {
    alert("All fields are required!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    alert("Email already registered! Please login.");
    return;
  }

  users.push({
    id: Date.now(),
    name,
    email,
    password
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Please login.");
  window.location.href = "login.html";
}

// User login
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value.trim();

  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  localStorage.setItem("activeUser", JSON.stringify(user));
  alert("Login successful!");
  window.location.href = "index.html";
}

// User logout
function logoutUser() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("activeUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
  }
}

// Check and update navbar based on login status
function updateNavbarUser() {
  const userContainer = document.getElementById("user-container");
  if (!userContainer) return;

  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (activeUser) {
    userContainer.innerHTML = `
      <span style="color: #e50914; font-weight: bold;">Welcome, ${activeUser.name}!</span>
      <a href="#" onclick="showSection('profile'); return false;" style="margin: 0 10px;">My Profile</a>
      <a href="#" onclick="logoutUser(); return false;">Logout</a>
    `;
  } else {
    userContainer.innerHTML = `
      <a href="#" onclick="showSection('auth'); return false;">Login</a> | 
      <a href="#" onclick="showSection('auth'); return false;">Sign Up</a>
    `;
  }
}

// ========================================
// SECTION 3: PRODUCT MANAGEMENT
// ========================================

// Load and display all products
function loadProducts() {
  const products = [
    { id: "p1", name: "Wireless Headphones", price: 2999, category: "electronics", image: "img/p1.jpg" },
    { id: "p2", name: "Smart Watch", price: 3999, category: "electronics", image: "img/p2.jpg" },
    { id: "p3", name: "Running Shoes", price: 4999, category: "fashion", image: "img/p3.jpg" },
    { id: "p4", name: "Coffee Maker", price: 1999, category: "home-kitchen", image: "img/p4.jpg" },
    { id: "p5", name: "Yoga Mat", price: 999, category: "sports", image: "img/p5.jpg" },
    { id: "p6", name: "Face Serum", price: 599, category: "beauty", image: "img/p6.jpg" },
    { id: "p7", name: "Novel Book Set", price: 799, category: "books", image: "img/p7.jpg" },
    { id: "p8", name: "Board Game", price: 499, category: "toys", image: "img/p8.jpg" },
    { id: "p9", name: "Car Phone Mount", price: 299, category: "automotive", image: "img/p9.jpg" },
    { id: "p10", name: "Gold Necklace", price: 5999, category: "jewelry", image: "img/p10.jpg" }
  ];

  displayProductsInGrid("all-products", products);
  displayProductsInGrid("men-products", products.filter(p => ["electronics", "fashion", "sports"].includes(p.category)));
  displayProductsInGrid("women-products", products.filter(p => ["beauty", "fashion", "jewelry"].includes(p.category)));
}

// Display products in grid
function displayProductsInGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}" data-category="${p.category}" data-price="${p.price}" data-name="${p.name}">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">₹${p.price}</p>
      <button onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}')">🛒 Add to Cart</button>
      <button onclick="toggleWishlist('${p.id}', '${p.name}', ${p.price}, '${p.image}')">❤️ Wishlist</button>
    </div>
  `).join("");
}

// ========================================
// SECTION 4: CART SYSTEM
// ========================================

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(productId, name, price, image) {
  let cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name, price, image, quantity: 1 });
  }

  saveCart(cart);
  alert(`${name} added to cart!`);
  renderCart();
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}

// Update quantity in cart
function updateCartQuantity(productId, newQty) {
  const qty = parseInt(newQty);
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }

  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = qty;
    saveCart(cart);
    renderCart();
  }
}

// Clear entire cart
function clearCart() {
  if (confirm("Clear cart?")) {
    localStorage.removeItem("cart");
    renderCart();
  }
}

// Render cart display
function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!cartContainer || !totalContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    totalContainer.innerText = "0";
    if (cartCount) cartCount.innerText = "0";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="cart-item" style="display: flex; gap: 15px; padding: 10px; border: 1px solid #333; border-radius: 5px; margin-bottom: 10px;">
        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
        <div style="flex: 1;">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
          <input type="number" min="1" value="${item.quantity}" 
            onchange="updateCartQuantity('${item.id}', this.value)" style="width: 60px;">
          <button onclick="removeFromCart('${item.id}')" style="margin-left: 10px; background: #e50914; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">Remove</button>
        </div>
        <div style="font-weight: bold;">₹${itemTotal}</div>
      </div>
    `;
  }).join("");

  cartContainer.innerHTML += `
    <div style="padding: 15px; background: #222; border-radius: 5px; margin-top: 15px; text-align: right;">
      <h3>Total: ₹${total}</h3>
      <button onclick="showSection('checkout')" style="margin-top: 10px; padding: 10px 20px; background: #e50914; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Proceed to Checkout</button>
    </div>
  `;

  totalContainer.innerText = total;
  if (cartCount) cartCount.innerText = cart.length;
}

// Update cart count in navbar
function updateCartCount() {
  const cart = getCart();
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.innerText = cart.length;
}

// Load cart on page load
function loadCart() {
  renderCart();
}

// ========================================
// SECTION 5: WISHLIST SYSTEM
// ========================================

// Get wishlist
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Save wishlist
function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Toggle wishlist
function toggleWishlist(productId, name, price, image) {
  let wishlist = getWishlist();
  const exists = wishlist.find(item => item.id === productId);

  if (exists) {
    wishlist = wishlist.filter(item => item.id !== productId);
    alert("Removed from wishlist");
  } else {
    wishlist.push({ id: productId, name, price, image });
    alert("Added to wishlist!");
  }

  saveWishlist(wishlist);
  renderWishlist();
}

// Render wishlist
function renderWishlist() {
  const wishlistContainer = document.getElementById("wishlist-items");
  if (!wishlistContainer) return;

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty</p>";
    return;
  }

  wishlistContainer.innerHTML = wishlist.map(item => `
    <div class="wishlist-item" style="padding: 15px; border: 1px solid #333; border-radius: 5px; text-align: center; margin-bottom: 10px; background: #111;">
      <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
      <h4>${item.name}</h4>
      <p style="color: #e50914; font-size: 18px; font-weight: bold;">₹${item.price}</p>
      <button onclick="addToCart('${item.id}', '${item.name}', ${item.price}, '${item.image}')" style="margin: 5px; padding: 8px 15px; background: #e50914; color: white; border: none; border-radius: 3px; cursor: pointer;">Add to Cart</button>
      <button onclick="toggleWishlist('${item.id}', '${item.name}', ${item.price}, '${item.image}')" style="margin: 5px; padding: 8px 15px; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer;">Remove</button>
    </div>
  `).join("");
}

// Load wishlist on page load
function loadWishlist() {
  renderWishlist();
}

// ========================================
// SECTION 6: SEARCH & FILTER
// ========================================

// Get search history
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

// Save search history
function saveSearchHistory(history) {
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

// Add search term to history
function addToSearchHistory(term) {
  if (!term) return;
  let history = getSearchHistory();

  history = history.filter(item => item.toLowerCase() !== term.toLowerCase());
  history.unshift(term);

  if (history.length > 10) history.pop();

  saveSearchHistory(history);
  renderSearchHistory();
}

// Render search history
function renderSearchHistory() {
  const historyContainer = document.getElementById("search-history");
  if (!historyContainer) return;

  const history = getSearchHistory();

  if (history.length === 0) {
    historyContainer.innerHTML = "<p style='color: #999;'>No recent searches</p>";
    return;
  }

  historyContainer.innerHTML = history.map((term, index) => `
    <div style="padding: 8px; background: #222; margin: 5px 0; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
      <span onclick="searchProducts('${term}')" style="cursor: pointer; flex: 1;">${term}</span>
      <button onclick="removeSearchHistoryItem(${index})" style="background: #e50914; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">×</button>
    </div>
  `).join("");
}

// Remove single search history item
function removeSearchHistoryItem(index) {
  let history = getSearchHistory();
  history.splice(index, 1);
  saveSearchHistory(history);
  renderSearchHistory();
}

// Clear all search history
function clearSearchHistory() {
  if (confirm("Clear search history?")) {
    localStorage.removeItem("searchHistory");
    renderSearchHistory();
  }
}

// Search products
function searchProducts(term) {
  const query = term || document.getElementById("search-bar")?.value.trim().toLowerCase();
  if (!query) return;

  const products = document.querySelectorAll(".product-card");
  let found = false;

  products.forEach(product => {
    const name = product.querySelector("h3")?.innerText.toLowerCase();
    if (name?.includes(query)) {
      product.style.display = "block";
      found = true;
    } else {
      product.style.display = "none";
    }
  });

  if (found) {
    showSection('products');
  } else {
    alert("No products found!");
  }

  addToSearchHistory(query);
}

// Filter products by category and price
function filterProducts() {
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");

  const selectedCategory = categoryFilter?.value || "all";
  const maxPrice = priceFilter?.value ? parseFloat(priceFilter.value) : Infinity;

  const products = document.querySelectorAll(".product-card");

  products.forEach(product => {
    const category = product.dataset.category;
    const price = parseFloat(product.dataset.price);

    const categoryMatch = selectedCategory === "all" || category === selectedCategory;
    const priceMatch = price <= maxPrice;

    product.style.display = categoryMatch && priceMatch ? "block" : "none";
  });
}

// Sort products
function sortProducts(order) {
  const container = document.getElementById("all-products");
  if (!container) return;

  const products = Array.from(container.querySelectorAll(".product-card"));

  products.sort((a, b) => {
    const priceA = parseFloat(a.dataset.price);
    const priceB = parseFloat(b.dataset.price);
    return order === "low-high" ? priceA - priceB : priceB - priceA;
  });

  products.forEach(p => container.appendChild(p));
}

// ========================================
// SECTION 7: CAROUSEL/SLIDER
// ========================================

let currentSlide = 0;
const totalSlides = 3;

function prevSlide() {
  const carousel = document.querySelector(".carousel");
  if (carousel && carousel.querySelector("img")) {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    scrollCarousel();
  }
}

function nextSlide() {
  const carousel = document.querySelector(".carousel");
  if (carousel && carousel.querySelector("img")) {
    currentSlide = (currentSlide + 1) % totalSlides;
    scrollCarousel();
  }
}

function scrollCarousel() {
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    carousel.style.transition = "transform 0.5s ease-in-out";
  }
}

// Auto-scroll carousel
function autoCarousel() {
  setInterval(nextSlide, 5000);
}

// ========================================
// SECTION 8: CHECKOUT & ORDERS
// ========================================

// Process checkout
function processCheckout(event) {
  event.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const address = document.getElementById("address")?.value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

  if (!name || !email || !address || !paymentMethod) {
    alert("Please fill all fields!");
    return;
  }

  let total = 0;
  const items = cart.map(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    return { ...item, subtotal };
  });

  // Save order
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({
    id: "ORD" + Date.now(),
    customer: name,
    email,
    address,
    items,
    total,
    paymentMethod,
    date: new Date().toLocaleString(),
    status: "Confirmed"
  });

  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem("cart");
  updateCartCount();

  alert("Order placed successfully! Redirecting to confirmation...");
  setTimeout(() => {
    window.location.href = "order-confirmation.html";
  }, 1000);
}

// Render orders
function renderOrders() {
  const container = document.getElementById("order-history");
  if (!container) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet. Start shopping!</p>";
    return;
  }

  container.innerHTML = orders.map((order, idx) => `
    <div class="order-card" style="padding: 15px; border: 1px solid #e50914; border-radius: 5px; margin-bottom: 15px; background: #111;">
      <h3>#${idx + 1} - ${order.id}</h3>
      <p><strong>Customer:</strong> ${order.customer}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Delivery Address:</strong> ${order.address}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p style="color: #e50914; font-weight: bold;"><strong>Status:</strong> ${order.status}</p>
      <p style="color: #e50914; font-size: 18px; font-weight: bold;"><strong>Total:</strong> ₹${order.total}</p>
      <h4>Items:</h4>
      <ul style="margin-left: 20px;">
        ${order.items.map(item => `<li>${item.name} x${item.quantity} = ₹${item.subtotal}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

// Load orders
function loadOrders() {
  renderOrders();
}

// ========================================
// SECTION 9: PROFILE MANAGEMENT
// ========================================

// Render user profile
function renderProfile() {
  const container = document.getElementById("profile-container");
  if (!container) return;

  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (!activeUser) {
    container.innerHTML = `
      <p style="font-size: 18px; margin: 20px 0;">Please login to view your profile.</p>
      <button onclick="showSection('auth')" style="padding: 10px 20px; background: #e50914; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Go to Login</button>
    `;
    return;
  }

  container.innerHTML = `
    <h2>My Profile</h2>
    <div style="padding: 20px; background: #111; border-radius: 10px; max-width: 500px; border: 1px solid #e50914;">
      <p><strong>Name:</strong> ${activeUser.name}</p>
      <p><strong>Email:</strong> ${activeUser.email}</p>
      <p><strong>Member Since:</strong> ${new Date(activeUser.id).toLocaleDateString()}</p>
      <div style="margin-top: 20px;">
        <button onclick="showSection('orders')" style="margin: 10px 5px; padding: 10px 20px; background: #e50914; color: white; border: none; border-radius: 5px; cursor: pointer;">View Orders</button>
        <button onclick="showSection('wishlist')" style="margin: 10px 5px; padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">My Wishlist</button>
        <button onclick="logoutUser()" style="margin: 10px 5px; padding: 10px 20px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">Logout</button>
      </div>
    </div>
  `;
}

// Load profile
function loadUserProfile() {
  renderProfile();
}

// ========================================
// SECTION 10: NOTIFICATIONS
// ========================================

// Add notification
function addNotification(message) {
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  notifications.push({
    id: Date.now(),
    message,
    timestamp: new Date().toLocaleString()
  });
  localStorage.setItem("notifications", JSON.stringify(notifications));
  loadNotifications();
}

// Load notifications
function loadNotifications() {
  const notifList = document.getElementById("notification-list");
  if (!notifList) return;

  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  if (notifications.length === 0) {
    notifList.innerHTML = "<p>No notifications.</p>";
    return;
  }

  notifList.innerHTML = notifications.map(notif => `
    <li style="padding: 10px; background: #222; margin: 5px 0; border-radius: 5px; border-left: 3px solid #e50914;">
      ${notif.message}
      <small style="display: block; color: #999; margin-top: 5px;">${notif.timestamp}</small>
    </li>
  `).join("");
}

// Clear notifications
function clearNotifications() {
  if (confirm("Clear all notifications?")) {
    localStorage.removeItem("notifications");
    loadNotifications();
  }
}

// ========================================
// SECTION 11: THEME TOGGLE
// ========================================

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

// ========================================
// SECTION 12: OFFERS & PROMOTIONS
// ========================================

function displayOffers() {
  const adBanner = document.getElementById("advertisement");
  if (adBanner) {
    adBanner.innerHTML = `
      <h2>🔥 Big Sale is Live! Get up to 70% Off 🔥</h2>
      <p>Limited time only. Shop your favorites now!</p>
      <button onclick="showSection('products')" style="padding: 10px 20px; background: #e50914; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px;">Shop Now</button>
    `;
  }
}

// ========================================
// SECTION 13: NOTIFICATIONS & OFFERS SYSTEM
// ========================================

function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === "success" ? "#4caf50" : "#e50914"};
    color: white;
    border-radius: 5px;
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = "slideOut 0.3s ease-in-out";
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// ========================================
// SECTION 12B: PRODUCT REVIEWS (MISSING)
// ========================================

function getReviews() {
  return JSON.parse(localStorage.getItem("productReviews")) || [];
}

function saveReviews(reviews) {
  localStorage.setItem("productReviews", JSON.stringify(reviews));
}

function submitReview() {
  const name = document.getElementById("reviewer-name")?.value.trim();
  const text = document.getElementById("review-text")?.value.trim();
  const rating = document.getElementById("review-rating")?.value;

  if (!name || !text || !rating) {
    alert("Please fill all review fields!");
    return;
  }

  let reviews = getReviews();
  reviews.push({
    id: Date.now(),
    name,
    text,
    rating: parseInt(rating),
    date: new Date().toLocaleString()
  });

  saveReviews(reviews);
  alert("Thank you for your review!");
  
  // Clear form
  document.getElementById("reviewer-name").value = "";
  document.getElementById("review-text").value = "";
  document.getElementById("review-rating").value = "5";
  
  loadReviews();
}

function loadReviews() {
  const reviewsList = document.getElementById("reviews-list");
  if (!reviewsList) return;

  const reviews = getReviews();

  if (reviews.length === 0) {
    reviewsList.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
    return;
  }

  reviewsList.innerHTML = reviews.map(review => `
    <li style="padding: 15px; border: 1px solid #333; margin: 10px 0; border-radius: 5px; background: #111;">
      <strong>${review.name}</strong> - ${'⭐'.repeat(review.rating)}
      <small style="color: #999; float: right;">${review.date}</small>
      <p>${review.text}</p>
      <button onclick="deleteReview(${review.id})" style="background: #e50914; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Delete</button>
    </li>
  `).join("");
}

function deleteReview(reviewId) {
  if (confirm("Delete this review?")) {
    let reviews = getReviews();
    reviews = reviews.filter(r => r.id !== reviewId);
    saveReviews(reviews);
    loadReviews();
  }
}

// ========================================
// SECTION 12C: PRODUCT DETAILS FROM PRODUCT CARD
// ========================================

function addToCartFromDetails() {
  const productId = document.getElementById("product-id")?.value || "p1";
  const name = document.getElementById("product-title")?.innerText || "Product";
  const price = parseFloat(document.getElementById("product-price")?.innerText || 0);
  const image = document.getElementById("main-product-image")?.src || "img/p1.jpg";
  
  if (!name || !price) {
    alert("Product information incomplete!");
    return;
  }

  addToCart(productId, name, price, image);
}

// ========================================
// SECTION 12D: 360 PRODUCT VIEWER
// ========================================

let currentFrame = 0;

function prevFrame() {
  currentFrame = (currentFrame - 1 + 5) % 5;
  updateViewerFrame();
}

function nextFrame() {
  currentFrame = (currentFrame + 1) % 5;
  updateViewerFrame();
}

function updateViewerFrame() {
  const viewerImage = document.getElementById("viewer-image");
  if (viewerImage) {
    viewerImage.style.opacity = "0.5";
    setTimeout(() => {
      viewerImage.style.opacity = "1";
    }, 100);
  }
}

// ========================================
// SECTION 12E: ADMIN PANEL FEATURES
// ========================================

function getAdminProducts() {
  return JSON.parse(localStorage.getItem("adminProducts")) || [];
}

function saveAdminProducts(products) {
  localStorage.setItem("adminProducts", JSON.stringify(products));
}

function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("product-name")?.value.trim();
  const category = document.getElementById("product-category")?.value.trim();
  const price = document.getElementById("product-price")?.value.trim();
  const image = document.getElementById("product-image")?.value.trim();

  if (!name || !category || !price || !image) {
    alert("All fields are required!");
    return;
  }

  let products = getAdminProducts();
  const newProduct = {
    id: "custom" + Date.now(),
    name,
    category,
    price: parseFloat(price),
    image
  };

  products.push(newProduct);
  saveAdminProducts(products);
  
  alert("Product added successfully!");
  
  // Clear form
  document.getElementById("product-name").value = "";
  document.getElementById("product-category").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-image").value = "";
  
  loadAdminProducts();
}

function loadAdminProducts() {
  const adminOrders = document.getElementById("admin-orders");
  if (!adminOrders) return;

  const products = getAdminProducts();

  if (products.length === 0) {
    adminOrders.innerHTML = "<p>No custom products added yet.</p>";
    return;
  }

  adminOrders.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="background: #222;">
        <th style="border: 1px solid #333; padding: 10px;">Product Name</th>
        <th style="border: 1px solid #333; padding: 10px;">Category</th>
        <th style="border: 1px solid #333; padding: 10px;">Price</th>
        <th style="border: 1px solid #333; padding: 10px;">Actions</th>
      </tr>
      ${products.map(p => `
        <tr style="border: 1px solid #333;">
          <td style="border: 1px solid #333; padding: 10px;">${p.name}</td>
          <td style="border: 1px solid #333; padding: 10px;">${p.category}</td>
          <td style="border: 1px solid #333; padding: 10px;">₹${p.price}</td>
          <td style="border: 1px solid #333; padding: 10px;">
            <button onclick="deleteAdminProduct('${p.id}')" style="background: #e50914; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Delete</button>
          </td>
        </tr>
      `).join("")}
    </table>
  `;
}

function deleteAdminProduct(productId) {
  if (confirm("Delete this product?")) {
    let products = getAdminProducts();
    products = products.filter(p => p.id !== productId);
    saveAdminProducts(products);
    loadAdminProducts();
  }
}

// ========================================
// SECTION 12F: USER SETTINGS UPDATE
// ========================================

function updateSettings(event) {
  event.preventDefault();

  let user = JSON.parse(localStorage.getItem("activeUser"));
  if (!user) {
    alert("Please login first!");
    return;
  }

  const username = document.getElementById("username")?.value.trim();
  const userEmail = document.getElementById("user-email")?.value.trim();
  const userPassword = document.getElementById("user-password")?.value.trim();

  if (username) user.name = username;
  if (userEmail) user.email = userEmail;
  if (userPassword) user.password = userPassword;

  localStorage.setItem("activeUser", JSON.stringify(user));
  alert("Settings updated successfully!");

  // Update users array
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem("users", JSON.stringify(users));

  // Clear form
  document.getElementById("username").value = "";
  document.getElementById("user-email").value = "";
  document.getElementById("user-password").value = "";
}

// ========================================
// SECTION 12G: CLEAR WISHLIST
// ========================================

function clearWishlist() {
  if (confirm("Clear entire wishlist? This cannot be undone.")) {
    localStorage.removeItem("wishlist");
    renderWishlist();
    alert("Wishlist cleared!");
  }
}

// ========================================
// SECTION 12H: NOTIFICATION & OFFERS ICONS
// ========================================

function updateNotificationBadge() {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const notifIcon = document.getElementById("nav-notif");
  
  if (notifIcon && notifications.length > 0) {
    const badge = notifIcon.querySelector(".badge") || document.createElement("span");
    badge.className = "badge";
    badge.style.cssText = `
      position: absolute;
      top: -5px;
      right: -5px;
      background: #e50914;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
    `;
    badge.innerText = notifications.length;
    
    if (!notifIcon.querySelector(".badge")) {
      notifIcon.style.position = "relative";
      notifIcon.appendChild(badge);
    }
  }
}

// ========================================
// SECTION 14: INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // Load theme
  loadTheme();

  // Update navbar
  updateNavbarUser();

  // Load all data
  loadProducts();
  loadCart();
  loadWishlist();
  loadOrders();
  loadUserProfile();
  loadNotifications();
  loadAdminProducts();
  loadReviews();
  displayOffers();
  renderSearchHistory();
  updateNotificationBadge();

  // Welcome screen
  const skipBtn = document.getElementById("enter-btn");
  if (skipBtn) {
    skipBtn.onclick = skipWelcome;
  }

  // Notification icon
  const notifIcon = document.getElementById("nav-notif");
  if (notifIcon) {
    notifIcon.style.cursor = "pointer";
    notifIcon.addEventListener("click", () => showSection("notifications"));
  }

  // Offers icon
  const offersIcon = document.getElementById("nav-offers");
  if (offersIcon) {
    offersIcon.style.cursor = "pointer";
    offersIcon.addEventListener("click", () => {
      addNotification("🎁 Check out our latest flash deals and promotions!");
      showSection("products");
    });
  }

  // Search functionality
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-bar");
  
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      searchProducts();
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchProducts();
      }
    });
  }

  // Filter and sort listeners
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortSelect = document.getElementById("sort-products");

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts);
  }
  if (priceFilter) {
    priceFilter.addEventListener("input", filterProducts);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortProducts(e.target.value);
    });
  }

  // Carousel
  autoCarousel();

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  // Signup form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", signupUser);
  }

  // Checkout form
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", processCheckout);
  }

  // Settings form
  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", updateSettings);
  }

  // Admin add product form
  const adminForm = document.getElementById("admin-add-product");
  if (adminForm) {
    adminForm.addEventListener("submit", addProduct);
  }

  // Wishlist clear button
  const clearWishlistBtn = document.querySelector("[onclick='clearWishlist()']");
  if (clearWishlistBtn) {
    clearWishlistBtn.addEventListener("click", clearWishlist);
  }

  // Notification clear button
  const clearNotifBtn = document.getElementById("clear-notifications");
  if (clearNotifBtn) {
    clearNotifBtn.addEventListener("click", clearNotifications);
  }

  // Search history clear button
  const clearHistoryBtn = document.getElementById("clear-history");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearSearchHistory);
  }

  // Add some initial notifications
  addNotification("🎉 Welcome to Luxora! Enjoy 70% off on selected items!");
  addNotification("📦 Free shipping on orders above ₹1000!");
});

// Polyfill for older browsers
if (!document.querySelectorAll.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
