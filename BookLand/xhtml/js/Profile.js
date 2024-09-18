





$(document).ready(function () {
    const userId = 1;
    // Function to fetch user data
    function fetchUserData(id) {
        return fetch(`https://localhost:44301/api/CompinedData/${id}/fullProfile`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                throw error; // Rethrow the error
            });
    }

    // Function to populate the form with user data
        function populateForm(data) {
            $("#name").val(data.name);
            $("#phoneNumber").val(data.phoneNumber);
            $("#email").val(data.email);
            $("#address").val(data.address);
            $("#formcontrolinput2").val(data.professionalTitle);
            $("#formcontrolinput3").val(data.languages);
            $("#formcontrolinput4").val(data.age);
            $("#exampleFormControlTextarea").val(data.description);
            $("#formcontrolinput7").val(data.country);
            $("#formcontrolinput9").val(data.city);
            $("#formcontrolinput8").val(data.postcode);
            
            $(".account-detail h4 a").text(data.name);  // Update the name
            $(".account-detail p a").text(data.professionalTitle);  // Update the professional title
            $(".my-image img").attr("src", data.profileImage);  // Update image
        }

    // Function to update the user profile
    async function updateProfile(id, updatedProfile) {
        try {
            const response = await fetch(`https://localhost:44301/api/CompinedData/${id}/fullProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProfile)
            });

            // Check if the response is not OK
            if (!response.ok) {
                let errorMessage = `${response.status} ${response.statusText}`;

                // Attempt to parse the error response
                try {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage += `: ${errorData.message || ''}`;
                    } else {
                        errorMessage += `: Unable to parse error details. Response is not JSON.`;
                    }
                } catch (e) {
                    errorMessage += `: Unable to parse error details.`;
                }

                throw new Error(`Failed to update profile: ${errorMessage}`);
            }

            // Optionally return response data if needed
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json(); // Assuming server responds with JSON
            } else {
                return {}; // Return an empty object if response is not JSON
            }

        } catch (error) {
            // Log and alert the error message
            console.error('Error updating profile:', error);
            // alert(`Error updating profile: ${error.message}`);
            Swal.fire({
                title: "Error",
                text: `Error updating profile: ${error.message}`,
                icon: "error"
              });
            throw error; // Re-throw to allow higher-level handling if necessary
        }
    }


    // Function to handle the form submission event
    $("#UserProfile").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        const updatedProfile = {
            name: $('#name').val(),
            email: $('#email').val(),
            phoneNumber: $('#phoneNumber').val(),
            address: $('#address').val(),
            professionalTitle: $("#formcontrolinput2").val(),
            languages: $("#formcontrolinput3").val(),
            age: $("#formcontrolinput4").val(),
            description: $("#exampleFormControlTextarea").val(),
            country: $("#formcontrolinput7").val(),
            city: $("#formcontrolinput9").val(),
            postcode: $("#formcontrolinput8").val(),
            Points: $("#Points").val()

        };

        // Validate the input data
        if (!updatedProfile.name || !updatedProfile.email) {
            // alert('Please fill in the required fields.');
            Swal.fire({
                title: "Error",
                text: "Please fill in the required fields.",
                icon: "error"
              });
            return;
        }

        updateProfile(userId, updatedProfile)
            .then(() => Swal.fire({
                title: "success",
                text: "Your profile has been updated.",
                icon: "success"
              }))
            .catch(() =>         Swal.fire({
                title: "Error",
                text: "An error has occurred while updating your profile",
                icon: "error"
              }));
       
});

    // Fetch and populate user data on page load
    fetchUserData(userId)
        .then(data => populateForm(data))
        .catch(error => console.error('Error:', error));
}
); 

function fetchUserPoints() {
    // Retrieve the user ID from local storage
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error('No user ID found in local storage');
        return;
    }

    // Check if the user points are already stored in local storage
    const cachedPoints = localStorage.getItem(`userPoints_${userId}`);
    if (cachedPoints) {
        console.log('Retrieving cached points:', cachedPoints);
        document.getElementById('userPoints').innerText = `Your Points: ${cachedPoints}`;
        return;
    }

    // If points are not cached, fetch them from the API
    fetch(`https://localhost:44301/api/LoyalityPoints/userPoints/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('User Points:', data);
            // Cache the points in local storage
            localStorage.setItem(`userPoints_${userId}`, data.points);
            // Update the UI
            document.getElementById('userPoints').innerText = `Your Points: ${data.points}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Call the function
fetchUserPoints(); 


