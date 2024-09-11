// Check if token exists in local storage
window.onload = function() {
    var token = localStorage.getItem('jwtToken');
    
    // If the token doesn't exist, redirect to login page
    if (!token) {
        window.location.href = 'shop-login.html';
    }
};
