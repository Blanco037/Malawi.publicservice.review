function submitReview() {
  // Get form values
  const service = document.getElementById("service").value;
  const rating = document.getElementById("rating").value;

  // Debug: Show captured values (mobile-friendly alert)
  alert("Trying to submit:\nService: " + service + "\nRating: " + rating);

  // Firebase submission
  const db = firebase.firestore();
  db.collection("reviews").add({
    service: service,
    rating: rating,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("✅ Success! Review saved to Firestore.");
    document.getElementById("confirmation").innerHTML = "✓ Review saved!";
  })
  .catch((error) => {
    alert("❌ Firebase Error:\n" + error.message + "\n\nCheck console for details.");
    console.error("Firestore error:", error);
  });
}
