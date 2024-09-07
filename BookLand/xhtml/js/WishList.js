document.addEventListener('DOMContentLoaded', function () {
    debugger
    const userId = 1; // Example: You can get this from your session or backend

    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');

            // Create the data object to send to the backend
            const wishlistData = {
                userId: userId, // The logged-in user's ID
                bookId: bookId  // The selected book's ID
            };

            // Send a POST request to add the book to the wishlist
            fetch('https://localhost:44301/api/UserProfile/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(wishlistData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error adding to wishlist');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Book added to wishlist successfully!');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to add to wishlist.');
                });
        });
    });
});
