document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
debugger
    const name = document.getElementById('Name').value;
    const email = document.getElementById('Email').value;
    const subject = document.getElementById('Subject').value;
    const message = document.getElementById('Message').value;

    // Basic form validation
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields!');
        return;
    }

    const data = {
        Name: name,
        Email: email,
        Subject: subject,
        Message: message
    };

    fetch('https://your-api-url.com/api/UserProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred while sending the message: ${error.message}`);
        });
});