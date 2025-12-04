// main.js - Common functionality for all pages

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functionality
    
    // Update cart count from localStorage
    updateCartCount();
    
    // Add to cart buttons
    setupAddToCartButtons();
    
    // Wishlist buttons
    setupWishlistButtons();
    
    // Search functionality
    setupSearch();
    
    // Newsletter form
    setupNewsletter();
    
    // Active navigation link
    setActiveNavLink();
});

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        // Get cart count from localStorage or default to 0
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        
        cartCount.textContent = count;
        if (count === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'flex';
        }
    }
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-add-to-cart')) {
            e.preventDefault();
            const button = e.target.closest('.btn-add-to-cart');
            const productCard = button.closest('.product-card');
            
            if (productCard) {
                const productName = productCard.querySelector('.product-name').textContent;
                const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('QR ', ''));
                
                // Get current cart
                let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                
                // Check if product already in cart
                const existingItem = cartItems.find(item => item.name === productName);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }
                
                // Save to localStorage
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                
                // Update cart count
                updateCartCount();
                
                // Show notification
                showNotification(`${productName} added to cart!`);
                
                // Button feedback
                button.innerHTML = '<i class="fas fa-check"></i> Added';
                button.style.backgroundColor = 'var(--success)';
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                    button.style.backgroundColor = '';
                }, 2000);
            }
        }
    });
}

// Setup wishlist buttons
function setupWishlistButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-wishlist')) {
            e.preventDefault();
            const button = e.target.closest('.btn-wishlist');
            const icon = button.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Add to wishlist
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.classList.add('active');
                showNotification('Added to wishlist!');
            } else {
                // Remove from wishlist
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.classList.remove('active');
                showNotification('Removed from wishlist!');
            }
        }
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query) {
                    showNotification(`Searching for "${query}"...`);
                    // In a real app, you would redirect to search results page
                    // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// Setup newsletter form
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                // Save to localStorage
                let newsletters = JSON.parse(localStorage.getItem('newsletters') || '[]');
                if (!newsletters.includes(email)) {
                    newsletters.push(email);
                    localStorage.setItem('newsletters', JSON.stringify(newsletters));
                }
                
                showNotification(`Thank you for subscribing with ${email}!`);
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'error' ? 'var(--danger)' : 'var(--success)'};
        color: white;
        padding: 15px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Add CSS for animations if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Validate email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Load products for home page
function loadHomeProducts() {
    const productsGrid = document.querySelector('#home-page .products-grid');
    if (productsGrid) {
        const featuredProducts = [
            {
                name: "Fresh Red Apples",
                category: "Groceries",
                price: 25.99,
                originalPrice: 29.99,
                badge: "sale",
                icon: "fa-apple-alt",
                description: "Premium quality, imported from USA"
            },
            {
                name: "Smartphone XYZ",
                category: "Electronics",
                price: 2499.99,
                originalPrice: 3199.99,
                badge: "sale",
                icon: "fa-mobile-alt",
                description: "Latest model with advanced features"
            },
            {
                name: "Extra Virgin Olive Oil",
                category: "Groceries",
                price: 49.99,
                icon: "fa-wine-bottle",
                description: "1L bottle, imported from Italy"
            },
            {
                name: "Men's Cotton T-Shirt",
                category: "Fashion",
                price: 79.99,
                icon: "fa-tshirt",
                description: "Premium cotton, multiple colors"
            },
            {
                name: "Premium Blender",
                category: "Home & Garden",
                price: 349.99,
                originalPrice: 399.99,
                badge: "limited",
                icon: "fa-blender",
                description: "High-speed with multiple functions"
            }
        ];
        
        // Generate product cards
        productsGrid.innerHTML = '';
        featuredProducts.forEach(product => {
            const productCard = document.createElement('a');
            productCard.className = 'product-card';
            productCard.href = '#';
            
            let badgeHTML = '';
            if (product.badge) {
                const badgeText = product.badge === 'sale' ? 'Sale' : 'Limited';
                badgeHTML = `<div class="product-badge ${product.badge}">${badgeText}</div>`;
            }
            
            let originalPriceHTML = '';
            if (product.originalPrice) {
                originalPriceHTML = `<span class="original-price">QR ${product.originalPrice.toFixed(2)}</span>`;
            }
            
            productCard.innerHTML = `
                ${badgeHTML}
                <div class="product-img">
                    <i class="fas ${product.icon}"></i>
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">QR ${product.price.toFixed(2)}</span>
                        ${originalPriceHTML}
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-to-cart">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                        <button class="btn-wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
    }
}

// Load categories for home page
function loadHomeCategories() {
    const categoriesGrid = document.querySelector('#home-page .categories-grid');
    if (categoriesGrid) {
        const categories = [
            { name: "Groceries", icon: "fa-carrot", count: "240+ items", page: "groceries.html", color: "#E8F5E9" },
            { name: "Electronics", icon: "fa-laptop", count: "150+ items", page: "electronics.html", color: "#E3F2FD" },
            { name: "Home & Garden", icon: "fa-couch", count: "180+ items", page: "home-garden.html", color: "#FFF3E0" },
            { name: "Fashion", icon: "fa-tshirt", count: "320+ items", page: "fashion.html", color: "#FCE4EC" },
            { name: "Pharmacy", icon: "fa-pills", count: "95+ items", page: "pharmacy.html", color: "#E8EAF6" },
            { name: "Baby Products", icon: "fa-baby", count: "120+ items", page: "baby.html", color: "#E0F7FA" }
        ];
        
        // Generate category cards
        categoriesGrid.innerHTML = '';
        categories.forEach(category => {
            const categoryCard = document.createElement('a');
            categoryCard.className = 'category-card';
            categoryCard.href = category.page;
            
            categoryCard.innerHTML = `
                <div class="category-img" style="background-color: ${category.color};">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="category-content">
                    <h3 class="category-name">${category.name}</h3>
                    <p class="category-count">${category.count}</p>
                </div>
            `;
            
            categoriesGrid.appendChild(categoryCard);
        });
    }
}

// Call these functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadHomeProducts();
    loadHomeCategories();
});