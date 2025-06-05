const products = [
    {
        id: 1,
        name: "Multani mitti powder(100 gms)",
        price: 15,
        category: "groceries",
        inventory: 10,
        image: "https://t4.ftcdn.net/jpg/01/88/94/37/240_F_188943710_kMaJs701T7fBR8ZG1H3dyLqydNhSFW3q.jpg"
    }
];

let cart = [];

const productList = document.getElementById('productList');
const cartButton = document.getElementById('cartButton');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderButton = document.getElementById('placeOrderButton');
const backToCartButton = document.getElementById('backToCartButton');
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.querySelectorAll('.category-tab');
let currentCategory = 'all';

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        filterProducts();
    });
});

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        return matchesSearch && matchesCategory;
    });
    renderProducts(filteredProducts);
}

function getOptimizedImageUrl(url) {
    return url.includes('unsplash.com') ? `${url}?auto=format,compress&q=80&w=400` : url;
}

function getCurrentInventory(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    const inCart = cart.filter(item => item.id === productId).length;
    return product.inventory - inCart;
}

function renderProducts(productsToRender) {
    productList.innerHTML = productsToRender.map(product => {
        const currentInventory = getCurrentInventory(product.id);
        const isOutOfStock = currentInventory <= 0;
        return `
        <div class="product-card">
            <img src="${getOptimizedImageUrl(product.image)}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="inventory-status ${isOutOfStock ? 'out-of-stock' : ''}">${isOutOfStock ? 'Out of Stock' : `${currentInventory} in stock`}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})" ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `}).join('');
}

function showPopup(message) {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);

    // Trigger reflow and add show class
    setTimeout(() => popup.classList.add('show'), 10);

    // Remove popup after 2 seconds
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 2000);
}

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
        renderProducts(products);
        showPopup(`${product.name} added to cart!`);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

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

function updateCart() {
    cartCount.textContent = cart.length;
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        const groupedItems = groupCartItems();
        cartItems.innerHTML = groupedItems.map((item) => `
            <div class="cart-item">
                <img src="${getOptimizedImageUrl(item.image)}" alt="${item.name}" loading="lazy">
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
    renderProducts(products);
}

function updateItemQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (change > 0) {
        const currentInventory = getCurrentInventory(productId);
        if (currentInventory <= 0) {
            alert('Sorry, this item is out of stock!');
            return;
        }
        cart.push(product);
    } else {
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) cart.splice(index, 1);
    }
    updateCart();
}

function removeAllOfItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

cartButton.style.display = 'none';

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

searchInput.addEventListener('input', debounce(() => {
    filterProducts();
}, 300));

function saveCustomerData(data) {
    localStorage.setItem('customerData', JSON.stringify(data));
}

function getCustomerData() {
    const data = localStorage.getItem('customerData');
    return data ? JSON.parse(data) : null;
}

function fillCheckoutForm() {
    const customerData = getCustomerData();
    if (customerData) {
        document.getElementById('userName').value = customerData.name || '';
        document.getElementById('userPhone').value = customerData.phone || '';
        document.getElementById('userAddress').value = customerData.address || '';
    }
}

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    checkoutButton.style.display = 'none';
    checkoutForm.classList.remove('hidden');
    fillCheckoutForm(); // Auto-fill the form with stored data
});

backToCartButton.addEventListener('click', () => {
    checkoutForm.classList.add('hidden');
    checkoutButton.style.display = 'block';
});

placeOrderButton.addEventListener('click', () => {
    if (cart.length === 0) return;
    const userName = document.getElementById('userName').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    const userAddress = document.getElementById('userAddress').value.trim();
    
    if (!userName || !userPhone || !userAddress) {
        alert('Please fill in all your details before checkout');
        return;
    }

    // Save customer data
    saveCustomerData({
        name: userName,
        phone: userPhone,
        address: userAddress
    });

    const groupedItems = groupCartItems();
    const itemsList = groupedItems.map(item =>
        `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    const total = groupedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `New Order:\n\nCustomer Details:\nName: ${userName}\nPhone: ${userPhone}\nAddress: ${userAddress}\n\nOrder Items:\n${itemsList}\n\nTotal: ₹${total.toFixed(2)}`;
    window.open(`https://wa.me/918766849418?text=${encodeURIComponent(message)}`, '_blank');
    
    cart = [];
    updateCart();
    checkoutForm.classList.add('hidden');
    checkoutButton.style.display = 'block';
});

renderProducts(products);