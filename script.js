// Product data
const products = [
    {
        id: 1,
        name: 'Basmati Rice (1kg)',
        price: 159,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
        category: 'Groceries'
    },
    {
        id: 2,
        name: 'Tata Tea Premium (500g)',
        price: 275,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
        category: 'Beverages'
    },
    {
        id: 3,
        name: 'Aashirvaad Atta (5kg)',
        price: 315,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
        category: 'Groceries'
    },
    {
        id: 4,
        name: 'Fresh Onions (1kg)',
        price: 45,
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb',
        category: 'Vegetables'
    },
    {
        id: 5,
        name: 'Amul Butter (500g)',
        price: 275,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
        category: 'Dairy'
    },
    {
        id: 6,
        name: 'MTR Masala (100g)',
        price: 85,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d',
        category: 'Spices'
    },
    {
        id: 7,
        name: 'Fresh Tomatoes (1kg)',
        price: 60,
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
        category: 'Vegetables'
    },
    {
        id: 8,
        name: 'Maggi Noodles (Pack of 5)',
        price: 115,
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841',
        category: 'Ready to Cook'
    },
    {
        id: 9,
        name: 'Mother Dairy Milk (1L)',
        price: 68,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
        category: 'Dairy'
    },
    {
        id: 10,
        name: 'Fresh Green Chilies (250g)',
        price: 40,
        image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3',
        category: 'Vegetables'
    },
    {
        id: 11,
        name: 'Fresh Apples (1kg)',
        price: 180,
        image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
        category: 'Fruits'
    },
    {
        id: 12,
        name: 'Farm Fresh Eggs (12 pcs)',
        price: 95,
        image: 'https://images.unsplash.com/photo-1489726933853-010eb1484d1a',
        category: 'Dairy'
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

// Render products with optimized images and lazy loading
function renderProducts(productsToRender) {
    productList.innerHTML = productsToRender.map(product => `
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
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
    }
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Update cart with optimized images
function updateCart() {
    cartCount.textContent = cart.length;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${getOptimizedImageUrl(item.image)}" 
                    alt="${item.name}" 
                    loading="lazy"
                    onload="this.setAttribute('loaded', '')">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">❌</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = total.toFixed(2);
    }
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
    
    const itemsList = cart.map(item => `${item.name} - ₹${item.price.toFixed(2)}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
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