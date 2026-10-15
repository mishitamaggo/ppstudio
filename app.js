/**
 * ====================================================================
 * ParcelPlay - Main JavaScript Application
 * ====================================================================
 * Modern, clean, and interactive front-end script for ParcelPlay.
 * 
 * Features:
 *  1. Header Scroll Effect & Sticky Header
 *  2. Mobile Navigation Toggle & Backdrop Management
 *  3. Full Shopping Cart System with LocalStorage Persistence:
 *     - addToCart, removeFromCart, updateCartQuantity, updateCartUI
 *     - Cart Drawer open/close & Overlay
 *     - Currency formatting in INR (₹)
 *  4. Toast Notification System
 *  5. Scroll-to-Top Button with Smooth Scrolling
 *  6. Scroll-Triggered Fade-In Animations (IntersectionObserver)
 *  7. Newsletter Form Handler with Validation
 *  8. Product Navigation & Dynamic Product Views
 *  9. Smooth Anchor Scrolling with Fixed Header Offset
 * ====================================================================
 */

'use strict';

// --------------------------------------------------------------------
// 0. Constants & State Management
// --------------------------------------------------------------------
const STORAGE_KEY = 'parcelplay_cart';
const HEADER_SCROLL_THRESHOLD = 50;
const SCROLL_TOP_THRESHOLD = 500;
const TOAST_DURATION = 3000;

// In-memory fallback if localStorage is restricted
let inMemoryCart = [];

// Timeout reference for Toast
let toastTimeout = null;

// --------------------------------------------------------------------
// 1. Helper Functions & Utilities
// --------------------------------------------------------------------

/**
 * Format numbers as Indian Rupee (INR) currency string
 * e.g., 2499 -> "₹2,499"
 * @param {number|string} amount 
 * @returns {string} Formatted INR currency string
 */
function formatCurrency(amount) {
  let num = 0;
  if (typeof amount === 'number') {
    num = amount;
  } else if (typeof amount === 'string') {
    num = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Safely retrieve cart items from localStorage
 * @returns {Array} Array of cart item objects
 */
function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('[ParcelPlay] LocalStorage inaccessible, using in-memory cart:', error);
    return inMemoryCart;
  }
}

/**
 * Safely save cart items to localStorage
 * @param {Array} cart 
 */
function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('[ParcelPlay] LocalStorage save failed:', error);
    inMemoryCart = cart;
  }
}

// --------------------------------------------------------------------
// 2. Toast Notification System
// --------------------------------------------------------------------

/**
 * Display a temporary toast notification to the user
 * @param {string} message - Message to display
 * @param {number} [duration=TOAST_DURATION] - Duration in ms
 */
function showToast(message, duration = TOAST_DURATION) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// --------------------------------------------------------------------
// 3. Cart System & Drawer Operations
// --------------------------------------------------------------------

/**
 * Open the Cart Drawer
 */
function openCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartDrawer) cartDrawer.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the Cart Drawer
 */
function closeCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartDrawer) cartDrawer.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Add an item to the shopping cart
 * @param {string} id - Product ID / Slug
 * @param {string} name - Product display name
 * @param {number|string} price - Unit price
 * @param {string} image - Product image URL
 * @param {number} [quantity=1] - Quantity to add
 */
function addToCart(id, name, price, image, quantity = 1) {
  if (!id) return;

  const cleanPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) || 0 : Number(price) || 0;
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + quantity;
  } else {
    cart.push({
      id: String(id),
      name: name || 'Custom Packaging',
      price: cleanPrice,
      image: image || 'images/products/gift-hampers/gift-hamper-1.png',
      quantity: Math.max(1, quantity)
    });
  }

  saveCart(cart);
  updateCartUI();
  showToast(`Added "${name || 'Item'}" to your cart!`);

  // Animate cart count badge
  const cartCountBadge = document.getElementById('cartCount');
  if (cartCountBadge) {
    cartCountBadge.classList.remove('pulse');
    void cartCountBadge.offsetWidth; // Trigger reflow
    cartCountBadge.classList.add('pulse');
  }
}

/**
 * Remove an item completely from the shopping cart
 * @param {string} id - Product ID
 */
function removeFromCart(id) {
  if (!id) return;

  let cart = getCart();
  const targetItem = cart.find(item => item.id === id);
  const itemName = targetItem ? targetItem.name : 'Item';

  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartUI();
  showToast(`Removed "${itemName}" from cart.`);
}

/**
 * Update the quantity of a specific item in the cart
 * @param {string} id - Product ID
 * @param {number} change - Delta (+1, -1, etc.)
 */
function updateCartQuantity(id, change) {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === id);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cart);
    updateCartUI();
  }
}

/**
 * Clear entire cart
 */
function clearCart() {
  saveCart([]);
  updateCartUI();
  showToast('Cart cleared.');
}

/**
 * Update and refresh all cart UI elements:
 * - Badges and counters
 * - Drawer items list
 * - Subtotal calculation
 * - Empty state toggle
 */
function updateCartUI() {
  const cart = getCart();

  const cartCountEl = document.getElementById('cartCount');
  const cartItemCountEl = document.getElementById('cartItemCount');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  // Compute total item count and subtotal
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  // Update navbar count & drawer title count
  if (cartCountEl) cartCountEl.textContent = totalCount;
  if (cartItemCountEl) cartItemCountEl.textContent = totalCount;

  // Update Subtotal display
  if (cartTotalEl) cartTotalEl.textContent = formatCurrency(subtotal);

  // Toggle empty state vs item list
  if (cartItemsEl && cartEmptyEl) {
    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
      cartItemsEl.innerHTML = '';
    } else {
      cartEmptyEl.style.display = 'none';
      cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${escapeHtml(item.id)}">
          <div class="cart-item-image">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <h4>${escapeHtml(item.name)}</h4>
            <div class="item-price">${formatCurrency(item.price)}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <button type="button" class="qty-btn" onclick="updateCartQuantity('${escapeHtml(item.id)}', -1)" aria-label="Decrease quantity" style="width: 24px; height: 24px; border: 1px solid var(--border); border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; background: white; cursor: pointer; color: var(--navy); line-height: 1;">−</button>
                <span style="font-size: 0.85rem; font-weight: 600; min-width: 16px; text-align: center; color: var(--navy);">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="updateCartQuantity('${escapeHtml(item.id)}', 1)" aria-label="Increase quantity" style="width: 24px; height: 24px; border: 1px solid var(--border); border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; background: white; cursor: pointer; color: var(--navy); line-height: 1;">+</button>
              </div>
              <button type="button" class="cart-item-remove" onclick="removeFromCart('${escapeHtml(item.id)}')" aria-label="Remove item">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

/**
 * Basic HTML escaping helper to prevent XSS
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --------------------------------------------------------------------
// 4. Product Navigation
// --------------------------------------------------------------------

/**
 * Navigate to single product detail view
 * @param {string} slug - Product identifier or slug
 */
function viewProduct(slug) {
  if (!slug) return;
  window.location.href = `product.html?id=${encodeURIComponent(slug)}`;
}

// --------------------------------------------------------------------
// 5. Newsletter Form Handler
// --------------------------------------------------------------------

/**
 * Handles newsletter subscription submission
 * @param {Event} event 
 */
function handleNewsletter(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const emailInput = document.getElementById('newsletterEmail');
  if (!emailInput) return;

  const email = emailInput.value.trim();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showToast('Please enter a valid email address.');
    emailInput.focus();
    return;
  }

  // Simulate subscription success
  showToast('✨ Thank you for subscribing to ParcelPlay!');
  emailInput.value = '';
}

// --------------------------------------------------------------------
// 6. Header Scroll & Mobile Navigation Setup
// --------------------------------------------------------------------

/**
 * Initialize Header scroll effect
 */
function initHeaderScroll() {
  const header = document.getElementById('header') || document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > HEADER_SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial check on load
  handleScroll();
}

/**
 * Initialize Mobile Navigation Toggle & Backdrop
 */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (!mobileToggle || !navLinks) return;

  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking on any nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside of nav on mobile
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  // Reset menu on resize past mobile breakpoint (768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
      closeMenu();
    }
  }, { passive: true });
}

// --------------------------------------------------------------------
// 7. Scroll To Top Button
// --------------------------------------------------------------------

/**
 * Initialize Scroll to Top button functionality
 */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  const handleScroll = () => {
    if (window.scrollY > SCROLL_TOP_THRESHOLD) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// --------------------------------------------------------------------
// 8. Intersection Observer for Scroll Animations
// --------------------------------------------------------------------

/**
 * Initialize Fade-in-up animations on viewport intersection
 */
function initScrollAnimations() {
  const animatableElements = document.querySelectorAll('.fade-in-up');

  if (!animatableElements.length) return;

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatableElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    animatableElements.forEach(el => el.classList.add('visible'));
  }
}

// --------------------------------------------------------------------
// 9. Smooth Scroll for Anchor Links
// --------------------------------------------------------------------

/**
 * Initialize smooth scrolling for internal in-page anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Calculate offset position accounting for sticky header
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        const navLinks = document.getElementById('navLinks');
        const mobileToggle = document.getElementById('mobileToggle');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          if (mobileToggle) mobileToggle.classList.remove('active');
        }
      }
    });
  });
}

// --------------------------------------------------------------------
// 10. Cart Event Listeners & Global Bindings
// --------------------------------------------------------------------

/**
 * Bind cart drawer opening/closing events
 */
function initCartEvents() {
  const cartBtn = document.getElementById('cartBtn');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Close cart drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const cartDrawer = document.getElementById('cartDrawer');
      if (cartDrawer && cartDrawer.classList.contains('open')) {
        closeCart();
      }
    }
  });
}

// --------------------------------------------------------------------
// 11. Global Function Exports (for inline onclick/onsubmit HTML handlers)
// --------------------------------------------------------------------
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.updateCartUI = updateCartUI;
window.openCart = openCart;
window.closeCart = closeCart;
window.showToast = showToast;
window.viewProduct = viewProduct;
window.handleNewsletter = handleNewsletter;
window.formatCurrency = formatCurrency;

// --------------------------------------------------------------------
// 12. Application Lifecycle / Initialization
// --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initCartEvents();
  initScrollToTop();
  initScrollAnimations();
  initSmoothScroll();
  updateCartUI(); // Initial cart render from localStorage
});
