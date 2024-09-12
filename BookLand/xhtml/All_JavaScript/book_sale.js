const url100 = "https://localhost:44301/api/Books/bySaleBooks";
const urlCategory = "https://localhost:44301/api/Category/byIDCategory/";

async function getCategoriesByIds(categoryIds) {
  try {
    const response = await fetch(urlCategory + categoryIds.join(","));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {};
  }
}

async function getBooksOnSale() {
  try {
    const response = await fetch(url100);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results = await response.json();
    const card = document.getElementById("saleprodect");

    if (results.length === 0) {
      card.innerHTML = "<p>No books available on sale.</p>";
      return;
    }

    const categoryIds = results.map((book) => book.categoryId);
    const allCategoryNames = await getCategoriesByIds(categoryIds);

    const booksHTML = results
      .filter((book) => parseFloat(book.discountPercentage) > 0)
      .map((book) => {
        const price = parseFloat(book.price) || 0;
        const discount = parseFloat(book.discountPercentage) || 0;
        const discountedPrice = price - (price * discount) / 100;
        const categoryName = allCategoryNames[book.categoryId] || "Unknown";

        return `
        <div class="swiper-slide">
                        <div class="books-card style-1 wow fadeInUp" data-wow-delay="0.2s">
                        <div class="dz-media" style="width: 200px; height: 300px; overflow: hidden; ">
                        
                                        <span class="discount-badge">${discount}% Off</span>
                                            <i class="flaticon-star"></i> ${book.rating || "Untitled"
          }
                              <img src="${book.imageUrl || "default-image.jpg"
          }" 
                        alt="${book.title || "No title available"}" 
                        style="width: 100%; height: 100%; object-fit: cover;" />
                        
                </div>

                        <div class="dz-content">
                            <h4 class="title">${book.title || "Untitled"}</h4>
                             <div class="price" style="display: flex; flex-direction: row; justify-content:space-between;>
                              
        
          <span class="price-num discounted" style="font-size: 1.5rem; color: #000; font-weight: bold;">
          
            $${discountedPrice.toFixed(2)}
          </span>
           <del class="price-num original" style="font-size: 1rem; color: #ff4d4d;">
            $${price.toFixed(2)}
          </del>
        </div>
                     
                            <a href="javascript:void(0);" onclick="addToCart1(${book.id
          }, '${book.format || "PDF"}', ${book.price || 0},'${book.imageUrl
          }')" id="add-to-cart-button" class="btn btn-secondary btnhover btnhover2">
                                <i class="flaticon-shopping-cart-1 m-r10"></i> Add to cart
                            </a>
                        </div>
                    </div>
                </div>



                





        `;
      })
      .join("");

    card.innerHTML = booksHTML;

    new Swiper(".swiper-container.swiper-four", {
      slidesPerView: 1,
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination-two",
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 3, spaceBetween: 30 },
        1024: { slidesPerView: 4, spaceBetween: 40 },
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    const card = document.getElementById("saleprodect");
    card.innerHTML = "<p>Failed to load books. Please try again later.</p>";
  }
}

getBooksOnSale();

function addToCart(bookId, format, price, imageUrl) {
  // Cart addition logic
  Swal.fire({
    title: "Book added to cart!",
    text: "The book has been successfully added to your cart.",
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "#3085d6",
  });
}