import {
    auth,
    provider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "./firebase.js";


const wrapper = document.querySelector(".wrapper");

const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".Register-link");

const loginPopupButton = document.querySelector(".btnLogin-popup");

const closeButtons = document.querySelectorAll(".icon-close");

const loginForm = document.querySelector(".form-box.login form");
const registerForm = document.querySelector(".form-box.register form");

const profileMenu = document.querySelector(".profile-menu");
const profileButton = document.querySelector(".btn-profile");
const profileDropdown = document.querySelector(".profile-dropdown");

const logoutButton = document.querySelector("#logout");


loginPopupButton.addEventListener("click", () => {
    wrapper.classList.add("active-popup");
});


closeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        wrapper.classList.remove("active-popup");
        wrapper.classList.remove("active");

    });

});



registerLink.addEventListener("click", (event) => {

    event.preventDefault();

    wrapper.classList.add("active");

});


loginLink.addEventListener("click", (event) => {

    event.preventDefault();

    wrapper.classList.remove("active");

});


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("Login successful!");

        wrapper.classList.remove("active-popup");
        wrapper.classList.remove("active");

    } catch (error) {

        console.error("Login error:", error);

        alert(getFirebaseErrorMessage(error));

    }

});


registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const usernameInput = registerForm.querySelector(
        'input[type="text"]'
    );

    const emailInput = registerForm.querySelector(
        'input[type="email"]'
    );

    const passwordInput = registerForm.querySelector(
        'input[type="password"]'
    );

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        // Save username to Firebase Authentication
        await updateProfile(user, {
            displayName: username
        });

        console.log("Registration successful!");

        wrapper.classList.remove("active-popup");
        wrapper.classList.remove("active");

        registerForm.reset();

    } catch (error) {

        console.error("Registration error:", error);

        alert(getFirebaseErrorMessage(error));

    }

});


const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);

        console.log("Google login successful!");

        wrapper.classList.remove("active-popup");
        wrapper.classList.remove("active");

    } catch (error) {
        console.error("Google login error:", error);
        console.log("Firebase error code:", error.code);
        console.log("Firebase error message:", error.message);
        alert(getFirebaseErrorMessage(error));
    }
});


document.addEventListener("click", (event) => {

    if (
        !profileMenu.contains(event.target)
    ) {

        profileDropdown.style.display = "none";

    }

});


logoutButton.addEventListener("click", async (event) => {

    event.preventDefault();

    try {

        await signOut(auth);

        profileDropdown.style.display = "none";

        console.log("Logged out successfully!");

    } catch (error) {

        console.error("Logout error:", error);

        alert("Could not log out.");

    }

});


onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("User is logged in.");

        console.log("Name:", user.displayName);
        console.log("Email:", user.email);
        console.log("Photo:", user.photoURL);

        loginPopupButton.style.display = "none";

        profileMenu.style.display = "block";

        if (user.displayName) {

            profileButton.textContent =
                user.displayName;

        } else {

            profileButton.textContent =
                "My Profile";

        }

    } else {

        console.log("No user logged in.");

        loginPopupButton.style.display =
            "inline-block";

        profileMenu.style.display = "none";

        profileDropdown.style.display = "none";

    }

});


function getFirebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/invalid-credential":
            return "Email or password is incorrect.";

        case "auth/invalid-email":
            return "Please enter a valid email.";

        case "auth/user-not-found":
            return "No account was found with this email.";

        case "auth/wrong-password":
            return "The password is incorrect.";

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/weak-password":
            return "Password must be at least 6 characters.";

        case "auth/popup-closed-by-user":
            return "Google login was cancelled.";

        case "auth/popup-blocked":
            return "Your browser blocked the Google login popup.";

        default:
            return "Something went wrong. Please try again.";

    }

}
