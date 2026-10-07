/* =========================================================
 SpeakMate AI
 Login + Signup + Logout + App Functions
 ========================================================= */


/* =========================
   START LEARNING
   ========================= */

function startLearning() {
    window.location.href = "Signup.html";
}


/* =========================
   SIGN UP
   ========================= */

function signup() {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");

    if (!nameInput || !emailInput || !passwordInput || !confirmInput) {
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;


    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("Please fill all fields.");
        return;
    }


    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return;
    }


    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        passwordInput.focus();
        return;
    }


    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        confirmInput.focus();
        return;
    }


    // Check existing account
    const savedEmail = localStorage.getItem("accountEmail");

    if (savedEmail && savedEmail === email) {
        alert("An account with this email already exists. Please login.");
        window.location.href = "Login.html";
        return;
    }


    // Save account
    localStorage.setItem("accountName", name);
    localStorage.setItem("accountEmail", email);
    localStorage.setItem("accountPassword", password);

    // Profile name
    localStorage.setItem("userName", name);

    // Starting stats
    localStorage.setItem("xp", "0");
    localStorage.setItem("coins", "0");
    localStorage.setItem("streak", "0");

    // Login state
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);


    alert("✅ Account created successfully!");

    window.location.href = "home_special.html";
}


/* =========================
   LOGIN
   ========================= */

function login() {

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
        return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;


    if (email === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }


    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return;
    }


    const savedEmail = localStorage.getItem("accountEmail");
    const savedPassword = localStorage.getItem("accountPassword");


    // No account
    if (!savedEmail || !savedPassword) {

        alert("No account found. Please create an account first.");

        window.location.href = "Signup.html";

        return;
    }


    // Wrong email
    if (email !== savedEmail) {

        alert("Email not found. Please check your email.");

        emailInput.focus();

        return;
    }


    // Wrong password
    if (password !== savedPassword) {

        alert("❌ Incorrect password. Please try again.");

        passwordInput.value = "";

        passwordInput.focus();

        return;
    }


    // Successful login
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);


    if (!localStorage.getItem("userName")) {
        localStorage.setItem(
            "userName",
            localStorage.getItem("accountName") || "Manish"
        );
    }


    if (localStorage.getItem("xp") === null) {
        localStorage.setItem("xp", "0");
    }

    if (localStorage.getItem("coins") === null) {
        localStorage.setItem("coins", "0");
    }

    if (localStorage.getItem("streak") === null) {
        localStorage.setItem("streak", "0");
    }


    alert("✅ Login Successful!");

    window.location.href = "home_special.html";
}


/* =========================
   LOGOUT
   ========================= */

function logoutUser() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
        return;
    }


    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");


    window.location.href = "Login.html";
}


/* Profile uses logout() */

function logout() {
    logoutUser();
}


/* =========================
   LOGIN PROTECTION
   ========================= */

function requireLogin() {

    const loggedIn =
        localStorage.getItem("loggedIn") === "true";


    if (!loggedIn) {

        window.location.href = "Login.html";

        return false;
    }


    return true;
}


/* =========================
   USER NAME
   ========================= */

function getUserName() {

    return (
        localStorage.getItem("userName") ||
        localStorage.getItem("accountName") ||
        "Manish"
    );
}


function saveUserName(name) {

    const cleanName =
        String(name || "").trim();


    if (cleanName !== "") {

        localStorage.setItem(
            "userName",
            cleanName
        );

    }
}


/* =========================
   XP
   ========================= */

function getXP() {

    return Number(
        localStorage.getItem("xp") || 0
    );
}


function addXP(amount) {

    const currentXP = getXP();

    const newXP =
        currentXP + Number(amount || 0);

    localStorage.setItem(
        "xp",
        String(newXP)
    );
}


/* =========================
   COINS
   ========================= */

function getCoins() {

    return Number(
        localStorage.getItem("coins") || 0
    );
}


function addCoins(amount) {

    const currentCoins = getCoins();

    const newCoins =
        currentCoins + Number(amount || 0);

    localStorage.setItem(
        "coins",
        String(newCoins)
    );
}


/* =========================
   NAVIGATION
   ========================= */

function goHome() {

    window.location.href =
        "home_special.html";
}


function goToCourse() {

    window.location.href =
        "course.html";
}


function goToChat() {

    localStorage.setItem(
        "chatUsed",
        "true"
    );

    window.location.href =
        "chat.html";
}


function goToProfile() {

    window.location.href =
        "profile.html";
}


/* =========================
   LOGIN ENTER KEY
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");


        if (!emailInput || !passwordInput) {
            return;
        }


        emailInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    login();
                }

            }
        );


        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    login();
                }

            }
        );

    }
);/* =========================
   SPEAKMATE PREMIUM SYSTEM
========================= */

function getPremiumStorageKey() {

    const email = localStorage.getItem("userEmail");

    if (email) {
        return "premiumActive_" + email;
    }

    return "premiumActive";
}


function isPremiumUser() {

    return localStorage.getItem(
        getPremiumStorageKey()
    ) === "true";

}


function requirePremium(featureName) {

    if (isPremiumUser()) {

        return true;

    }


    const message =
        "👑 " + featureName +
        " is a Premium feature.\n\n" +
        "SpeakMate Premium activate karke " +
        "is feature ko unlock karein.";

    const openPremium =
        confirm(message + "\n\nOpen Premium page?");

    if (openPremium) {

        window.location.href =
            "premium.html";

    }

    return false;
}