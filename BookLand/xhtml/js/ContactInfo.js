document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const contactData = {
        Id: null,  // Assuming you're not setting the ID for new entries
        Name: document.getElementById('Name').value,
        Email: document.getElementById('Email').value,
        Subject: document.getElementById('Subject').value,
        Message: document.getElementById('Message').value
    };

    // Basic form validation
    if (!contactData.Name || !contactData.Email || !contactData.Subject || !contactData.Message) {
        alert('Please fill in all fields!');
        return;
    }

    // Send a POST request to the server with JSON data
    fetch('https://localhost:44301/api/UserProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),  // Send the data as JSON
    })
        .then(response => {
            console.log("Response Status:", response.status);  // Debugging purposes
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || 'Network response was not ok.'); });
            }
            // Try to parse JSON. If it fails, treat the response as text.
            return response.text().then(text => {
                try {
                    return JSON.parse(text);  // Try to parse the response as JSON
                } catch {
                    return text;  // If parsing fails, return the text as-is
                }
            });
        })
        .then(data => {
            console.log("Response Data:", data);  // Debugging purposes
            if (typeof data === 'string') {
                alert(data);  // If the response is plain text, show the message
            } else {
                alert('Message sent successfully!');
            }
            document.getElementById('contactForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred while sending the message: ${error.message}`);
        });
});
