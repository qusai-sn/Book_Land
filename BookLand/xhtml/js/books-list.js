function loadBooks() {
    const apiUrl = 'https://localhost:7198/api/Shoping/categories/4/books';
    fetch(apiUrl)
        .then(response => response.json())
        .then(books => {
            const booksContainer = document.getElementById('books-container');
            books.forEach(book => {
                const starsCount = Math.round(book.rating);
                let starsHTML = '';

                for (let i = 0; i < starsCount; i++) {
                    starsHTML += '<i class="fas fa-star text-yellow"></i>';
                }
                for (let i = starsCount; i < 5; i++) {
                    starsHTML += '<i class="fas fa-star text-muted"></i>';
                }

                const bookCardHTML = `
                    <div class="col-md-12 col-sm-12">
                        <div class="dz-shop-card style-2">
                            <div class="dz-media">
                                <img src="${book.imageUrl}" alt="book">
                            </div>
                            <div class="dz-content">
                                
                                <div class="dz-header">
									<div>
										<ul class="dz-tags">
                                        <li><a href="books-list.html">${book.category}</a></li>
                                        </ul>
										<h4 class="title mb-0"><a href="books-list.html">${book.title}</a></h4>
									</div>
									<div class="price">
										<span class="price-num text-primary">$${book.price}</span>
										  <del>$${(book.price / (1 - book.discountPercentage/100)).toFixed(2)}</del>
									</div>
								</div>

                                <div class="dz-body">
                                    <div class="dz-rating-box">
                                        <div>
                                            <p class="dz-para">${book.description}</p>
                                            <div>
                                                <a href="pricing.html" class="badge">Get 20% Discount for today</a>
                                                <a href="pricing.html" class="badge">50% OFF Discount</a>
                                                <a href="pricing.html" class="badge next-badge">See 2+ promos</a>
                                            </div>
                                        </div>
                                        <div class="review-num">
                                            <h4>${book.rating}</h4>
                                            <ul class="dz-rating">${starsHTML}</ul>
                                            <span><a href="javascript:void(0);">235 Reviews</a></span>
                                        </div>
                                    </div>
                                    <div class="rate">
                                        <ul class="book-info">
                                            <li><span>Written by</span> ${book.author}</li>
                                            <li><span>Publisher</span> ${book.publisher}</li>
                                            <li><span>Year</span> ${book.yearPublished}</li>
                                        </ul>
                                        <div class="d-flex">
                                            <a href="shop-cart.html" class="btn btn-secondary btnhover btnhover2"><i class="flaticon-shopping-cart-1 m-r10"></i> Add to cart</a>
                                            <div class="bookmark-btn style-1">
                                                <input class="form-check-input" type="checkbox" id="flexCheckDefault1">
                                                <label class="form-check-label" for="flexCheckDefault1">
                                                    <i class="flaticon-heart"></i>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                booksContainer.innerHTML += bookCardHTML;
            });
        })
        .catch(error => console.error('Error loading the books:', error));
}
function loadCategories() {
    fetch('https://localhost:7198/api/Shoping/categories')
        .then(response => response.json())
        .then(categories => {
            const categoryList = document.getElementById('category-list');
            categoryList.innerHTML = ''; // Clear existing categories if any

            categories.forEach((category, index) => {
                const container = document.createElement('div');
                container.className = 'form-check search-content';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'form-check-input';
                checkbox.value = category.id;
                checkbox.id = 'category' + category.id;

                const label = document.createElement('label');
                label.className = 'form-check-label';
                label.htmlFor = checkbox.id;
                label.textContent = category.name;

                container.appendChild(checkbox);
                container.appendChild(label);

                categoryList.appendChild(container);
            });
        })
        .catch(error => console.error('Failed to load categories:', error));
}

document.addEventListener('DOMContentLoaded', loadCategories);

document.addEventListener('DOMContentLoaded', loadBooks);
