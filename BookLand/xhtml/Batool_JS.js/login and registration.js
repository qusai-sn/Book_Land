const registerAPI = "https://localhost:7198/api/LoginAndRegister/register";
const logInAPI = "https://localhost:7198/api/LoginAndRegister/login";




// login function
async function Login() {
    debugger
    event.preventDefault();

    // get login form
    let loginForm = document.getElementById("login");

    const formData = new FormData(loginForm);

    let response = await fetch(logInAPI, 
        {
            method: "POST",
            body: formData,
        }
    );
    console.log(response);

    if (response.ok) {
        var result = await response.json();
        localStorage.setItem('jwtToken', result.token);

        localStorage.setItem('userId', result.userId);

        // if i arrived to login through a different page 
        //then redirect to said page after i'm logged in and remove it from local storage
        let previousPage = localStorage.getItem("previousPage");
        if (previousPage)
        {
            location.href = `${previousPage}`
            localStorage.removeItem("previousPage")
        }
        else
        {
            location.href = "index.html";
        }
    }



}