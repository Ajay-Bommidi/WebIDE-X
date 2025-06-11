export const defaultCode = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iPhone 16 with Swiggy App</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
</head>
<body>
    <div class="iphone">
        <div class="iphone-notch">
            <div class="dynamic-island"></div>
        </div>
        <div class="iphone-screen">
            <div class="swiggy-app">
                <div class="header">
                    <div class="location">
                        <h1>Whitefield, Bangalore</h1>
                        <span>123, Prestige Avenue, Karnataka</span>
                    </div>
                    <div class="profile"></div>
                </div>
                <div class="search-bar">
                    <input type="text" placeholder="Search restaurants, dishes..." oninput="filterRestaurants(this)">
                </div>
                <div class="banner">
                    Flat 20% OFF on your first order! Use code SWIGGY20
                </div>
                <div class="categories">
                    <div class="category-chip active" data-category="Food">Food</div>
                    <div class="category-chip" data-category="Instamart">Instamart</div>
                    <div class="category-chip" data-category="Dineout">Dineout</div>
                    <div class="category-chip" data-category="Genie">Genie</div>
                </div>
                <div class="restaurant-list" id="restaurant-list">
                    <div class="restaurant-card" data-category="Food" onclick="addToCart('Meghana Foods', 'Biryani')">
                        <div class="image"></div>
                        <div class="info">
                            <h3>Meghana Foods</h3>
                            <div class="rating">
                                <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                4.3
                            </div>
                            <div class="details">Biryani, North Indian • 30 mins • ₹₹</div>
                            <div class="offer">20% OFF up to ₹100</div>
                        </div>
                    </div>
                    <div class="restaurant-card" data-category="Food" onclick="addToCart('Pizza Hut', 'Margherita Pizza')">
                        <div class="image"></div>
                        <div class="info">
                            <h3>Pizza Hut</h3>
                            <div class="rating">
                                <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                4.1
                            </div>
                            <div class="details">Pizza, Fast Food • 35 mins • ₹₹₹</div>
                            <div class="offer">Free delivery on orders above ₹200</div>
                        </div>
                    </div>
                    <div class="restaurant-card" data-category="Food" onclick="addToCart('La Pino\\'z Pizza', 'Farmhouse Pizza')">
                        <div class="image"></div>
                        <div class="info">
                            <h3>La Pino'z Pizza</h3>
                            <div class="rating">
                                <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                4.2
                            </div>
                            <div class="details">Pizza, Italian • 28 mins • ₹₹</div>
                            <div class="offer">Buy 1 Get 1 Free</div>
                        </div>
                    </div>
                    <div class="restaurant-card" data-category="Instamart" onclick="addToCart('Swiggy Instamart', 'Grocery Pack')">
                        <div class="image"></div>
                        <div class="info">
                            <h3>Swiggy Instamart</h3>
                            <div class="rating">
                                <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                4.5
                            </div>
                            <div class="details">Groceries, Essentials • 15 mins • ₹</div>
                            <div class="offer">10% OFF on first grocery order</div>
                        </div>
                    </div>
                </div>
                <div class="bottom-nav">
                    <div class="nav-item active" data-nav="home">
                        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>
                        Home
                    </div>
                    <div class="nav-item" data-nav="search">
                        <svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        Search
                    </div>
                    <div class="nav-item" data-nav="cart" onclick="toggleCartModal()">
                        <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0021.25 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                        <span class="cart-count" id="cart-count">0</span>
                        Cart
                    </div>
                    <div class="nav-item" data-nav="account">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        Account
                    </div>
                </div>
                <div class="cart-modal" id="cart-modal">
                    <h3>Cart</h3>
                    <div id="cart-items"></div>
                    <div class="total" id="cart-total">Total: ₹0</div>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    css: `body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(180deg, #E5E5E5, #F5F5F5);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow-x: hidden;
}
.iphone {
    width: 320px;
    height: 694px;
    background: linear-gradient(145deg, #1C2526, #2E3A3B);
    border-radius: 44px;
    padding: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 2px rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
}
.iphone-notch {
    width: 120px;
    height: 30px;
    background: #000;
    border-radius: 0 0 15px 15px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
}
.dynamic-island {
    width: 90px;
    height: 20px;
    background: #1A1A1A;
    border-radius: 10px;
}
.iphone-screen {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 36px;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.iphone-screen::-webkit-scrollbar {
    display: none;
}
.swiggy-app {
    padding: 10px;
    background: #FFFFFF;
    min-height: 100%;
}
.header {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #E6E6E6;
    position: sticky;
    top: 0;
    background: #FFFFFF;
    z-index: 5;
    transition: all 0.3s ease;
}
.header .location {
    flex-grow: 1;
}
.header .location h1 {
    font-size: 16px;
    font-weight: 700;
    color: #2C2F3A;
    margin: 0;
}
.header .location span {
    font-size: 12px;
    color: #686B78;
}
.header .profile {
    width: 32px;
    height: 32px;
    background: #E6E6E6;
    border-radius: 50%;
    transition: transform 0.2s;
}
.header .profile:hover {
    transform: scale(1.1);
}
.search-bar {
    margin: 10px 15px;
    padding: 10px;
    background: #F5F5F5;
    border-radius: 10px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.search-bar input {
    border: none;
    background: none;
    width: 100%;
    font-size: 14px;
    color: #2C2F3A;
    outline: none;
}
.search-bar input::placeholder {
    color: #A0A0A0;
}
.banner {
    margin: 10px 15px;
    height: 120px;
    background: linear-gradient(90deg, #FC8019, #FF9F00);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    animation: fadeIn 1s ease-in;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.categories {
    display: flex;
    overflow-x: auto;
    padding: 10px 15px;
    gap: 10px;
    white-space: nowrap;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.categories::-webkit-scrollbar {
    display: none;
}
.category-chip {
    padding: 8px 16px;
    background: #F5F5F5;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: #2C2F3A;
    cursor: pointer;
    transition: all 0.3s ease;
}
.category-chip.active {
    background: #FC8019;
    color: #FFFFFF;
    transform: scale(1.05);
}
.category-chip:hover {
    background: #FFE8D6;
}
.restaurant-list {
    padding: 10px 15px;
}
.restaurant-card {
    display: flex;
    gap: 12px;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 10px;
    background: #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: slideIn 0.5s ease;
}
.restaurant-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
@keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}
.restaurant-card .image {
    width: 100px;
    height: 80px;
    background: #E6E6E6; /* Replace with: background-image: url('restaurant.jpg') */
    border-radius: 8px;
    flex-shrink: 0;
}
.restaurant-card .info {
    flex-grow: 1;
}
.restaurant-card .info h3 {
    font-size: 14px;
    font-weight: 700;
    color: #2C2F3A;
    margin: 0 0 4px;
}
.restaurant-card .info .rating {
    display: inline-flex;
    align-items: center;
    background: #48C479;
    color: #FFFFFF;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 4px;
}
.restaurant-card .info .rating svg {
    width: 12px;
    height: 12px;
    fill: #FFFFFF;
    margin-right: 4px;
}
.restaurant-card .info .details {
    font-size: 12px;
    color: #686B78;
    margin-bottom: 4px;
}
.restaurant-card .info .offer {
    font-size: 11px;
    color: #FC8019;
    font-weight: 500;
}
.bottom-nav {
    position: sticky;
    bottom: 0;
    background: #FFFFFF;
    border-top: 1px solid #E6E6E6;
    display: flex;
    justify-content: space-around;
    padding: 12px 0;
    z-index: 5;
}
.nav-item {
    text-align: center;
    font-size: 12px;
    color: #686B78;
    cursor: pointer;
    transition: color 0.3s;
    position: relative;
}
.nav-item.active {
    color: #FC8019;
    font-weight: 700;
}
.nav-item svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
    margin-bottom: 4px;
}
.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #FC8019;
    color: #FFFFFF;
    font-size: 10px;
    padding: 3px 6px;
    border-radius: 12px;
}
.cart-modal {
    display: none;
    position: fixed;
    bottom: 60px;
    left: 15px;
    right: 15px;
    background: #FFFFFF;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}
.cart-modal.active {
    display: block;
}
@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.cart-modal h3 {
    font-size: 14px;
    margin: 0 0 10px;
    color: #2C2F3A;
}
.cart-item {
    font-size: 12px;
    color: #686B78;
    margin-bottom: 5px;
}
.cart-modal .total {
    font-size: 12px;
    font-weight: 700;
    color: #FC8019;
    margin-top: 10px;
}
@media (max-width: 400px) {
    .iphone {
        width: 280px;
        height: 607px;
    }
    .header .location h1 {
        font-size: 14px;
    }
    .header .location span {
        font-size: 11px;
    }
    .search-bar input {
        font-size: 12px;
    }
    .banner {
        font-size: 14px;
        height: 100px;
    }
    .category-chip {
        font-size: 11px;
        padding: 6px 12px;
    }
    .restaurant-card .info h3 {
        font-size: 12px;
    }
    .restaurant-card .info .rating,
    .restaurant-card .info .details,
    .restaurant-card .info .offer {
        font-size: 11px;
    }
    .restaurant-card .image {
        width: 80px;
        height: 60px;
    }
}`,
    js: `let cartCount = 0;
let cartItems = [];
let debounceTimeout;

function addToCart(restaurant, item) {
    cartCount++;
    cartItems.push({ restaurant, item, price: Math.floor(Math.random() * 200) + 100 });
    document.getElementById('cart-count').textContent = cartCount;
    updateCartModal();
    alert(\`Added \${item} from \${restaurant} to cart!\`);
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
        div.textContent = \`\${item.item} (\${item.restaurant}) - ₹\${item.price}\`;
        cartItemsDiv.appendChild(div);
    });
    cartTotalDiv.textContent = \`Total: ₹\${total}\`;
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
});`
};

export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: "folder" | "html" | "css" | "js";
  content?: string;
  children?: FileTreeNode[];
  icon?: string;
  isDirty?: boolean;
  isOpen?: boolean;
}

export type FileType = "html" | "css" | "js";

// Helper to get file content by type from defaultCode
export const getFileContent = (type: FileType): string => {
  return defaultCode[type];
};

export const initialFileStructure: FileTreeNode[] = [
  {
    id: "root",
    name: "src",
    type: "folder",
    path: "src",
    isOpen: true,
    children: [
      {
        id: "html",
        name: "index.html",
        type: "html",
        path: "src/index.html",
        content: defaultCode.html,
        isDirty: false,
      },
      {
        id: "css",
        name: "style.css",
        type: "css",
        path: "src/style.css",
        content: defaultCode.css,
        isDirty: false,
      },
      {
        id: "js",
        name: "script.js",
        type: "js",
        path: "src/script.js",
        content: defaultCode.js,
        isDirty: false,
      },
    ],
  },
];