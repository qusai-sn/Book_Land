//  debugger




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAv5vCoLdqubm_IJAOjNlgF7o9zo-1-VfE",
  authDomain: "login-3e8e4.firebaseapp.com",
  projectId: "login-3e8e4",
  storageBucket: "login-3e8e4.appspot.com",
  messagingSenderId: "251369161445",
  appId: "1:251369161445:web:ef0c157a6b0cdcdb1a0a0c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-login-btn");
if (googleLogin) {
    googleLogin.addEventListener("click", async function () {
      try {
        console.log("Button clicked, attempting login...");
        const result = await signInWithPopup(auth, provider);
  
        const user = result.user;
        console.log("User:", user);
        
        localStorage.setItem('GoogleUser', JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }));


        addgoogleUser();
        
        // console.log(localStorage.getItem('GoogleUser'));
        // console.log(JSON.parse(localStorage.getItem('GoogleUser')));

  
        // window.location.href = "books-list.html";
      } catch (error) {
        console.error("Error during login:", error);
        alert("Error during login. Please try again.");
      }
    });
} else {
    console.error("Login button not found");
}


function getFromLocal()
{
          let googleUser = JSON.parse(localStorage.getItem("GoogleUser"));
        if (!googleUser) {
            throw new Error("Google user not found in local storage");
        }

        console.log("Sending data:", {
          name: googleUser.displayName,
          email: googleUser.email,
          image: googleUser.photoURL,
      });

      localStorage.setItem("GName",googleUser.displayName);
      localStorage.setItem("GEmail",googleUser.email);
      localStorage.setItem("GImg",googleUser.photoURL);
};


async function addgoogleUser() {
  // debugger

   getFromLocal();

        const googleLoginURL = "https://localhost:7198/api/LoginAndRegister/GoogleLogin";

        const GName = localStorage.getItem("GName");
        const GEmail = localStorage.getItem("GEmail");
        const GImg = localStorage.getItem("GImg");

        const response = await fetch(googleLoginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: GName,
                email: GEmail,
                image: GImg,
            }),
        });

        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "Huh!",
                text: "Failed to login via Google",
                footer: 'throw new Error(" Error : " + response.statusText)'
              });
        }

        const token = await response.text();
        console.log("Token received:", token);

        // Save token to local storage or proceed as needed
        localStorage.setItem("jwtToken", token);

        localStorage.removeItem("GName");
        localStorage.removeItem("GEmail");
        localStorage.removeItem("GImg");
}

