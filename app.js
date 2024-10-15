let currentPage = 0;
const productsPerPage = 20;
let products = [];
let allCategories = new Set();

async function fetchProducts() {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    products = data.products;
    renderProducts();
    renderCategories();
}

function renderProducts() {
    const container = document.querySelector('#productsContainer');
    container.innerHTML = '';

    const filteredProducts = getFilteredProducts();
    const productsToShow = filteredProducts.slice(0, (currentPage + 1) * productsPerPage);

    productsToShow.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.thumbnail}"">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
        `;
        productDiv.onclick = () => loadProductDetailPage(product.id);
        container.appendChild(productDiv);
    });

    const seeMoreBtn = document.querySelector('#seeMoreBtn');
    if (productsToShow.length < filteredProducts.length) {
        seeMoreBtn.style.display = 'block';
    } else {
        seeMoreBtn.style.display = 'none';
    }
}

function renderCategories() {
    const categoryFilter = document.querySelector('#categoryFilter');
    products.forEach(product => allCategories.add(product.category));

    allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function getFilteredProducts() {
    const selectedCategory = document.querySelector('#categoryFilter').value;
    if (selectedCategory === '') {
        return products;
    } else {
        return products.filter(product => product.category === selectedCategory);
    }
}

document.querySelector('#seeMoreBtn').onclick = () => {
    currentPage++;
    renderProducts();
};

document.querySelector('#categoryFilter').onchange = () => {
    currentPage = 0;
    renderProducts();
};

async function loadProductDetailPage(productId) {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const productDetail = await response.json();

    const detailDiv = document.querySelector('#productDetail');
    detailDiv.innerHTML = `
        <h2>${productDetail.title}</h2>
        <img src="${productDetail.images[0]}" alt="${productDetail.title}">
        <p>Price: $${productDetail.price}</p>
        <p>Category: ${productDetail.category}</p>
        <p>Description: ${productDetail.description}</p>
        <h3>Reviews</h3>
    `;
    
    const dummyReviews = [
        { user: "Alice", comment: "Great product!" },
        { user: "Bob", comment: "Value for money." },
        { user: "Charlie", comment: "Not bad." }
    ];

    dummyReviews.forEach(review => {
        detailDiv.innerHTML += `
            <div class="review">
                <strong>${review.user}:</strong> ${review.comment}
            </div>
        `;
    });

    detailDiv.style.display = 'block'; 
    window.scrollTo(0, document.body.scrollHeight); 
}

fetchProducts(); 