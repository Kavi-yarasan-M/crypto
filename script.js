import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, update, push, get } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD92KPnoxdMZr_KFl87niN0VaSQ1pK9IOE",
    authDomain: "cryptodata-98d60.firebaseapp.com",
    databaseURL: "https://cryptodata-98d60-default-rtdb.firebaseio.com",
    projectId: "cryptodata-98d60",
    storageBucket: "cryptodata-98d60.firebasestorage.app",
    messagingSenderId: "136587799708",
    appId: "1:136587799708:web:ac4de746fcd83009c49159",
    measurementId: "G-QKY9EX5ZLM"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// List of Coins
if (document.querySelector(".btn")) {
    document.querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const selectedCoin = this.getAttribute("data-coin");
            localStorage.setItem("selectedCoin", selectedCoin);
            window.location.href = "price.html"; // Redirect to details page
        });
    });
}
// Handle User Data Submission (index.html)
function storeUserData() {
    document.getElementById("btn").addEventListener("click", function (e) {
        e.preventDefault();
        // Get Input Values
        const username = document.getElementById("username").value;
        const coin = document.getElementById("coin").value;
        const mail = document.getElementById("mail").value;
        const webnum = document.getElementById("webnum").value;
        const address = document.getElementById("address").value;
        const usercoin= localStorage.getItem("selectedCoin");
        if (!username || coin === "Select" || !mail || !webnum || !address || !usercoin) {
            alert("Please fill all fields and select a coin.");
            return;
        }
        // Store User Data in Firebase
        set(ref(db, 'user/' + username), {
            username: username,
            worth: coin,
            mail: mail,
            num: webnum,
            address: address,
            coin: usercoin // Store the selected coin
        }).then(() => {
            localStorage.setItem("currentuser", username); // Save username for next page
            window.location.href = "payment.html"; // Redirect to Ref ID page
        }).catch((error) => {
            alert("Check your data");
        });
    });
}
//  Handle Ref ID Submission (refid.html)
function updateRefId() {
    document.querySelector(".paybtn").addEventListener("click", function (event) {
        event.preventDefault();
        // Get the Current User
        const currentUser = localStorage.getItem("currentuser");
        if (!currentUser) {
            alert("No user found. Please enter user details first.");
            return;
        }
        // Get the Ref ID Input
        const refid = document.getElementById("refid").value;
        if (!refid) {
            alert("Please enter a valid Ref ID.");
            return;
        }
        //  Push Multiple Ref IDs (For multiple refid entries)
        push(ref(db, 'user/' + currentUser + '/refids'), {
            refid: refid,
            timestamp: new Date().toISOString()
        }).then(() => {
            incrementOrderNumber();
            window.location.href="order.html";
        }).catch((error) => {
            alert("Error adding Ref ID: " + error.message);
        });
    });
}
if (document.getElementById("orderNum")) {
    const orderNum = localStorage.getItem("orderNumber") || 1; // Default to 1 if no order exists
    const orderCoin = localStorage.getItem("selectedCoin") || "No Coin Selected";

    document.getElementById("orderNum").innerText = orderNum;
    document.getElementById("orderCoin").innerText = orderCoin;
}
// Function to Increment Order Number
function incrementOrderNumber() {
    let orderNum = localStorage.getItem("orderNumber") || 0;
    orderNum = parseInt(orderNum) + 1;
    localStorage.setItem("orderNumber", orderNum);
}
//  Detect Page and Run Relevant Function
if (document.getElementById("formgroup")) {
    storeUserData();
} else if (document.getElementById("refidForm")) {
    updateRefId();
}

