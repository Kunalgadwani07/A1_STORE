const products = [
    {
        id: 1,
        name: 'Sindhi Koki',
        price: 20,
        image: 'https://thumbs.dreamstime.com/b/indian-breakfast-koki-flatbread-raita-yogurt-dip-fried-onion-cool-travel-summer-lunch-dinner-brekkie-steel-plate-south-sindhi-125773554.jpg?w=768',
        category: 'Breakfast',
        inventory: 30
    },
    {
        id: 2,
        name: 'Dosa',
        price: 100,
        image: 'https://static.toiimg.com/thumb/63841432.cms?width=573&height=430',
        category: 'South Indian',
        inventory: 30
    },
    {
        id: 3,
        name: 'Upma',
        price: 60,
        image: 'https://media.istockphoto.com/id/1488737992/photo/upma-recipe-suji-ka-upma-rava-upma-with-red-and-coconut-chutney.jpg?s=612x612&w=0&k=20&c=dGTIRLT4c7XdC8xAqkumyuURqMAy3HNQccNjEQT3wmU=',
        category: 'Breakfast',
        inventory: 30
    },
    {
        id: 4,
        name: 'Samosa',
        price: 30,
        image: 'https://static.toiimg.com/thumb/61050397.cms?width=573&height=430',
        category: 'Snacks',
        inventory: 50
    },
    {
        id: 5,
        name: 'Bhel',
        price: 30,
        image: 'https://static.vecteezy.com/system/resources/thumbnails/053/315/217/small_2x/delicious-bhel-puri-indian-street-food-closeup-photo.jpeg',
        category: 'Chaat',
        inventory: 30
    },
    {
        id: 6,
        name: 'Kachori',
        price: 30,
        image: 'https://recipes.timesofindia.com/thumb/53314156.cms?width=1200&height=900',
        category: 'Snacks',
        inventory: 30
    },
    {
        id: 7,
        name: 'Sindhi Dal Pakwaan',
        price: 60,
        image: 'https://www.shutterstock.com/image-photo/dal-pakwan-authentic-sindhi-breakfast-600nw-1624385410.jpg',
        category: 'Breakfast',
        inventory: 30
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
                <p class="product-category">${product.category}</p>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="inventory-status ${isOutOfStock ? 'out-of-stock' : ''}">${isOutOfStock ? 'Out of Stock' : `${currentInventory} in stock`}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})" ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `}).join('');
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

searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}, 300));

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    checkoutButton.style.display = 'none';
    checkoutForm.classList.remove('hidden');
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
    const groupedItems = groupCartItems();
    const itemsList = groupedItems.map(item =>
        `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    const total = groupedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `New Order:\n\nCustomer Details:\nName: ${userName}\nPhone: ${userPhone}\nAddress: ${userAddress}\n\nOrder Items:\n${itemsList}\n\nTotal: ₹${total.toFixed(2)}`;
    window.open(`https://wa.me/918766849418?text=${encodeURIComponent(message)}`, '_blank');
    document.getElementById('userName').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userAddress').value = '';
    cart = [];
    updateCart();
    checkoutForm.classList.add('hidden');
    checkoutButton.style.display = 'block';
});

renderProducts(products);