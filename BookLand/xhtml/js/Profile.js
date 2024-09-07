// Function to fetch user profile data and populate the form
async function UserProfile(id) {
    
    try {
        const apiUrl = `https://localhost:7198/api/UserProfile/Api/User/${id}`;
        const response = await fetch(apiUrl );
         console.log(response);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const userData = await response.json();
       
        populateForm(userData);

    } catch (error) {
        alert('Error fetching the user profile:', error);
    }
}

// Function to populate the form with user data
function populateForm(userData) {
    const formFields = {
        name: 'name',
        professionalTitle: 'formcontrolinput2',
        languages: 'formcontrolinput3',
        age: 'formcontrolinput4',
        description: 'exampleFormControlTextarea',
        contactNumber: 'phoneNumber',
        email: 'email',
        country: 'formcontrolinput7',
        postcode: 'formcontrolinput8',
        city: 'formcontrolinput9',
        fullAddress: 'address',
    };

    Object.keys(formFields).forEach((key) => {
        const elementId = formFields[key];
        const value = userData[key] || '';
        document.getElementById(elementId).value = value;
    });
}



document.getElementById('UserProfile').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const apiUrl = 'https://localhost:7198/api/UserProfile/1';
    const formData = new FormData(); // Use FormData to handle multipart/form-data type

    // Append form fields to formData
    formData.append('Name', document.getElementById('name').value);
    formData.append('Email', document.getElementById('email').value);
    // formData.append('Image', document.getElementById('image').value); // Assuming there's an input with ID 'image'
    formData.append('Address', document.getElementById('address').value);
    formData.append('PhoneNumber', document.getElementById('phoneNumber').value);

    fetch(apiUrl, {
        method: 'PUT',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        alert('Profile updated successfully!');
    })
    .catch(error => {
        console.error('Error updating the profile:', error);
        alert('Failed to update profile.');
    });
});


// Call the function when the page loads or when the user ID is available
window.onload = function () {
    const userId = 1;  // Replace with dynamic userId
    UserProfile(userId);
};