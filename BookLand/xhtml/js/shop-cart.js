document.addEventListener('DOMContentLoaded', function() {
    

 
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
            totalPrice += item.price * formatPrices['PDF'];
        }
        if (formats.includes('AudioBook')) {
            totalPrice += item.price * formatPrices['AudioBook'];
        }
        totalPrice += hardCopyPrice;
        return totalPrice.toFixed(2);
    }

    function displayCartItems(items) {
        const tbody = document.querySelector('.table.check-tbl tbody');
        tbody.innerHTML = ''; // Clear existing entries
        items.forEach((item, index) => {
            const formats = item.format.split(';');
            tbody.innerHTML += `
            <tr>
                <td class="product-item-img"><img src="${item.imageUrl || 'images/books/grid/placeholder.jpg'}" alt="${item.bookName}" style="width: 100px; height: auto;"></td>
                <td class="product-item-name">${item.bookName}</td>
                <td class="product-item-price">$${item.price.toFixed(2)}</td>
                <td class="product-item-quantity">
                    <input type="number" class="form-control quantity" value="${item.quantity}" min="1" style="width: 60px;" onchange="updateQuantity(${item.id}, this.value)" />
                </td>
                <td class="product-item-format">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${formats.includes('HardCopy') ? 'checked' : ''} onchange="updateFormat(${item.id}, 'HardCopy', this.checked)" id="hardCopy_${item.id}">
                        <label class="form-check-label" for="hardCopy_${item.id}">HardCopy</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${formats.includes('PDF') ? 'checked' : ''} onchange="updateFormat(${item.id}, 'PDF', this.checked)" id="pdf_${item.id}">
                        <label class="form-check-label" for="pdf_${item.id}">PDF</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${formats.includes('AudioBook') ? 'checked' : ''} onchange="updateFormat(${item.id}, 'AudioBook', this.checked)" id="audioBook_${item.id}">
                        <label class="form-check-label" for="audioBook_${item.id}">AudioBook</label>
                    </div>
                </td>
                <td class="product-item-total">$${calculateTotalPrice(item)}</td>
                <td class="product-item-close">
                    <button class="btn btn-danger" onclick="removeItem(${item.id})">Remove</button>
                </td>
            </tr>
        `;
        });
    }

    function updateCartDisplay() {
        const cartItems = getCartItemsFromLocalStorage();
        displayCartItems(cartItems);
    }

    function updateQuantity(itemId, newQuantity) {
        let item = JSON.parse(localStorage.getItem(`item${itemId}`));
        item.quantity = parseInt(newQuantity, 10);
        localStorage.setItem(`item${itemId}`, JSON.stringify(item));
        updateCartDisplay(); // Refresh display
    }

    function removeItem(itemId) {
        localStorage.removeItem(`item${itemId}`);
        updateCartDisplay(); // Refresh display
    }

    function updateFormat(itemId, format, isChecked) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('item')) {
                const item = JSON.parse(localStorage.getItem(key));
                if (item.id === itemId) {
                    let formats = item.format.split(';');
                    if (isChecked) {
                        // Add format if checked and not already included
                        if (!formats.includes(format)) {
                            formats.push(format);
                        }
                    } else {
                        // Remove format if unchecked
                        formats = formats.filter(f => f !== format);
                    }
                    item.format = formats.join(';'); // Update the format string
                    localStorage.setItem(key, JSON.stringify(item));
                    break;
                }
            }
        }
     }
    
    document.getElementById("applyCouponBtn").addEventListener("click", function() {
        const couponCode = document.getElementById("couponInput").value;
    
        if (!couponCode) {
            alert("Please enter a coupon code.");
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
            alert(`Coupon applied! Discount: ${data.discountAmount}`);
            // Handle successful coupon application (e.g., update the cart total)
        })
        .catch(error => {
            alert(error.message);
        });
    });
    
    updateCartDisplay();
});