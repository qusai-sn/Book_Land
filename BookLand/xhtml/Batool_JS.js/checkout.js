

$(document).ready(function () {
    // Initialize the selectpicker or dropdown
    $('#countriesSelect').selectpicker();

    // After adding options, refresh the selectpicker
    window.addEventListener("load", async function () {
        const countriesAPI = "https://restcountries.com/v2/all?fields=name";
        const selectCountries = document.getElementById("countriesSelect");

        const response = await fetch(countriesAPI);
        const data = await response.json();

        data.forEach(country => {
            const option = document.createElement("option");
            option.value = country.name;
            option.textContent = country.name;
            selectCountries.appendChild(option);
        });

        // Refresh the selectpicker after dynamically adding options
        $('#countriesSelect').selectpicker('refresh');
    });
});




