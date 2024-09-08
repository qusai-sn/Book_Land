document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
     debugger

    const name = document.getElementById('Name').value;
    const email = document.getElementById('Email').value;
    const subject = document.getElementById('Subject').value;
    const message = document.getElementById('Message').value;

    const id = 2;

    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields!');
        return;
    }

    const data = {
        Id: id,
        Name: name,
        Email: email,
        Subject: subject,
        Message: message
    };

    console.log("Data to be sent:", data); 

    fetch('https://localhost:44301/api/contact', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            console.log("Response Status:", response.status); 
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || 'Network response was not ok.'); });
            }
            return response.json();
        })
        .then(data => {
            console.log("Response Data:", data); 
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred while sending the message: ${error.message}`);
        });
});
