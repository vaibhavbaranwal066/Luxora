// =======================
// MAIN.JS (Part 1 - FIXED)
// =======================

// ---------- WELCOME SCREEN ----------
document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const enterBtn = document.getElementById("enter-btn");

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      if (welcomeScreen) {
        welcomeScreen.style.opacity = "0";
        setTimeout(() => (welcomeScreen.style.display = "none"), 800);
      }
    });
  }

  // Load cart + search history initially
  loadCart();
  loadSearchHistory();
});

// ---------- NAVIGATION ----------
function navigateTo(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none";
  });
  const target = document.getElementById(sectionId);
  if (target) target.style.display = "block";
}

// ---------- CART HANDLING ----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId, name, price, image) {
  let cart = getCart();

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name, price, image, quantity: 1 });
  }

  saveCart(cart);
  renderCart();
}

function removeFromCart(productId) {
  let cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateCartQuantity(productId, qty) {
  let cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) item.quantity = Math.max(1, qty);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");

  if (!cartContainer || !totalContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    totalContainer.innerText = "₹0";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
            <input type="number" min="1" value="${item.quantity}" 
              onchange="updateCartQuantity('${item.id}', this.value)">
            <button onclick="removeFromCart('${item.id}')">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  totalContainer.innerText = `₹${total}`;
}

function loadCart() {
  renderCart();
}
// =======================
// MAIN.JS (Part 2 - FIXED)
// =======================

// ---------- SEARCH HISTORY ----------
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function saveSearchHistory(history) {
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

function addToSearchHistory(term) {
  if (!term) return;
  let history = getSearchHistory();

  // Avoid duplicates, move recent to top
  history = history.filter((item) => item !== term);
  history.unshift(term);

  // Keep max 5 terms
  if (history.length > 5) history.pop();

  saveSearchHistory(history);
  renderSearchHistory();
}

function renderSearchHistory() {
  const historyContainer = document.getElementById("search-history");
  if (!historyContainer) return;

  const history = getSearchHistory();

  if (history.length === 0) {
    historyContainer.innerHTML = "<p>No recent searches</p>";
    return;
  }

  historyContainer.innerHTML = history
    .map(
      (item) => `
      <button class="history-item" onclick="searchProducts('${item}')">
        ${item}
      </button>`
    )
    .join("");
}

function clearSearchHistory() {
  localStorage.removeItem("searchHistory");
  renderSearchHistory();
}

// ---------- SEARCH PRODUCTS ----------
function searchProducts(term) {
  const query =
    term || document.getElementById("search-bar")?.value?.trim().toLowerCase();
  if (!query) return;

  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const name = product
      .querySelector("h3")
      .innerText.toLowerCase();

    if (name.includes(query)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });

  addToSearchHistory(query);
}

// ---------- FILTER PRODUCTS ----------
function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    if (category === "all" || product.dataset.category === category) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// ---------- SORT PRODUCTS ----------
function sortProducts(order) {
  const container = document.getElementById("product-list");
  if (!container) return;

  const products = Array.from(container.querySelectorAll(".product-card"));

  products.sort((a, b) => {
    const priceA = parseFloat(
      a.querySelector(".price").innerText.replace("₹", "")
    );
    const priceB = parseFloat(
      b.querySelector(".price").innerText.replace("₹", "")
    );
    return order === "low-high" ? priceA - priceB : priceB - priceA;
  });

  container.innerHTML = "";
  products.forEach((p) => container.appendChild(p));
}

// ---------- INITIAL LOAD ----------
function loadSearchHistory() {
  renderSearchHistory();
}
// =======================
// MAIN.JS (Part 3 - FIXED)
// =======================

// ---------- WISHLIST ----------
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productId, name, price, image) {
  let wishlist = getWishlist();
  const exists = wishlist.find((item) => item.id === productId);

  if (exists) {
    wishlist = wishlist.filter((item) => item.id !== productId);
  } else {
    wishlist.push({ id: productId, name, price, image });
  }

  saveWishlist(wishlist);
  renderWishlist();
}

function renderWishlist() {
  const wishlistContainer = document.getElementById("wishlist-items");
  if (!wishlistContainer) return;

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>No items in wishlist</p>";
    return;
  }

  wishlistContainer.innerHTML = wishlist
    .map(
      (item) => `
        <div class="wishlist-item">
          <img src="${item.image}" alt="${item.name}">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
          <button onclick="toggleWishlist('${item.id}', '${item.name}', ${item.price}, '${item.image}')">
            Remove
          </button>
        </div>
      `
    )
    .join("");
}

// ---------- REVIEWS ----------
function getReviews(productId) {
  return JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
}

function saveReview(productId, user, text) {
  const reviews = getReviews(productId);
  reviews.push({ user, text, date: new Date().toLocaleString() });
  localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
  renderReviews(productId);
}

function renderReviews(productId) {
  const container = document.getElementById(`reviews-${productId}`);
  if (!container) return;

  const reviews = getReviews(productId);
  if (reviews.length === 0) {
    container.innerHTML = "<p>No reviews yet</p>";
    return;
  }

  container.innerHTML = reviews
    .map(
      (r) => `
        <div class="review">
          <strong>${r.user}</strong> (${r.date})
          <p>${r.text}</p>
        </div>
      `
    )
    .join("");
}

// ---------- RECENTLY VIEWED ----------
function getRecentlyViewed() {
  return JSON.parse(localStorage.getItem("recentlyViewed")) || [];
}

function addRecentlyViewed(productId, name, price, image) {
  let viewed = getRecentlyViewed();

  // Avoid duplicates
  viewed = viewed.filter((item) => item.id !== productId);
  viewed.unshift({ id: productId, name, price, image });

  // Keep only 5 latest
  if (viewed.length > 5) viewed.pop();

  localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const container = document.getElementById("recently-viewed");
  if (!container) return;

  const viewed = getRecentlyViewed();
  if (viewed.length === 0) {
    container.innerHTML = "<p>No recently viewed products</p>";
    return;
  }

  container.innerHTML = viewed
    .map(
      (item) => `
        <div class="recent-item">
          <img src="${item.image}" alt="${item.name}">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
        </div>
      `
    )
    .join("");
}
// =======================
// MAIN.JS (Part 4 - FIXED)
// =======================

// ---------- 360° PRODUCT VIEWER ----------
function init360Viewer(productId, imagePaths) {
  const container = document.getElementById(`viewer-${productId}`);
  if (!container) return;

  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;

  // Create an <img> element inside viewer
  container.innerHTML = `<img src="${imagePaths[0]}" alt="360° view" class="viewer-img">`;
  const imgElement = container.querySelector("img");

  function showFrame(frame) {
    imgElement.src = imagePaths[frame];
  }

  // Mouse events
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  container.addEventListener("mouseup", () => (isDragging = false));
  container.addEventListener("mouseleave", () => (isDragging = false));

  container.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) {
      currentFrame = (currentFrame + (dx > 0 ? 1 : -1) + imagePaths.length) % imagePaths.length;
      showFrame(currentFrame);
      startX = e.clientX;
    }
  });

  // Touch events (mobile)
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  container.addEventListener("touchend", () => (isDragging = false));
  container.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    if (Math.abs(dx) > 5) {
      currentFrame = (currentFrame + (dx > 0 ? 1 : -1) + imagePaths.length) % imagePaths.length;
      showFrame(currentFrame);
      startX = e.touches[0].clientX;
    }
  });
}

// ---------- ZOOM FEATURE ----------
function enableZoom(productId) {
  const img = document.getElementById(`zoom-${productId}`);
  if (!img) return;

  const zoomLens = document.createElement("div");
  zoomLens.classList.add("zoom-lens");
  img.parentElement.style.position = "relative";
  img.parentElement.appendChild(zoomLens);

  const zoomResult = document.createElement("div");
  zoomResult.classList.add("zoom-result");
  img.parentElement.appendChild(zoomResult);

  const zoomImg = document.createElement("img");
  zoomImg.src = img.src;
  zoomResult.appendChild(zoomImg);

  let lensSize = 100;
  zoomLens.style.width = lensSize + "px";
  zoomLens.style.height = lensSize + "px";

  img.addEventListener("mousemove", moveLens);
  zoomLens.addEventListener("mousemove", moveLens);
  img.addEventListener("mouseleave", () => {
    zoomLens.style.display = "none";
    zoomResult.style.display = "none";
  });
  img.addEventListener("mouseenter", () => {
    zoomLens.style.display = "block";
    zoomResult.style.display = "block";
  });

  function moveLens(e) {
    e.preventDefault();

    const rect = img.getBoundingClientRect();
    let x = e.clientX - rect.left - lensSize / 2;
    let y = e.clientY - rect.top - lensSize / 2;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > rect.width - lensSize) x = rect.width - lensSize;
    if (y > rect.height - lensSize) y = rect.height - lensSize;

    zoomLens.style.left = x + "px";
    zoomLens.style.top = y + "px";

    const scaleX = zoomImg.width / rect.width;
    const scaleY = zoomImg.height / rect.height;

    zoomImg.style.transform = `translate(-${x * scaleX}px, -${y * scaleY}px) scale(2)`;
  }
}
// =======================
// MAIN.JS (Part 5 - FIXED)
// =======================

// ---------- SEARCH HISTORY ----------
function getSearchHistory() {
  return JSON.parse(localStorage.getItem("searchHistory")) || [];
}

function saveSearchHistory(history) {
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

function renderSearchHistory() {
  const historyBox = document.getElementById("search-history");
  if (!historyBox) return;

  const history = getSearchHistory();
  if (history.length === 0) {
    historyBox.innerHTML = "<p class='empty-history'>No recent searches</p>";
    return;
  }

  historyBox.innerHTML = history
    .map(
      (term, index) => `
      <div class="search-history-item">
        <span onclick="selectSearchHistory('${term}')">${term}</span>
        <button class="remove-history" onclick="removeSearchHistory(${index}, event)">×</button>
      </div>`
    )
    .join("");
}

function addSearchTerm(term) {
  if (!term) return;
  let history = getSearchHistory();

  // remove duplicate if exists, then add to front
  history = history.filter((t) => t.toLowerCase() !== term.toLowerCase());
  history.unshift(term);

  // keep last 10 searches
  if (history.length > 10) history.pop();

  saveSearchHistory(history);
  renderSearchHistory();
}

function selectSearchHistory(term) {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = term;
    handleSearch();
  }
}

function removeSearchHistory(index, event) {
  event.stopPropagation();
  let history = getSearchHistory();
  history.splice(index, 1);
  saveSearchHistory(history);
  renderSearchHistory();
}

function handleSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;
  const term = searchInput.value.trim();
  if (!term) return;

  addSearchTerm(term);

  // Redirect to search results page (optional)
  window.location.href = `search.html?q=${encodeURIComponent(term)}`;
}

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

// Render history on load
document.addEventListener("DOMContentLoaded", renderSearchHistory);

// ---------- FILTER & SORT ----------
function filterProducts() {
  const categoryFilter = document.getElementById("filter-category");
  const priceFilter = document.getElementById("filter-price");

  const selectedCategory = categoryFilter ? categoryFilter.value : "all";
  const selectedPrice = priceFilter ? priceFilter.value : "all";

  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    let categoryMatch =
      selectedCategory === "all" ||
      product.dataset.category === selectedCategory;

    let priceMatch = true;
    const price = parseFloat(product.dataset.price);

    if (selectedPrice === "low") priceMatch = price < 500;
    else if (selectedPrice === "medium") priceMatch = price >= 500 && price <= 2000;
    else if (selectedPrice === "high") priceMatch = price > 2000;

    if (categoryMatch && priceMatch) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

function sortProducts() {
  const sortSelect = document.getElementById("sort-products");
  const sortValue = sortSelect ? sortSelect.value : "default";

  const container = document.getElementById("products-container");
  if (!container) return;

  let products = Array.from(container.querySelectorAll(".product-card"));

  if (sortValue === "price-low-high") {
    products.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } else if (sortValue === "price-high-low") {
    products.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  } else if (sortValue === "name-asc") {
    products.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
  } else if (sortValue === "name-desc") {
    products.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
  }

  // Re-append sorted products
  products.forEach((p) => container.appendChild(p));
}

// Attach filter & sort listeners
const categoryFilter = document.getElementById("filter-category");
const priceFilter = document.getElementById("filter-price");
const sortSelect = document.getElementById("sort-products");

if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);
if (priceFilter) priceFilter.addEventListener("change", filterProducts);
if (sortSelect) sortSelect.addEventListener("change", sortProducts);
// =======================
// MAIN.JS (Part 6 - Checkout & Payment)
// =======================

// ---------- CHECKOUT ----------
function renderCheckout() {
  const checkoutContainer = document.getElementById("checkout-container");
  if (!checkoutContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    checkoutContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  checkoutContainer.innerHTML = `
    <h2>Checkout</h2>
    <ul class="checkout-list">
      ${cart
        .map((item) => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;
          return `
          <li>
            ${item.name} (x${item.quantity}) - ₹${itemTotal}
          </li>`;
        })
        .join("")}
    </ul>
    <p class="checkout-total"><strong>Total: ₹${total}</strong></p>
    <button id="pay-btn">Proceed to Pay</button>
  `;

  const payBtn = document.getElementById("pay-btn");
  if (payBtn) {
    payBtn.addEventListener("click", () => initiatePayment(total, cart));
  }
}

// ---------- PAYMENT (Razorpay) ----------
function initiatePayment(total, cart) {
  const options = {
    key: "rzp_test_1234567890abcdef", // ⚡ Replace with your Razorpay Test Key
    amount: total * 100, // Razorpay accepts paise
    currency: "INR",
    name: "Luxora E-Commerce",
    description: "Order Payment",
    image: "https://your-logo-url.com/logo.png", // Optional logo
    handler: function (response) {
      alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

      // Save order in localStorage
      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push({
        id: Date.now(),
        items: cart,
        total: total,
        paymentId: response.razorpay_payment_id,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart after success
      localStorage.removeItem("cart");

      // Redirect to confirmation page
      window.location.href = "confirmation.html";
    },
    prefill: {
      name: "Customer Name", // Can be dynamic
      email: "customer@example.com",
      contact: "9876543210",
    },
    theme: {
      color: "#E50914", // Netflix red theme
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// ---------- CONFIRMATION PAGE ----------
function renderConfirmation() {
  const confirmContainer = document.getElementById("confirmation-container");
  if (!confirmContainer) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (orders.length === 0) {
    confirmContainer.innerHTML = "<p>No recent orders found.</p>";
    return;
  }

  const latestOrder = orders[orders.length - 1];

  confirmContainer.innerHTML = `
    <h2>Order Confirmed 🎉</h2>
    <p>Order ID: <strong>${latestOrder.id}</strong></p>
    <p>Payment ID: <strong>${latestOrder.paymentId}</strong></p>
    <p>Total Paid: <strong>₹${latestOrder.total}</strong></p>
    <p>Date: ${latestOrder.date}</p>
    <h3>Items:</h3>
    <ul>
      ${latestOrder.items
        .map(
          (item) => `
        <li>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</li>
      `
        )
        .join("")}
    </ul>
    <p>Thank you for shopping with Luxora ❤️</p>
    <a href="index.html"><button>Back to Home</button></a>
  `;
}

// ---------- INIT ON PAGE LOAD ----------
document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
  renderConfirmation();
});
// =======================
// MAIN.JS (Part 7 - Authentication)
// =======================

// ---------- USER SIGNUP ----------
function signupUser(event) {
  event.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!name || !email || !password) {
    alert("All fields are required!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  if (users.some((u) => u.email === email)) {
    alert("Email already registered! Please login.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // ⚠️ In real apps, hash this!
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
}

// ---------- USER LOGIN ----------
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  // Save active user
  localStorage.setItem("activeUser", JSON.stringify(user));

  alert("Login successful!");
  window.location.href = "index.html";
}

// ---------- LOGOUT ----------
function logoutUser() {
  localStorage.removeItem("activeUser");
  alert("Logged out successfully!");
  window.location.href = "index.html";
}

// ---------- CHECK LOGIN STATUS ----------
function updateNavbarUser() {
  const userContainer = document.getElementById("user-container");
  if (!userContainer) return;

  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (activeUser) {
    userContainer.innerHTML = `
      <span>Welcome, ${activeUser.name}</span>
      <button onclick="logoutUser()">Logout</button>
    `;
  } else {
    userContainer.innerHTML = `
      <a href="login.html">Login</a> | 
      <a href="signup.html">Signup</a>
    `;
  }
}

// ---------- INIT ON PAGE LOAD ----------
document.addEventListener("DOMContentLoaded", () => {
  updateNavbarUser();
});
// =======================
// MAIN.JS (Part 8 - Wishlist)
// =======================

// ---------- ADD TO WISHLIST ----------
function addToWishlist(productId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) {
    alert("Please login to use wishlist.");
    window.location.href = "login.html";
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};

  if (!wishlist[activeUser.email]) {
    wishlist[activeUser.email] = [];
  }

  if (!wishlist[activeUser.email].includes(productId)) {
    wishlist[activeUser.email].push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to Wishlist!");
  } else {
    alert("Product already in Wishlist!");
  }
}

// ---------- REMOVE FROM WISHLIST ----------
function removeFromWishlist(productId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};

  if (wishlist[activeUser.email]) {
    wishlist[activeUser.email] = wishlist[activeUser.email].filter(
      (id) => id !== productId
    );
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
  }
}

// ---------- RENDER WISHLIST PAGE ----------
function renderWishlist() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const container = document.getElementById("wishlist-container");
  if (!container || !activeUser) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
  let userWishlist = wishlist[activeUser.email] || [];

  if (userWishlist.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  container.innerHTML = userWishlist
    .map(
      (id) => `
      <div class="wishlist-item">
        <div>${getProductName(id)} - ₹${getProductPrice(id)}</div>
        <button onclick="removeFromWishlist('${id}')">Remove</button>
      </div>
    `
    )
    .join("");
}

// ---------- HELPER FUNCTIONS ----------
function getProductName(id) {
  const product = document.querySelector(
    `.product-card[data-id='${id}'] h3`
  );
  return product ? product.innerText : "Unknown Product";
}

function getProductPrice(id) {
  const product = document.querySelector(
    `.product-card[data-id='${id}'] .price`
  );
  return product ? product.innerText.replace("₹", "") : "0";
}
// =======================
// MAIN.JS (Part 9 - Cart System)
// =======================

// ---------- ADD TO CART ----------
function addToCart(productId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) {
    alert("Please login to add items to cart.");
    window.location.href = "login.html";
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (!cart[activeUser.email]) {
    cart[activeUser.email] = {};
  }

  if (!cart[activeUser.email][productId]) {
    cart[activeUser.email][productId] = 1; // First time
  } else {
    cart[activeUser.email][productId] += 1; // Increase quantity
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
  updateCartCount();
}

// ---------- REMOVE FROM CART ----------
function removeFromCart(productId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[activeUser.email] && cart[activeUser.email][productId]) {
    delete cart[activeUser.email][productId];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }
}

// ---------- UPDATE CART QUANTITY ----------
function updateCartQuantity(productId, quantity) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[activeUser.email] && quantity > 0) {
    cart[activeUser.email][productId] = quantity;
  } else if (quantity <= 0) {
    delete cart[activeUser.email][productId];
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// ---------- RENDER CART ----------
function renderCart() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const container = document.getElementById("cart-container");
  if (!container || !activeUser) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let userCart = cart[activeUser.email] || {};

  if (Object.keys(userCart).length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  container.innerHTML = Object.entries(userCart)
    .map(([id, qty]) => {
      const price = parseFloat(getProductPrice(id));
      const name = getProductName(id);
      const subTotal = price * qty;
      total += subTotal;
      return `
        <div class="cart-item">
          <div>${name} - ₹${price} x 
            <input type="number" min="1" value="${qty}" 
              onchange="updateCartQuantity('${id}', this.value)" />
          </div>
          <div>Subtotal: ₹${subTotal}</div>
          <button onclick="removeFromCart('${id}')">Remove</button>
        </div>
      `;
    })
    .join("");

  container.innerHTML += `<h3>Total: ₹${total}</h3>`;
}

// ---------- UPDATE CART COUNT (NAVBAR ICON) ----------
function updateCartCount() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let userCart = cart[activeUser.email] || {};
  let count = Object.values(userCart).reduce((a, b) => a + b, 0);

  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.innerText = count;
}
// =======================
// MAIN.JS (Part 10 - Checkout & Orders)
// =======================

// ---------- CHECKOUT ----------
function checkout() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) {
    alert("Please login to checkout.");
    window.location.href = "login.html";
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let userCart = cart[activeUser.email] || {};

  if (Object.keys(userCart).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let total = 0;
  let orderItems = Object.entries(userCart).map(([id, qty]) => {
    const price = parseFloat(getProductPrice(id));
    const name = getProductName(id);
    const subTotal = price * qty;
    total += subTotal;
    return { id, name, price, qty, subTotal };
  });

  // -------- PAYMENT PLACEHOLDER --------
  alert(`Redirecting to Razorpay/Stripe... Total: ₹${total}`);

  // In real integration, call Razorpay/Stripe API here

  // -------- SAVE ORDER --------
  let orders = JSON.parse(localStorage.getItem("orders")) || {};
  if (!orders[activeUser.email]) {
    orders[activeUser.email] = [];
  }

  const order = {
    id: "ORD" + Date.now(),
    date: new Date().toLocaleString(),
    items: orderItems,
    total: total,
    status: "Confirmed"
  };

  orders[activeUser.email].push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // -------- CLEAR CART --------
  cart[activeUser.email] = {};
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Order placed successfully!");
  window.location.href = "orders.html";
}

// ---------- RENDER ORDERS ----------
function renderOrders() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const container = document.getElementById("orders-container");
  if (!container || !activeUser) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || {};
  let userOrders = orders[activeUser.email] || [];

  if (userOrders.length === 0) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  container.innerHTML = userOrders
    .map(order => {
      let itemsHTML = order.items
        .map(
          item =>
            `<li>${item.name} - ₹${item.price} x ${item.qty} = ₹${item.subTotal}</li>`
        )
        .join("");

      return `
        <div class="order-card">
          <h3>Order ID: ${order.id}</h3>
          <p>Date: ${order.date}</p>
          <ul>${itemsHTML}</ul>
          <h4>Total: ₹${order.total}</h4>
          <p>Status: ${order.status}</p>
        </div>
      `;
    })
    .join("");
}
// =======================
// MAIN.JS (Part 11 - Profile Management)
// =======================

// ---------- STORAGE HELPERS ----------
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function getActiveUser() {
  return JSON.parse(localStorage.getItem("activeUser"));
}
function setActiveUser(user) {
  localStorage.setItem("activeUser", JSON.stringify(user));
  updateNavbarUser?.();
}

// Migrate per-email stores when email changes
function migrateUserKey(oldEmail, newEmail) {
  if (!oldEmail || oldEmail === newEmail) return;

  // cart
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  if (cart[oldEmail] && !cart[newEmail]) {
    cart[newEmail] = cart[oldEmail];
    delete cart[oldEmail];
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // wishlist
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
  if (wishlist[oldEmail] && !wishlist[newEmail]) {
    wishlist[newEmail] = wishlist[oldEmail];
    delete wishlist[oldEmail];
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  // orders
  let orders = JSON.parse(localStorage.getItem("orders")) || {};
  if (orders[oldEmail] && !orders[newEmail]) {
    orders[newEmail] = orders[oldEmail];
    delete orders[oldEmail];
    localStorage.setItem("orders", JSON.stringify(orders));
  }
}

// ---------- RENDER PROFILE ----------
function renderProfile() {
  const container = document.getElementById("profile-container");
  if (!container) return;

  const user = getActiveUser();
  if (!user) {
    container.innerHTML = `
      <p>Please login to view your profile.</p>
      <a href="login.html"><button>Go to Login</button></a>
    `;
    return;
  }

  container.innerHTML = `
    <h2>My Profile</h2>

    <div class="profile-card">
      <div class="avatar-block">
        <img id="profile-avatar-preview" src="${user.avatar || 'img/default-avatar.png'}" alt="Avatar" class="avatar">
        <label class="upload-btn">
          <input type="file" id="profile-avatar" accept="image/*" hidden>
          Change Avatar
        </label>
      </div>

      <form id="profile-form">
        <label>Full Name</label>
        <input type="text" id="profile-name" value="${user.name || ''}" required>

        <label>Email</label>
        <input type="email" id="profile-email" value="${user.email}" required>

        <button type="submit">Save Profile</button>
      </form>
    </div>

    <div class="profile-card">
      <h3>Change Password</h3>
      <form id="password-form">
        <label>Current Password</label>
        <input type="password" id="current-password" required>

        <label>New Password</label>
        <input type="password" id="new-password" minlength="6" required>

        <label>Confirm New Password</label>
        <input type="password" id="confirm-password" minlength="6" required>

        <button type="submit">Update Password</button>
      </form>
    </div>

    <div class="profile-card danger">
      <h3>Danger Zone</h3>
      <button id="logout-btn">Logout</button>
      <button id="delete-account-btn" class="danger-btn">Delete Account</button>
    </div>
  `;

  // Bind events
  document.getElementById("profile-form").addEventListener("submit", updateProfile);
  document.getElementById("password-form").addEventListener("submit", changePassword);
  document.getElementById("logout-btn").addEventListener("click", logoutUser);
  document.getElementById("delete-account-btn").addEventListener("click", deleteAccount);

  const avatarInput = document.getElementById("profile-avatar");
  const avatarPreview = document.getElementById("profile-avatar-preview");
  avatarInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    avatarPreview.src = base64;
    // Temp save on preview; final save happens on "Save Profile"
    const u = getActiveUser();
    u.avatar = base64;
    setActiveUser(u);
    // also persist in users array
    const users = getUsers().map(x => x.id === u.id ? { ...x, avatar: base64 } : x);
    setUsers(users);
  });
}

// ---------- UTIL: file -> base64 ----------
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

// ---------- UPDATE PROFILE (name/email/avatar already previewed) ----------
function updateProfile(e) {
  e.preventDefault();
  const user = getActiveUser();
  if (!user) return;

  const newName = document.getElementById("profile-name").value.trim();
  const newEmail = document.getElementById("profile-email").value.trim();

  if (!newName || !newEmail) {
    alert("Name and Email are required.");
    return;
  }

  // Unique email check
  const users = getUsers();
  if (newEmail !== user.email && users.some(u => u.email === newEmail)) {
    alert("This email is already registered.");
    return;
  }

  const oldEmail = user.email;
  const updatedUser = { ...user, name: newName, email: newEmail };

  // Persist in users array
  const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
  setUsers(updatedUsers);

  // Migrate per-email data if email changed
  migrateUserKey(oldEmail, newEmail);

  // Persist active user
  setActiveUser(updatedUser);

  alert("Profile updated successfully!");
}

// ---------- CHANGE PASSWORD ----------
function changePassword(e) {
  e.preventDefault();
  const user = getActiveUser();
  if (!user) return;

  const current = document.getElementById("current-password").value;
  const next = document.getElementById("new-password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (current !== user.password) {
    alert("Current password is incorrect.");
    return;
  }
  if (next.length < 6) {
    alert("New password must be at least 6 characters.");
    return;
  }
  if (next !== confirm) {
    alert("New password and confirmation do not match.");
    return;
  }

  const users = getUsers().map(u => u.id === user.id ? { ...u, password: next } : u);
  setUsers(users);
  setActiveUser({ ...user, password: next });

  // Clear inputs
  document.getElementById("current-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";

  alert("Password updated successfully!");
}

// ---------- DELETE ACCOUNT ----------
function deleteAccount() {
  const user = getActiveUser();
  if (!user) return;

  if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
    return;
  }

  // Remove from users
  const remaining = getUsers().filter(u => u.id !== user.id);
  setUsers(remaining);

  // Remove per-email data
  const email = user.email;

  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  if (cart[email]) {
    delete cart[email];
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
  if (wishlist[email]) {
    delete wishlist[email];
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || {};
  if (orders[email]) {
    delete orders[email];
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  // Logout
  localStorage.removeItem("activeUser");
  alert("Your account has been deleted.");
  window.location.href = "index.html";
}

// ---------- AUTO-INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  // Render profile if on profile page
  renderProfile();
});

// =======================
// MAIN.JS (Part 12 - Reviews & Ratings)
// =======================

// ---------- SUBMIT REVIEW ----------
function submitReview(productId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) {
    alert("Please login to write a review.");
    window.location.href = "login.html";
    return;
  }

  const rating = document.querySelector(
    `#review-form-${productId} select`
  ).value;
  const text = document.querySelector(
    `#review-form-${productId} textarea`
  ).value;

  if (!rating || !text) {
    alert("Please provide both rating and review.");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
  if (!reviews[productId]) {
    reviews[productId] = [];
  }

  // Prevent multiple reviews from same user
  const alreadyReviewed = reviews[productId].some(
    r => r.user === activeUser.email
  );
  if (alreadyReviewed) {
    alert("You have already reviewed this product.");
    return;
  }

  const review = {
    user: activeUser.email,
    rating: parseInt(rating),
    text,
    date: new Date().toLocaleString()
  };

  reviews[productId].push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));

  alert("Review submitted successfully!");
  renderReviews(productId);
}

// ---------- RENDER REVIEWS ----------
function renderReviews(productId) {
  const container = document.getElementById(`reviews-${productId}`);
  if (!container) return;

  let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
  let productReviews = reviews[productId] || [];

  if (productReviews.length === 0) {
    container.innerHTML = "<p>No reviews yet. Be the first!</p>";
    return;
  }

  container.innerHTML = productReviews
    .map(
      r => `
      <div class="review">
        <strong>${r.user}</strong> 
        <span>⭐ ${r.rating}</span>
        <p>${r.text}</p>
        <small>${r.date}</small>
      </div>
    `
    )
    .join("");
}
/************************************************************
 * ADMIN DASHBOARD FUNCTIONS
 ************************************************************/

// ✅ Add a new product (Admin Panel)
function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("product-name").value.trim();
  const category = document.getElementById("product-category").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const image = document.getElementById("product-image").value.trim();

  if (!name || !category || !price || !image) {
    alert("⚠️ Please fill out all product fields!");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    category,
    price,
    image
  };

  // Save to localStorage
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  alert("✅ Product added successfully!");
  document.getElementById("admin-add-product").reset();

  // Refresh products list on homepage
  loadProducts();
}

// ✅ Load orders into Admin Panel
function loadAdminOrders() {
  const adminOrdersDiv = document.getElementById("admin-orders");
  if (!adminOrdersDiv) return;

  adminOrdersDiv.innerHTML = "";

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    adminOrdersDiv.innerHTML = "<p>No orders placed yet.</p>";
    return;
  }

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("admin-order");

    orderDiv.innerHTML = `
      <h4>Order #${order.id}</h4>
      <p><strong>Customer:</strong> ${order.customer || "Guest"}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Status:</strong> ${order.status || "Pending"}</p>
      <button onclick="updateOrderStatus(${order.id}, 'Shipped')">Mark Shipped</button>
      <button onclick="updateOrderStatus(${order.id}, 'Delivered')">Mark Delivered</button>
    `;

    adminOrdersDiv.appendChild(orderDiv);
  });
}

// ✅ Update order status
function updateOrderStatus(orderId, newStatus) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) return;

  orders[orderIndex].status = newStatus;
  localStorage.setItem("orders", JSON.stringify(orders));

  // Add notification for customer
  addNotification(`Your order #${orderId} is now ${newStatus}.`);

  loadAdminOrders();
}

// ✅ Add notification (for both users & admin)
function addNotification(message) {
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  notifications.push({ id: Date.now(), message });
  localStorage.setItem("notifications", JSON.stringify(notifications));

  loadNotifications();
}

// ✅ Load notifications
function loadNotifications() {
  const notifList = document.getElementById("notification-list");
  if (!notifList) return;

  notifList.innerHTML = "";
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  if (notifications.length === 0) {
    notifList.innerHTML = "<p>No notifications.</p>";
    return;
  }

  notifications.forEach(notif => {
    const li = document.createElement("li");
    li.textContent = notif.message;
    notifList.appendChild(li);
  });
}

// ✅ Clear notifications
function clearNotifications() {
  localStorage.removeItem("notifications");
  loadNotifications();
}
/************************************************************
 * USER DASHBOARD FUNCTIONS
 ************************************************************/

// ✅ Load dashboard overview stats
function loadDashboard() {
  const dashboardSection = document.getElementById("dashboard");
  if (!dashboardSection) return;

  // Stats (can be displayed later if you want numbers on cards)
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let user = JSON.parse(localStorage.getItem("userProfile")) || {};

  // Example: setting text inside cards dynamically
  const cards = dashboardSection.querySelectorAll(".card");
  cards.forEach(card => {
    if (card.textContent.includes("Orders")) {
      card.querySelector("p").textContent = `You have ${orders.length} orders`;
    }
    if (card.textContent.includes("Wishlist")) {
      card.querySelector("p").textContent = `Saved ${wishlist.length} items`;
    }
    if (card.textContent.includes("Cart")) {
      card.querySelector("p").textContent = `Currently ${cart.length} items`;
    }
    if (card.textContent.includes("Profile")) {
      card.querySelector("p").textContent = user.name
        ? `Logged in as ${user.name}`
        : `Guest user`;
    }
  });
}

// ✅ Navigate to sections from Dashboard cards
function showSection(sectionId) {
  // Hide all sections first
  document.querySelectorAll(".page-section").forEach(sec => {
    sec.classList.add("hidden");
  });

  // Show selected one
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove("hidden");
  }

  // Extra: Auto-load content if needed
  if (sectionId === "orders") loadOrders();
  if (sectionId === "wishlist") loadWishlist();
  if (sectionId === "cart") loadCart();
  if (sectionId === "profile") loadUserProfile();
  if (sectionId === "notifications") loadNotifications();
  if (sectionId === "admin") loadAdminOrders();
  if (sectionId === "dashboard") loadDashboard();
}

// ✅ Initialize dashboard on page load
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});
/************************************************************
 * GLOBAL EVENT LISTENERS & INITIALIZATION
 ************************************************************/

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Load essential data on startup
  loadProducts();
  loadCart();
  loadWishlist();
  loadOrders();
  loadUserProfile();
  loadNotifications();
  loadDashboard();

  // ✅ Search bar listener
  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    searchBar.addEventListener("input", event => {
      filterProducts(event.target.value);
    });
  }

  // ✅ Search history clear button
  const clearHistoryBtn = document.getElementById("clear-history");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearSearchHistory);
  }

  // ✅ Payment button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handlePayment);
  }

  // ✅ Profile form submission
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", saveUserProfile);
  }

  // ✅ Admin add product form
  const adminForm = document.getElementById("admin-add-product");
  if (adminForm) {
    adminForm.addEventListener("submit", addProduct);
  }

  // ✅ Notifications clear button
  const clearNotifBtn = document.getElementById("clear-notifications");
  if (clearNotifBtn) {
    clearNotifBtn.addEventListener("click", clearNotifications);
  }

  // ✅ Section navigation (for Dashboard / Navbar links)
  document.querySelectorAll("[data-section]").forEach(btn => {
    btn.addEventListener("click", () => {
      const sectionId = btn.getAttribute("data-section");
      showSection(sectionId);
    });
  });

  // ✅ Dark mode toggle (if available)
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  // ✅ Welcome screen button → go to shop
  const enterShopBtn = document.getElementById("enter-shop");
  if (enterShopBtn) {
    enterShopBtn.addEventListener("click", () => {
      showSection("shop");
    });
  }

  // ✅ Initialize product 360 viewer (if present)
  init360View();
});
let products = []; // store products in memory (or localStorage)

function addProduct(event) {
  event.preventDefault();

  // Get values from form
  const name = document.getElementById("product-name").value;
  const category = document.getElementById("product-category").value.toLowerCase();
  const price = document.getElementById("product-price").value;
  const image = document.getElementById("product-image").value;

  // Create product object
  const newProduct = {
    name,
    category,
    price,
    image
  };

  // Save in array
  products.push(newProduct);

  // Show in correct section
  displayProduct(newProduct);

  // Reset form
  document.getElementById("admin-add-product").reset();
}

function displayProduct(product) {
  const container = document.getElementById("all-products"); // default

  // If category is men/women, show there too
  if (product.category === "men") {
    document.getElementById("men-products").innerHTML += productCard(product);
  } else if (product.category === "women") {
    document.getElementById("women-products").innerHTML += productCard(product);
  }

  // Always add to All Products
  container.innerHTML += productCard(product);
}

function productCard(product) {
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
      <button onclick="viewProduct('${product.name}')">View</button>
      <button onclick="addToCart('${product.name}')">🛒</button>
    </div>
  `;
}
