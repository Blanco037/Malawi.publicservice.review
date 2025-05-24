// ===== USSD SIMULATION ===== //
let ussdState = 0;
let selectedService = "";

function handleUSSD() {
  const input = document.getElementById("ussd-input").value.trim();
  const responseDiv = document.getElementById("ussd-response");
  
  // Clear input
  document.getElementById("ussd-input").value = "";

  // USSD State Machine
  switch(ussdState) {
    case 0: // Main menu
      if (input === "1") {
        responseDiv.innerHTML = "CON Select service:\n1. Healthcare\n2. Education\n3. Transport";
        ussdState = 1;
      } 
      else if (input === "2") {
        fetchRatings();
      }
      else {
        responseDiv.innerHTML = "END Invalid choice";
      }
      break;

    case 1: // Service selection
      if (["1","2","3"].includes(input)) {
        const services = ["Healthcare", "Education", "Transport"];
        selectedService = services[parseInt(input)-1];
        responseDiv.innerHTML = "CON Rate " + selectedService + ":\n1. ★☆☆☆☆ (Poor)\n2. ★★★☆☆ (Average)\n3. ★★★★★ (Excellent)";
        ussdState = 2;
      }
      else {
        responseDiv.innerHTML = "END Invalid service";
        ussdState = 0;
      }
      break;

    case 2: // Rating selection
      if (["1","2","3"].includes(input)) {
        const rating = input === "1" ? 1 : input === "2" ? 3 : 5;
        submitUSSDReview(selectedService, rating);
        responseDiv.innerHTML = "END Thank you for rating " + selectedService + "!";
        ussdState = 0;
      }
      else {
        responseDiv.innerHTML = "END Invalid rating";
        ussdState = 0;
      }
      break;
  }
}

function submitUSSDReview(service, rating) {
  firebase.firestore().collection("reviews").add({
    service: service,
    rating: rating,
    source: "USSD",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    console.log("USSD review saved");
  });
}

function fetchRatings() {
  firebase.firestore().collection("reviews")
    .orderBy("timestamp", "desc")
    .limit(3)
    .get()
    .then((snapshot) => {
      let response = "END Recent Ratings:\n";
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        response += `${data.service}: ${'★'.repeat(data.rating)}\n`;
      });
      document.getElementById("ussd-response").innerHTML = response;
    });
}

// ===== WEB FORM ===== //
function submitReview() {
  const service = document.getElementById("service").value;
  const rating = document.getElementById("rating").value;

  firebase.firestore().collection("reviews").add({
    service: service,
    rating: parseInt(rating),
    source: "Web",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("confirmation").innerHTML = "✓ Thank you!";
  });
}

// Toggle between USSD/Web (for demo)
function toggleInterface() {
  const ussd = document.getElementById("ussd-demo");
  const web = document.getElementById("web-form");
  ussd.style.display = ussd.style.display === "none" ? "block" : "none";
  web.style.display = web.style.display === "none" ? "block" : "none";
}
