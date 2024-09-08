
function loadCategories() {
    fetch('https://localhost:7198/api/Shoping/categories')
        .then(response => response.json())
        .then(categories => {
            const categoryList = document.getElementById('category-list');
            categoryList.innerHTML = ''; // Clear existing categories if any
            let isBiographyLoaded = false;

            categories.forEach((category) => {
                const container = document.createElement('div');
                container.className = 'form-check search-content';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'form-check-input';
                checkbox.value = category.id;
                checkbox.id = 'category' + category.id;

                // Set 'Biography' as checked by default
                if (category.name === 'Biography') {
                    checkbox.checked = true;
                    isBiographyLoaded = true;
                }

                const label = document.createElement('label');
                label.className = 'form-check-label';
                label.htmlFor = checkbox.id;
                label.textContent = category.name;

                container.appendChild(checkbox);
                container.appendChild(label);

                categoryList.appendChild(container);
            });

            // Load books if Biography is loaded and checked by default
            if (isBiographyLoaded) {
                loadBooks();
            }
        })
        .catch(error => console.error('Failed to load categories:', error));
}

function loadBooks() {
    const selectedCategories = Array.from(document.querySelectorAll('.form-check-input:checked')).map(input => input.value);
    let apiUrl = `https://localhost:7198/api/Shoping/categories/books?`;
    selectedCategories.forEach((id, index) => {
        apiUrl += `categoryIds=${id}`;
        if (index < selectedCategories.length - 1) {
            apiUrl += '&';
        }
    });

    fetch(apiUrl)
        .then(response => response.json())
        .then(books => {
            const booksContainer = document.getElementById('books-container');
            booksContainer.innerHTML = ''; // Clear previous entries
            books.forEach(book => {
                const starsCount = Math.round(book.rating);
                let starsHTML = '';
                for (let i = 0; i < starsCount; i++) {
                    starsHTML += '<i class="flaticon-star text-yellow"></i>';
                }
                for (let i = starsCount; i < 5; i++) {
                    starsHTML += '<i class="flaticon-star text-muted"></i>';
                }

                let categoriesHTML = book.categories.map(category => `<li><a href="books-list.html">${category.name}</a></li>`).join('');
                let originalPrice = book.price;
                let discountedPrice = originalPrice * (1 - book.discountPercentage / 100);

                const bookCardHTML = `
                    <div class="col-md-12 col-sm-12">
                        <div class="dz-shop-card style-2">
                            <div class="dz-media">
                                <img src="${book.imageUrl}" alt="${book.title}">
                            </div>
                            <div class="dz-content">
                                <div class="dz-header">
                                    <div>
                                        <ul class="dz-tags">${categoriesHTML}</ul>
                                        <h4 class="title mb-0">
                                            <a href="books-detail.html?bookId=${book.id}">${book.title}</a>
                                        </h4>
                                    </div>
                                   <div class="price">
                                        <span class="price-num text-primary">$${discountedPrice.toFixed(2)}</span>
                                        <del>$${originalPrice.toFixed(2)}</del>
                                    </div>

                                </div>
                                <div class="dz-body">
                                    <div class="dz-rating-box">
                                        <div>
                                            <p class="dz-para">${book.description}</p>
                                        </div>
                                        <div class="review-num">
                                            <h4>${book.rating.toFixed(1)}</h4>
                                            <ul class="dz-rating">${starsHTML}</ul>
                                            <span><a href="javascript:void(0);">${book.commentsCount} Reviews</a></span>
                                        </div>
                                    </div>
                                    <div class="rate">
                                        <ul class="book-info">
                                            <li><span>Written by</span> ${book.author}</li>
                                            <li><span>Publisher</span> ${book.publisher}</li>
                                            <li><span>Year</span> ${book.yearPublished}</li>
                                        </ul>
                                        <div class="d-flex">
                                            <button class="btn btn-secondary btnhover btnhover2 add-to-cart-btn" data-bookid="${book.id}" data-price="${book.price.toFixed(2)}"><i class="flaticon-shopping-cart-1 m-r10"></i> Add to cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                booksContainer.innerHTML += bookCardHTML;
            });

            // Setup event listeners after HTML is injected
            attachCartEventListeners();
        })
        .catch(error => console.error('Error loading the books:', error));
}

document.addEventListener('DOMContentLoaded', loadCategories);

 
// Attach the loadBooks function to the checkbox change event
document.getElementById('category-list').addEventListener('change', loadBooks);



function attachCartEventListeners() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.onclick = function() {
            const bookId = this.getAttribute('data-bookid');
            const price = this.getAttribute('data-price');
            addToCart(bookId, price);
        };
    });
}

function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    if (type === 'error') {
      notification.style.borderLeftColor = 'red';
    }
    notification.textContent = message;
  
    container.appendChild(notification);
  
    setTimeout(() => {
      notification.remove();
    }, 3000); // Notification disappears after 3 seconds
  }
  
function addToCart(bookId, price) {
    const cartItem = {
        cart_id: Math.random().toString(36).substr(2, 9), // Generate a random cart ID
        bookId: parseInt(bookId),
        quantity: 1,
        format: "Hard Copy", // Default format
        price: parseFloat(price)
    };
    localStorage.setItem(`item${bookId}`, JSON.stringify(cartItem));
    alert('Added to cart!');  // Example usage:
    showNotification('This is a success message!', 'success');
}
