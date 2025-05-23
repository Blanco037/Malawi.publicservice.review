function submitReview() {
  const db = firebase.firestore();
  const service = document.getElementById("service").value;
  const rating = document.getElementById("rating").value;
  
  db.collection("reviews").add({
    service: service,
    rating: rating,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("confirmation").innerHTML = "✓ Review saved!";
  });
}
