document.addEventListener('DOMContentLoaded', function() {
    // Retrieves cart items from localStorage
    function getCartItemsFromLocalStorage() {
        const cartItems = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('item')) {
                const item = JSON.parse(localStorage.getItem(key));
                cartItems.push(item);
            }
        }
        return cartItems;
    }

    // Calculates total price based on item details and quantity
    function calculateTotalPrice(item) {
        const formatPrices = {
            'HardCopy': 1,   // 100% of base price
            'PDF': 0.5,      // 50% of base price
            'AudioBook': 0.6 // 60% of base price
        };
        let totalPrice = 0;
        let hardCopyPrice = 0;
        const formats = item.format.split(';');

        if (formats.includes('HardCopy')) {
            hardCopyPrice = item.price * formatPrices['HardCopy'] * item.quantity;
        }
        if (formats.includes('PDF')) {
            totalPrice += item.price * formatPrices['PDF'] * item.quantity;
        }
        if (formats.includes('AudioBook')) {
            totalPrice += item.price * formatPrices['AudioBook'] * item.quantity;
        }
        totalPrice += hardCopyPrice;
        return totalPrice.toFixed(2);
    }

    // Function to update the format based on checkbox selection
    function updateFormat(bookId, format, isChecked) {
        let item = JSON.parse(localStorage.getItem(`item${bookId}`));
        if (!item) return; // Early exit if item is not found

        let formats = item.format.split(';');

        if (isChecked) {
            if (!formats.includes(format)) {
                formats.push(format);
            }
        } else {
            formats = formats.filter(f => f !== format);
        }

        item.format = formats.join(';');
        localStorage.setItem(`item${bookId}`, JSON.stringify(item));

        updateCartDisplay(); // Reflect changes in display
    }

    // Displays cart items dynamically in HTML
    function displayCartItems(items) {
        const tbody = document.querySelector('.table.check-tbl tbody');
        tbody.innerHTML = ''; // Clear existing entries

        items.forEach((item, index) => {
            const formats = item.format.split(';');
            const itemTotalPrice = calculateTotalPrice(item); // Compute total price

            tbody.innerHTML += `
            <tr>
                <td class="product-item-img"><img src="${item.imageUrl || 'images/books/grid/placeholder.jpg'}" alt="${item.bookName}" style="width: 100px; height: auto;"></td>
                <td class="product-item-name">${item.bookName}</td>
                <td class="product-item-price">$${item.price.toFixed(2)}</td>
                <td class="product-item-quantity">
                    <input type="number" class="form-control quantity" value="${item.quantity}" min="1" style="width: 100px;" onchange="updateQuantity(${item.bookId}, this.value)" />
                </td>
                <td class="product-item-format">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${formats.includes('HardCopy') ? 'checked' : ''} onchange="updateFormat(${item.bookId}, 'HardCopy', this.checked)" id="hardCopy_${item.bookId}">
                        <label class="form-check-label" for="hardCopy_${item.bookId}">HardCopy</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${formats.includes('PDF') ? 'checked' : ''} onchange="updateFormat(${item.bookId}, 'PDF', this.checked)" id="pdf_${item.bookId}">
                        <label class="form-check-label" for="pdf_${item.bookId}">PDF</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${formats.includes('AudioBook') ? 'checked' : ''} onchange="updateFormat(${item.bookId}, 'AudioBook', this.checked)" id="audioBook_${item.bookId}">
                        <label class="form-check-label" for="audioBook_${item.bookId}">AudioBook</label>
                    </div>
                </td>
                <td class="product-item-total">$<span id="itemTotal_${item.bookId}">${itemTotalPrice}</span></td>
                <td class="product-item-close">
                    <button class="btn btn-danger" onclick="removeItem(${item.bookId})">Remove</button>
                </td>
            </tr>
        `;
        });
    }

    // Refreshes the cart display by fetching updated cart items
    function updateCartDisplay() {
        const cartItems = getCartItemsFromLocalStorage();
        displayCartItems(cartItems);
    }

     function updateQuantity(bookId, newQuantity) {
        let item = JSON.parse(localStorage.getItem(`item${bookId}`));
        item.quantity = parseInt(newQuantity, 10);
        localStorage.setItem(`item${bookId}`, JSON.stringify(item));

        const updatedTotalPrice = calculateTotalPrice(item);
        document.getElementById(`itemTotal_${bookId}`).innerText = updatedTotalPrice; // Update the total price displayed

        updateCartDisplay(); // Refresh the cart display
    }

    // Removes an item from the cart
    function removeItem(bookId) {
        localStorage.removeItem(`item${bookId}`);
        updateCartDisplay(); // Update display after item is removed
    }

    // Listener for coupon application
    document.getElementById("applyCouponBtn").addEventListener("click", function() {
        const couponCode = document.getElementById("couponInput").value;

        if (!couponCode) {
            Swal.fire({
                title: "Error",
                text: "Please enter a coupon code",
                icon: "error"
            });
            return;
        }

        fetch('https://localhost:44301/api/Shoping/validate', {
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
            localStorage.couponPercentage = data.discountAmount;
            Swal.fire({
                title: "Coupon Applied",
                text: `Discount: ${data.discountAmount}`,
                icon: "success"
            });
        })
        .catch(error => {
            Swal.fire({
                title: "Error",
                text: `Error: ${error.message}`,
                icon: "error"
            });
        });
    });

    updateCartDisplay(); // Initial display update
});


function updateQuantity(bookId, newQuantity) {
    let item = JSON.parse(localStorage.getItem(`item${bookId}`));
    item.quantity = parseInt(newQuantity, 10);
    localStorage.setItem(`item${bookId}`, JSON.stringify(item));

    updateCartDisplay(); // Reflect changes in display

}

    // Removes an item from the cart
function removeItem(bookId) {
    localStorage.removeItem(`item${bookId}`);
    updateCartDisplay(); // Update display after item is removed
}

// Function to update the format based on checkbox selection
function updateFormat(bookId, format, isChecked) {
    let item = JSON.parse(localStorage.getItem(`item${bookId}`));
    if (!item) return; // Early exit if item is not found

    let formats = item.format.split(';');

    if (isChecked) {
        if (!formats.includes(format)) {
            formats.push(format);
        }
    } else {
        formats = formats.filter(f => f !== format);
    }

    item.format = formats.join(';');
    localStorage.setItem(`item${bookId}`, JSON.stringify(item));

    updateCartDisplay(); // Reflect changes in display
}
function updateCartDisplay() {
    const cartItems = getCartItemsFromLocalStorage();
    displayCartItems(cartItems);
}

function getCartItemsFromLocalStorage() {
    const cartItems = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('item')) {
            const item = JSON.parse(localStorage.getItem(key));
            cartItems.push(item);
        }
    }
    return cartItems;
}

// Displays cart items dynamically in HTML
function displayCartItems(items) {
    const tbody = document.querySelector('.table.check-tbl tbody');
    tbody.innerHTML = ''; // Clear existing entries

    items.forEach((item, index) => {
        const formats = item.format.split(';');
        const itemTotalPrice = calculateTotalPrice(item); // Compute total price

        tbody.innerHTML += `
        <tr>
            <td class="product-item-img"><img src="${item.imageUrl || 'images/books/grid/placeholder.jpg'}" alt="${item.bookName}" style="width: 100px; height: auto;"></td>
            <td class="product-item-name">${item.bookName}</td>
            <td class="product-item-price">$${item.price.toFixed(2)}</td>
            <td class="product-item-quantity">
                <input type="number" class="form-control quantity" value="${item.quantity}" min="1" style="width: 110px;" onchange="updateQuantity(${item.bookId}, this.value)" />
            </td>
            <td class="product-item-format">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" ${formats.includes('HardCopy') ? 'checked' : ''} onchange="updateFormat(${item.bookId}, 'HardCopy', this.checked)" id="hardCopy_${item.bookId}">
                    <label class="form-check-label" for="hardCopy_${item.bookId}">HardCopy</label>
                </div>
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" ${formats.includes('PDF') ? 'checked' : ''} onchange="updateFormat(${item.bookId}, 'PDF', this.checked)" id="pdf_${item.bookId}">
                    <label class="form-check-label" for="pdf_${item.bookId}">PDF</label>
                </div>
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" ${formats.includes('AudioBook') ? 'checked' : ''} onchange="updateFormat(${item.bookId}, 'AudioBook', this.checked)" id="audioBook_${item.bookId}">
                    <label class="form-check-label" for="audioBook_${item.bookId}">AudioBook</label>
                </div>
            </td>
            <td class="product-item-total">$<span id="itemTotal_${item.bookId}">${itemTotalPrice}</span></td>
            <td class="product-item-close">
                <button class="btn btn-danger" onclick="removeItem(${item.bookId})">Remove</button>
            </td>
        </tr>
    `;
    });
}

    // Calculates total price based on item details and quantity
function calculateTotalPrice(item) {
    const formatPrices = {
        'HardCopy': 1,   // 100% of base price
        'PDF': 0.5,      // 50% of base price
        'AudioBook': 0.6 // 60% of base price
    };
    let totalPrice = 0;
    let hardCopyPrice = 0;
    const formats = item.format.split(';');

    if (formats.includes('HardCopy')) {
        hardCopyPrice = item.price * formatPrices['HardCopy'] * item.quantity;
    }
    if (formats.includes('PDF')) {
        totalPrice += item.price * formatPrices['PDF'] * item.quantity;
    }
    if (formats.includes('AudioBook')) {
        totalPrice += item.price * formatPrices['AudioBook'] * item.quantity;
    }
    totalPrice += hardCopyPrice;
    return totalPrice.toFixed(2);
}
