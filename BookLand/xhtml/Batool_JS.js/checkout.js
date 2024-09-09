

$(document).ready(function () {
    // Initialize the selectpicker or dropdown
    $('#countriesSelect').selectpicker();
    $('#anotherDropdown').selectpicker();

    window.addEventListener("load", async function () {
        const countriesAPI = "https://restcountries.com/v2/all?fields=name";

        const selectCountries = document.getElementById("countriesSelect");
        const selectAnother = document.getElementById("anotherDropdown");

        const response = await fetch(countriesAPI);
        const data = await response.json();

        data.forEach(country => {
            // create the options for the first dropdown
            const option = document.createElement("option");
            option.value = country.name;
            option.textContent = country.name;
            selectCountries.appendChild(option);
            // create the options for the second dropdown
            const option2 = document.createElement("option");
            option2.value = country.name;
            option2.textContent = country.name;
            selectAnother.appendChild(option2);
        });

        // Refresh the selectpicker after dynamically adding options
        $('#countriesSelect').selectpicker('refresh');
        $('#anotherDropdown').selectpicker('refresh');
    });
});



// fil user info into form
const userID = localStorage.getItem("userId");

async function getUserInfo(id)
{
    const url = `https://localhost:7198/api/Orders/getUserInfo/${id}`;
    const response = await fetch(url);
    let Data = await response.json();

    Data.forEach(element => 
    {
        document.getElementById("userName").value = element.name;
        document.getElementById("userEmail").value = element.email;
        document.getElementById("userPhone").value = element.phoneNumber;
    }
    );

};
getUserInfo(userID);







