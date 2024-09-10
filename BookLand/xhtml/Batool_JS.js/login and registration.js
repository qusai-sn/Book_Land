const registerAPI = "https://localhost:7198/api/LoginAndRegister/register";
const logInAPI = "https://localhost:7198/api/LoginAndRegister/login";



// login function
async function Login() {
    // debugger
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
        let result = await response.json();

        localStorage.setItem('jwtToken', result.token);

        localStorage.setItem('userId', result.id);

        // if i arrived to login through a different page 
        //then redirect to said page after i'm logged in and remove it from local storage
        let previousPage = localStorage.getItem("previousPage");
        if (previousPage) {
            location.href = `${previousPage}.html`;
            localStorage.removeItem("previousPage");
        }
        else {
            location.href = "index.html";
        }
    }

}



// register function
async function register() {
    debugger
    event.preventDefault();

    // get register form
    let registerForm = document.getElementById("register");

    // get password and confirm password values as well as the error message
    const confirmPWD = document.getElementById("confirmPWD").value;
    const password = document.getElementById("password").value;


    if (confirmPWD === password) {
        const formData = new FormData(registerForm);

        let response = await fetch(registerAPI,
            {
                method: "POST",
                body: formData,
            }
        );

        if (response.ok) {
            location.href = "shop-checkout.html";
        }
    }
    else {
        alert("invalid login");
    }
}

// function to check password on input and send error message
document.getElementById("confirmPWD").addEventListener("input", function () {

    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPWD").value;
    let errorMessage = document.getElementById("error-message");

    if (password !== confirmPassword) {
        errorMessage.style.display = "block";
        errorMessage.innerText = "Passwords do not match";
    } else {
        errorMessage.style.display = "none";
    }
});



// logout function
async function logout() {
    event.preventDefault();

    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
}






// async function loginwithgoogle()
// {

//  console.log("test1");

//         let googleUser = localStorage.getItem("GoogleUser");

//  console.log("test2");

//         const googleLoginURL = "https://localhost:7198/api/LoginAndRegister/GoogleLogin"
//  console.log("test3");

//         const response = await fetch(googleLoginURL, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: googleUser.displayName,
//             email: googleUser.email,
//             image: googleUser.photoURL,
//           }),
//         });
//         console.log("test4");


// }



async function loginwithgoogle() {
    try {
        let googleUser = JSON.parse(localStorage.getItem("GoogleUser"));
        if (!googleUser) {
            throw new Error("Google user not found in local storage");
        }

        const googleLoginURL = "https://localhost:7198/api/LoginAndRegister/GoogleLogin";
        const response = await fetch(googleLoginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: googleUser.displayName,
                email: googleUser.email,
                image: googleUser.photoURL,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to login via Google: " + response.statusText);
        }

        const token = await response.json();
        console.log("Token received:", token);
        // Save token to local storage or proceed as needed
        localStorage.setItem("token", token);

    } catch (error) {
        console.error("Error during Google login:", error);
        alert("Error during Google login. Please try again.");
    }
}