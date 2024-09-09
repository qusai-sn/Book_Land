document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();

    function isLoggedIn() {
        return localStorage.getItem('jwtToken') !== null;
    }

    async function fetchCartDataFromServer(userId) {
        try {
            const response = await fetch(`https://localhost:7198/api/Shoping/${userId}/items`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch cart data');
            return await response.json();
        } catch (error) {
            console.error('Error fetching cart data from server:', error);
            return [];
        }
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

    function displayCartItems(items) {
        const tbody = document.querySelector('.table.check-tbl tbody');
        tbody.innerHTML = ''; // Clear existing entries
        items.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td class="product-item-img"><img src="${item.image || 'images/books/grid/placeholder.jpg'}" alt="${item.name}"></td>
                    <td class="product-item-name">${item.name}</td>
                    <td class="product-item-price">$${item.price.toFixed(2)}</td>
                    <td class="product-item-quantity">
                        <div class="quantity btn-quantity style-1 me-3">
                            <input id="demo_vertical${item.id}" type="text" value="${item.quantity}" name="demo_vertical2" />
                        </div>
                    </td>
                    <td class="product-item-totle">$${(item.price * item.quantity).toFixed(2)}</td>
                    <td class="product-item-close"><a href="javascript:void(0);" class="ti-close" onclick="removeItem(${item.id})"></a></td>
                </tr>
            `;
        });
    }

 
    async function updateCartDisplay() {
        if (isLoggedIn()) {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const cartItems = await fetchCartDataFromServer(userId);
                displayCartItems(cartItems);
            }
        } else {
            const cartItems = getCartItemsFromLocalStorage();
            displayCartItems(cartItems);
        }
    }
});

function removeItem(itemId) {
    console.log('Remove item:', itemId);
    // Add logic here to remove item from cart
}
