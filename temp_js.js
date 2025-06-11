let cartCount = 0;
let cartItems = [];
let debounceTimeout;

function addToCart(restaurant, item) {
    cartCount++;
    cartItems.push({ restaurant, item, price: Math.floor(Math.random() * 200) + 100 });
    document.getElementById('cart-count').textContent = cartCount;
    updateCartModal();
    alert(`Added ${item} from ${restaurant} to cart!`);
}

function updateCartModal() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cartItems.forEach(item => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.textContent = `${item.item} (${item.restaurant}) - ₹${item.price}`;
        cartItemsDiv.appendChild(div);
    });
    cartTotalDiv.textContent = `Total: ₹${total}`;
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('active');
}

function filterRestaurants(input) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const query = input.value.toLowerCase();
        const cards = document.querySelectorAll('.restaurant-card');
        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const details = card.querySelector('.details').textContent.toLowerCase();
            const category = card.dataset.category.toLowerCase();
            const activeCategory = document.querySelector('.category-chip.active').dataset.category.toLowerCase();
            if ((name.includes(query) || details.includes(query)) && category === activeCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }, 300);
}

document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const query = document.querySelector('.search-bar input').value;
        filterRestaurants({ value: query });
    });
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (item.dataset.nav !== 'cart') {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            document.getElementById('cart-modal').classList.remove('active');
        }
    });
}); 