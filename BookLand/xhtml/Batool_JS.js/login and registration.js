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
    else
    {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong during the proccess!"
          });
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
        Swal.fire({
            icon: "error",
            title: "Try Again!",
            text: "Passwords do not match!",
          });
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
        // debugger
        // let googleUser = JSON.parse(localStorage.getItem("GoogleUser"));
        // if (!googleUser) {
        //     throw new Error("Google user not found in local storage");
        // }

        // const googleLoginURL = "https://localhost:7198/api/LoginAndRegister/GoogleLogin";
        // console.log("Sending data:", {
        //     name: googleUser.displayName,
        //     email: googleUser.email,
        //     image: googleUser.photoURL,
        // });

        // const response = await fetch(googleLoginURL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         name: googleUser.displayName,
        //         email: googleUser.email,
        //         image: googleUser.photoURL,
        //     }),
        // });

        // if (!response.ok) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Huh!",
        //         text: "Failed to login via Google",
        //         footer: 'throw new Error(" Error : " + response.statusText)'
        //       });
        // }

        // const data = await response.json();
        // console.log("Token received:", data.Gtoken);

        // // Save token to local storage or proceed as needed
        // localStorage.setItem("token", data.Gtoken);

    } catch (error) {
        console.error("Error during Google login:", error);
        // Swal.fire({
        //     icon: "error",
        //     title: "Huh!",
        //     text: "Something went wrong during Google login!",
        //     footer: 'Please try again.'
        //   });
        
    }
}





///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


async function SendOTP() {
    const url = "https://localhost:7198/api/LoginAndRegister/reset/request";
    const response = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: document.getElementById("resetPasswordEmail").value
            }),
        }
    );

    if (response.status === 200) {
        otpSentDone();
        document.getElementById("resetPasswordOTP").removeAttribute('disabled');
        document.getElementById("form2-1").style.display = "block";
        document.getElementById("form2-2").removeAttribute('disabled');
        document.getElementById("form2-3").removeAttribute('disabled');

        document.getElementById("resetPasswordEmail").setAttribute("disabled", true);
        document.getElementById("form1btn").setAttribute("disabled", true);

        function countdown(elementName, minutes, seconds) {
            var element, endTime, hours, mins, msLeft, time;

            function twoDigits(n) {
                return (n <= 9 ? "0" + n : n);
            }

            function updateTimer() {
                msLeft = endTime - (+new Date);
                if (msLeft < 1000) {
                    element.innerHTML = "Time is up!";
                } else {
                    time = new Date(msLeft);
                    hours = time.getUTCHours();
                    mins = time.getUTCMinutes();
                    element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
                    setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
                }
            }

            element = document.getElementById(elementName);
            endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
            updateTimer();
        }

        countdown("ten-countdown", 5, 0);

    }
    else {
        otpSentWrong();
    }
};



async function checkOTP() {
    const url = "https://localhost:7198/api/LoginAndRegister/reset/validate-otp";
    const response = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otp: document.getElementById("resetPasswordOTP").value
            }),
        }
    );

    if (response.status === 200) {
        localStorage.setItem("OTP", document.getElementById("resetPasswordOTP").value);
        OTPCorrect();

        document.getElementById("resetPasswordNewPWD").removeAttribute('disabled');
        document.getElementById("form3-1").removeAttribute('disabled');
        document.getElementById("form3-2").removeAttribute('disabled');

        document.getElementById("resetPasswordOTP").setAttribute("disabled", true);
        document.getElementById("form2-2").setAttribute("disabled", true);
        document.getElementById("form2-1").style.display = "none";
        document.getElementById("form2-3").setAttribute("disabled", true);
    }
    else {
        OTPWrong()
    }

}


async function NewPWD() {
    // debugger
    console.log(document.getElementById("resetPasswordNewPWD").value)

    const otp = localStorage.getItem("OTP");
    const url = `https://localhost:7198/api/LoginAndRegister/reset/password/${otp}`;

    const response = await fetch(url,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newPassword: document.getElementById("resetPasswordNewPWD").value,
            }),
        }
    );

    if (response.status === 200) {
        resetDone();
        // Swal.fire({
        //     title: "Success",
        //     text: "The password has been reset successfully.",
        //     html: "I will close in <b></b> milliseconds.",
        //     timer: 3000,
        //     timerProgressBar: true,
        //     didOpen: () => {
        //         Swal.showLoading();
        //         const timer = Swal.getPopup().querySelector("b");
        //         timerInterval = setInterval(() => {
        //             timer.textContent = `${Swal.getTimerLeft()}`;
        //         }, 100);
        //     },
        //     willClose: () => {
        //         clearInterval(timerInterval);
        //     }
        // }).then((result) => {
        //     /* Read more about handling dismissals below */
        //     if (result.dismiss === Swal.DismissReason.timer) {
        //         console.log("I was closed by the timer");
        //     }
        // });
        localStorage.removeItem("OTP");
        window.location.href = "shop-login.html";
        
    } else {
        resetWrong();
    }
}





async function goBack1() {
    document.getElementById("resetPasswordOTP").setAttribute("disabled", true);
    document.getElementById("form2-2").setAttribute("disabled", true);
    document.getElementById("form2-1").style.display = "none";
    document.getElementById("form2-3").setAttribute("disabled", true);

    document.getElementById("resetPasswordEmail").removeAttribute('disabled');
    document.getElementById("form1btn").removeAttribute('disabled');
}

async function goBack2() {
    document.getElementById("resetPasswordOTP").removeAttribute('disabled');
    document.getElementById("form2-1").style.display = "block";
    document.getElementById("form2-2").removeAttribute('disabled');
    document.getElementById("form2-3").removeAttribute('disabled');

    document.getElementById("resetPasswordNewPWD").setAttribute("disabled", true);
    document.getElementById("form3-1").setAttribute("disabled", true);
    document.getElementById("form3-2").setAttribute("disabled", true);
}



// toast
iziToast.settings({
    timeout: 3000, // default timeout
    resetOnHover: true,
    // icon: '', // icon class
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
    onOpen: function () {
        console.log('callback abriu!');
    },
    onClose: function () {
        console.log("callback fechou!");
    }
});
async function otpSentDone() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Done',
        message: 'OTP has been to your email!',
        position: 'bottomCenter',
        progressBarColor: '#eaa451',

    });
};

async function otpSentWrong() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-x',
        title: 'Invalid',
        message: 'Please enter a valid email',
        position: 'bottomCenter',
        progressBarColor: 'red',

    });
}


async function OTPCorrect() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Checked',
        message: 'You can now reset your password!',
        position: 'bottomCenter',
        progressBarColor: '#eaa451',

    });
}

async function OTPWrong() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-x',
        title: 'Error',
        message: 'the OTP entered doesn\'t match !',
        position: 'bottomCenter',
        progressBarColor: 'red',

    });
}

async function resetDone() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Done',
        message: 'Password has been changed successfully!',
        position: 'bottomCenter',
        progressBarColor: '#eaa451',

    });
}

async function resetWrong() {
    iziToast.show({
        color: 'dark',
        icon: 'fa fa-check',
        title: 'Strange',
        message: 'somthing went wrong!',
        position: 'bottomCenter',
        progressBarColor: 'red',

    });
}