document.addEventListener('DOMContentLoaded', function () {
    debugger
    const userId = 1; // Replace with actual user ID
    const wishlistTableBody = document.getElementById('wishlist-table-body');

    // Function to fetch wishlist data by userId
    function fetchWishlist() {
        fetch(`https://localhost:44301/api/Wishlist/byUserId/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching wishlist');
                }
                return response.json();
            })
            .then(wishlist => {
                // Clear existing table rows
                wishlistTableBody.innerHTML = '';

                // Check if wishlist is empty
                if (wishlist.length === 0) {
                    const emptyRow = `<tr><td colspan="6">Your wishlist is empty</td></tr>`;
                    wishlistTableBody.innerHTML = emptyRow;
                } else {
                    // Populate the table with wishlist items
                    wishlist.forEach(item => {
                        const tableRow = `
                            <tr>
                                <td class="product-item-img">
                                    <img src="${item.bookImage}" alt="${item.bookName}">
                                </td>
                                <td class="product-item-name">${item.bookName}</td>
                                <td class="product-item-price">$${item.bookPrice}</td>
                                <td class="product-item-quantity">
                                    <div class="quantity btn-quantity style-1 me-3">
                                        <input type="text" value="1" name="quantity"/>
                                    </div>
                                </td>
                                <td class="product-item-totle">
                                    <a href="shop-cart.html" class="btn btn-primary btnhover">Add To Cart</a>
                                </td>
                                <td class="product-item-close">
                                    <a href="javascript:void(0);" class="ti-close" onclick="removeFromWishlist(${item.bookId})"></a>
                                </td>
                            </tr>
                        `;
                        wishlistTableBody.innerHTML += tableRow;
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch wishlist.');
            });
    }

    // Fetch wishlist on page load
    fetchWishlist();

    // Function to remove a book from the wishlist
    function removeFromWishlist(bookId) {
        fetch(`https://localhost:44301/api/Wishlist/remove/${userId}/${bookId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert('Book removed from wishlist');
                    fetchWishlist(); // Refresh the wishlist after removal
                } else {
                    alert('Failed to remove the book');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});
