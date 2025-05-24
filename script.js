// ===== AUTHENTICATION ===== //
function quickLogin() {
  const email = document.getElementById("auth-email").value || "test@example.com";
  const password = document.getElementById("auth-password").value || "password123";

  // Try login, fallback to signup
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(() => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => alert("Account created automatically!"))
        .catch((error) => alert("Error: " + error.message));
    });
}

// Show/hide UI based on auth state
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("auth-ui").style.display = "none";
    document.getElementById("review-form").style.display = "block";
    document.getElementById("confirmation").innerHTML = "Logged in as: " + user.email;
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
    user: firebase.auth().currentUser.email, // Track who submitted
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("confirmation").innerHTML = "✓ Review saved!";
  }).catch((error) => {
    console.error("Error writing document: ", error);
    alert("Failed to save: " + error.message);
  });
}
