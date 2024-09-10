document.addEventListener("DOMContentLoaded", function () {
    debugger;
    // Fetch data from the API
    fetch('https://localhost:44301/api/Books/RandomBook')
        .then(response => response.json())
        .then(data => {
            // Assuming 'data' is an array of books
            if (Array.isArray(data)) {
                data.forEach((book, index) => {
                    // Clone the book template
                    let bookTemplate = document.querySelector("#book-template").cloneNode(true);
                    bookTemplate.style.display = "block"; // Make it visible

                    // Update the book's title, price, and image
                    bookTemplate.querySelector('.book-title').innerText = book.title;
                    bookTemplate.querySelector('.book-price').innerText = `$${book.price}`;
                    bookTemplate.querySelector('.book-image').src = book.imageUrl;

                    // Append the book to the book container
                    document.querySelector("#book-container").appendChild(bookTemplate);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
        });
});

////////////////////////////////////////////////// this function for hero section books //////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from the top-rated books API
    fetch('https://localhost:44301/api/Books/topRatedBooks')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                data.forEach(book => {
                    // Clone the book template
                    let bookTemplate = document.querySelector("#book-template-top-rated").cloneNode(true);
                    bookTemplate.style.display = "block"; // Make the template visible

                    // Update the book's title, author, price, and image
                    bookTemplate.querySelector('.book-title').innerText = book.title;
                    bookTemplate.querySelector('.book-author').innerText = `by ${book.author}`;
                    bookTemplate.querySelector('.book-price').innerText = `$${book.price}`;
                    bookTemplate.querySelector('.book-image').src = book.imageUrl;

                    // Add star rating dynamically based on the rating value
                    let ratingContainer = bookTemplate.querySelector('.book-rating');
                    let fullStars = Math.floor(book.rating);
                    let halfStar = book.rating % 1 !== 0; // Check if there's a half star

                    // Add full stars
                    for (let i = 0; i < fullStars; i++) {
                        let star = document.createElement('i');
                        star.className = "flaticon-star text-yellow";
                        ratingContainer.appendChild(star);
                    }

                    // Add half star if applicable
                    if (halfStar) {
                        let star = document.createElement('i');
                        star.className = "flaticon-star-half text-yellow";
                        ratingContainer.appendChild(star);
                    }

                    // Add remaining empty stars
                    let remainingStars = 5 - fullStars - (halfStar ? 1 : 0);
                    for (let i = 0; i < remainingStars; i++) {
                        let star = document.createElement('i');
                        star.className = "flaticon-star text-muted";
                        ratingContainer.appendChild(star);
                    }

                    // Append the book to the swiper container
                    document.querySelector("#top-rated-books").appendChild(bookTemplate);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching top-rated books:', error);
        });
});
