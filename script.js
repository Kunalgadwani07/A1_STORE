// Product data
const products = [
    {
        id: 1,
        name: 'Basmati Rice (1kg)',
        price: 159,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
        category: 'Groceries',
        inventory: 50
    },
    {
        id: 2,
        name: 'Tata Tea Premium (500g)',
        price: 100,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
        category: 'Beverages',
        inventory: 30
    },
    {
        id: 3,
        name: 'Aashirvaad Atta (5kg)',
        price: 315,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
        category: 'Groceries',
        inventory: 25
    },
    {
        id: 4,
        name: 'Fresh Onions (1kg)',
        price: 45,
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb',
        category: 'Vegetables',
        inventory: 100
    },
    {
        id: 5,
        name: 'Amul Butter (500g)',
        price: 275,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
        category: 'Dairy',
        inventory: 40
    },
    {
        id: 6,
        name: 'MTR Masala (100g)',
        price: 85,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d',
        category: 'Spices',
        inventory: 60
    },
    {
        id: 7,
        name: 'Fresh Tomatoes (1kg)',
        price: 60,
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
        category: 'Vegetables',
        inventory: 80
    },
    {
        id: 8,
        name: 'Maggi Noodles (Pack of 5)',
        price: 115,
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841',
        category: 'Ready to Cook',
        inventory: 45
    },
    {
        id: 9,
        name: 'Mother Dairy Milk (1L)',
        price: 68,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
        category: 'Dairy',
        inventory: 70
    },
    {
        id: 10,
        name: 'Fresh Green Chilies (250g)',
        price: 40,
        image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3',
        category: 'Vegetables',
        inventory: 90
    },
    {
        id: 11,
        name: 'Fresh Apples (1kg)',
        price: 180,
        image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
        category: 'Fruits',
        inventory: 35
    },
    {
        id: 12,
        name: 'Farm Fresh Eggs (12 pcs)',
        price: 95,
        image: 'https://images.unsplash.com/photo-1489726933853-010eb1484d1a',
        category: 'Dairy',
        inventory: 55
    }
];

// Cart state
let cart = [];

// DOM elements
const productList = document.getElementById('productList');
const cartButton = document.getElementById('cartButton');
const cartSidebar = document.getElementById('cart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderButton = document.getElementById('placeOrderButton');
const backToCartButton = document.getElementById('backToCartButton');
const searchInput = document.getElementById('searchInput');

// Optimize image URLs for better performance
function getOptimizedImageUrl(url) {
    // Add Unsplash parameters for optimized size and quality
    return `${url}?auto=format,compress&q=80&w=400`;
}

// Helper function to get current inventory
function getCurrentInventory(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    
    // Count items in cart
    const inCart = cart.filter(item => item.id === productId).length;
    return product.inventory - inCart;
}

// Render products with optimized images and lazy loading
function renderProducts(productsToRender) {
    productList.innerHTML = productsToRender.map(product => {
        const currentInventory = getCurrentInventory(product.id);
        const isOutOfStock = currentInventory <= 0;
        
        return `
        <div class="product-card">
            <img src="${getOptimizedImageUrl(product.image)}" 
                alt="${product.name}" 
                class="product-image" 
                loading="lazy"
                onload="this.setAttribute('loaded', '')">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="inventory-status ${isOutOfStock ? 'out-of-stock' : ''}">${
                    isOutOfStock ? 'Out of Stock' : `${currentInventory} in stock`
                }</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})"
                    ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `}).join('');
}

// Add to cart
function addToCart(productId) {
    const currentInventory = getCurrentInventory(productId);
    if (currentInventory <= 0) {
        alert('Sorry, this item is out of stock!');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
        // Re-render products to update inventory display
        renderProducts(products);
    }
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Helper function to group cart items
function groupCartItems() {
    return cart.reduce((acc, item) => {
        const existingItem = acc.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            acc.push({ ...item, quantity: 1 });
        }
        return acc;
    }, []);
}

// Update cart with optimized images
function updateCart() {
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        const groupedItems = groupCartItems();
        cartItems.innerHTML = groupedItems.map((item) => `
            <div class="cart-item">
                <img src="${getOptimizedImageUrl(item.image)}" 
                    alt="${item.name}" 
                    loading="lazy"
                    onload="this.setAttribute('loaded', '')">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateItemQuantity(${item.id}, -1)">-</button>
                        <span>x${item.quantity}</span>
                        <button onclick="updateItemQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeAllOfItem(${item.id})">❌</button>
            </div>
        `).join('');
        
        const total = groupedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
    
    // Update product display to reflect new inventory counts
    renderProducts(products);
}

// Function to update item quantity
function updateItemQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (change > 0) {
        // Check inventory before adding
        const currentInventory = getCurrentInventory(productId);
        if (currentInventory <= 0) {
            alert('Sorry, this item is out of stock!');
            return;
        }
        cart.push(product);
    } else {
        // Remove one instance of the item
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            cart.splice(index, 1);
        }
    }
    updateCart();
}

// Function to remove all instances of an item
function removeAllOfItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Remove cart button click handler since cart is always visible
cartButton.style.display = 'none';

// Debounce search for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize search with debouncing
searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}, 300));

// Show checkout form
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    checkoutButton.style.display = 'none';
    checkoutForm.classList.remove('hidden');
});

// Back to cart
backToCartButton.addEventListener('click', () => {
    checkoutForm.classList.add('hidden');
    checkoutButton.style.display = 'block';
});

// Handle order placement
placeOrderButton.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    const userName = document.getElementById('userName').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    const userAddress = document.getElementById('userAddress').value.trim();
    
    // Validate user details
    if (!userName || !userPhone || !userAddress) {
        alert('Please fill in all your details before checkout');
        return;
    }
    
    const groupedItems = groupCartItems();
    const itemsList = groupedItems.map(item => 
        `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = groupedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `New Order:\n\nCustomer Details:\nName: ${userName}\nPhone: ${userPhone}\nAddress: ${userAddress}\n\nOrder Items:\n${itemsList}\n\nTotal: ₹${total.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/918766849418?text=${encodedMessage}`, '_blank');
    
    // Reset form and cart
    document.getElementById('userName').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userAddress').value = '';
    cart = [];
    updateCart();
    
    // Reset checkout form visibility
    checkoutForm.classList.add('hidden');
    checkoutButton.style.display = 'block';
});

// Initial render
renderProducts(products);