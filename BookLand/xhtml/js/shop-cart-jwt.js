document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userId'); // Correctly retrieve userId
    const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the JWT from localStorage

    async function fetchCartDataFromServer(userId) {
        try {
            const response = await fetch(`https://localhost:7198/api/Shoping/${userId}/items`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`, // Use the jwtToken correctly
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch cart data');
            return await response.json(); // Return the JSON response
        } catch (error) {
            console.error('Error fetching cart data from server:', error);
            return [];
        }
    }

    function calculateTotalPrice(item) {
        const formatPrices = {
            'HardCopy': 1,   // 100% of base price
            'PDF': 0.5,      // 50% of base price
            'AudioBook': 0.6 // 60% of base price
        };
        let totalPrice = 0;
        const formats = item.format.split(';');
        formats.forEach(format => {
            const priceContribution = item.price * formatPrices[format] * item.quantity;
            totalPrice += priceContribution;
        });
        return totalPrice.toFixed(2);
    }

    
    
    function displayCartItems(items) {
        const tbody = document.querySelector('.table.check-tbl tbody');
        tbody.innerHTML = ''; // Clear existing entries
        items.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td class="product-item-img"><img src="${item.image}" alt="${item.bookTitle}"></td>
                    <td class="product-item-name">${item.bookTitle}</td>
                    <td class="product-item-price">$${item.price.toFixed(2)}</td>
                    <td class="product-item-quantity">
                        <input type="number" class="form-control quantity" value="${item.quantity}" onchange="updateQuantity(${item.cartItemId}, this.value)" />
                    </td>
                    <td class="product-item-format">
                         <div class="form-check">
                             <input type="checkbox" class="form-check-input" ${item.format.includes('HardCopy') ? 'checked' : ''} onchange="updateFormat(${item.cartItemId}, 'HardCopy', this.checked)" id="hardCopy_${item.id}">
                             <label class="form-check-label" for="hardCopy_${item.cartItemId}">HardCopy</label>
                         </div>
                         <div class="form-check">
                             <input type="checkbox" class="form-check-input" ${item.format.includes('PDF') ? 'checked' : ''} onchange="updateFormat(${item.cartItemId}, 'PDF', this.checked)" id="pdf_${item.id}">
                             <label class="form-check-label" for="pdf_${item.cartItemId}">PDF</label>
                         </div>
                         <div class="form-check">
                             <input type="checkbox" class="form-check-input" ${item.format.includes('AudioBook') ? 'checked' : ''} onchange="updateFormat(${item.cartItemId}, 'AudioBook', this.checked)" id="audioBook_${item.id}">
                             <label class="form-check-label" for="audioBook_${item.cartItemId}">AudioBook</label>
                         </div>
                     </td>
                    <td class="product-item-total">$${calculateTotalPrice(item)}</td>
                    <td class="product-item-close"><button class="btn btn-danger" onclick="removeItem(${item.cartItemId})">Remove</button></td>
                </tr>
            `;
        });
    }
//this is the json output : 
// {
//     "cartItemId": 6,
//     "image": "https://edit.org/images/cat/book-covers-big-2019101610.jpg",
//     "cartId": 3,
//     "bookId": 9,
//     "bookTitle": "Book Title 9",
//     "quantity": 2,
//     "price": 13.49,
//     "format": "PDF"
//   },
    async function updateCartDisplay() {
        if (userId) {
            const cartItems = await fetchCartDataFromServer(userId);
            displayCartItems(cartItems);
        } else {
            // alert('User ID not found. Please ensure you are logged in.');
            Swal.fire({
                title: "Error",
                text: "User ID not found. Please ensure you are logged in",
                icon: "error"
              });
        }
    }
    function updateFormat(itemId, format, isChecked) {
 
    }
    document.getElementById("applyCouponBtn").addEventListener("click", function() {
        const couponCode = document.getElementById("couponInput").value;
    
        if (!couponCode) {
            // alert("Please enter a coupon code.");
            Swal.fire({
                title: "Error",
                text: "Please enter a coupon code",
                icon: "error"
              });
            return;
        }
    
        // Send POST request to validate the coupon
        fetch('https://localhost:7198/api/Shoping/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(couponCode)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Coupon not valid or expired.');
            }
            return response.json();
        })
        .then(data => {
            localStorage.couponPercentage = data.discountAmount ;
            // alert(`Coupon applied! Discount: ${data.discountAmount}`);
            Swal.fire({
                title: "Coupon Applied!",
                text: `Discount: ${data.discountAmount}`,
                icon: "success"
              });
            // Handle successful coupon application (e.g., update the cart total)
        })
        .catch(error => {
            // alert(error.message);
            Swal.fire({
                title: "Error",
                text: `Error : ${error.message}`,
                icon: "error"
              });
        });
    });
    
    updateCartDisplay();
});
