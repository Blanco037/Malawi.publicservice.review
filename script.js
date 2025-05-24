// ===== AUTHENTICATION ===== //
function quickLogin() {
  const email = document.getElementById("auth-email").value || "test@example.com";
  const password = document.getElementById("auth-password").value || "password123";

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(() => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => alert("Account created automatically!"))
        .catch((error) => alert("Error: " + error.message));
    });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert("Logged out successfully");
    })
    .catch((error) => {
      alert("Logout error: " + error.message);
    });
}

// Auth state listener
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User logged in
    document.getElementById("auth-ui").style.display = "none";
    document.getElementById("review-form").style.display = "block";
    document.getElementById("confirmation").innerHTML = "Logged in as: " + user.email;
  } else {
    // User logged out
    document.getElementById("auth-ui").style.display = "block";
    document.getElementById("review-form").style.display = "none";
    document.getElementById("confirmation").innerHTML = "";
    // Clear form fields
    document.getElementById("auth-email").value = "";
    document.getElementById("auth-password").value = "";
  }
});

// ===== REVIEW SUBMISSION ===== //
function submitReview() {
  if (!firebase.auth().currentUser) {
    alert("Please log in first!");
    return;
  }

  const db = firebase.firestore();
  const service = document.getElementById("service").value;
  const rating = document.getElementById("rating").value;

  db.collection("reviews").add({
    service: service,
    rating: rating,
    user: firebase.auth().currentUser.email,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("confirmation").innerHTML = "✓ Review saved!";
  }).catch((error) => {
    console.error("Error writing document: ", error);
    alert("Failed to save: " + error.message);
  });
  }
