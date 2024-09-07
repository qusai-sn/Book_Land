document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Name', document.getElementById('Name').value);
    formData.append('Email', document.getElementById('Email').value);
    formData.append('Subject', document.getElementById('Subject').value);
    formData.append('Message', document.getElementById('Message').value);

    fetch('https://localhost:44301/api/UserProfile', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => alert('Message sent successfully!'))
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending the message.');
        });
});
