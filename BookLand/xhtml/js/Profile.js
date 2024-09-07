// Function to fetch user profile data and populate the form
async function UserProfile(id) {
    debugger
    try {
        const apiUrl = `https://localhost:44301/api/UserProfile/${id}`;
        const response = await fetch(apiUrl, {
            mode: 'no-cors'
        });
        
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

// Call the function when the page loads or when the user ID is available
window.onload = function () {
    const userId = 1;  // Replace with dynamic userId
    UserProfile(userId);
};