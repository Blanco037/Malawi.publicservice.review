// ===== AUTHENTICATION ===== //
function handleLogin() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      alert("Login error: " + error.message);
    });
}

function handleSignup() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      alert("Signup error: " + error.message);
    });
}

function logout() {
  firebase.auth().signOut();
}

// Auth state listener
firebase.auth().onAuthStateChanged((user) => {
  const authUI = document.getElementById("auth-ui");
  const reviewForm = document.getElementById("review-form");

  if (user) {
    authUI.style.display = "none";
    reviewForm.style.display = "block";
    document.getElementById("confirmation").textContent = "Logged in as: " + user.email;
  } else {
    authUI.style.display = "block";
    reviewForm.style.display = "none";
  }
});

// ===== REVIEW SUBMISSION ===== //
function submitReview() {
  const db = firebase.firestore();
  const service = document.getElementById("service").value;
  const rating = document.getElementById("rating").value;

  db.collection("reviews").add({
    service: service,
    rating: parseInt(rating),
    user: firebase.auth().currentUser.email,
    source: "web",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("confirmation").textContent = "✓ Review submitted!";
  });
}

// ===== USSD SIMULATION ===== //
let ussdState = 0;
let selectedService = "";

function handleUSSD() {
  const input = document.getElementById("ussd-input").value.trim();
  const responseDiv = document.getElementById("ussd-response");
  
  document.getElementById("ussd-input").value = "";

  switch(ussdState) {
    case 0: // Main menu
      if (input === "1") {
        responseDiv.textContent = "CON Select service:\n1. Healthcare\n2. Education\n3. Transport";
        ussdState = 1;
      } 
      else if (input === "2") {
        fetchRatings();
      }
      else {
        responseDiv.textContent = "END Invalid choice";
      }
      break;

    case 1: // Service selection
      if (["1","2","3"].includes(input)) {
        const services = ["Healthcare", "Education", "Transport"];
        selectedService = services[parseInt(input)-1];
        responseDiv.textContent = `CON Rate ${selectedService}:\n1. ★☆☆☆☆ (Poor)\n2. ★★★☆☆ (Average)\n3. ★★★★★ (Excellent)`;
        ussdState = 2;
      }
      else {
        responseDiv.textContent = "END Invalid service";
        ussdState = 0;
      }
      break;

    case 2: // Rating selection
      if (["1","2","3"].includes(input)) {
        const rating = input === "1" ? 1 : input === "2" ? 3 : 5;
        submitUSSDReview(selectedService, rating);
        responseDiv.textContent = `END Thank you for rating ${selectedService}!`;
        ussdState = 0;
      }
      else {
        responseDiv.textContent = "END Invalid rating";
        ussdState = 0;
      }
      break;
  }
}

function submitUSSDReview(service, rating) {
  firebase.firestore().collection("reviews").add({
    service: service,
    rating: rating,
    source: "ussd",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
      document.getElementById("ussd-response").textContent = response;
    });
}

// ===== INTERFACE TOGGLING ===== //
function toggleInterface() {
  document.getElementById("web-interface").style.display = "none";
  document.getElementById("ussd-interface").style.display = "block";
  document.getElementById("switch-mode").style.display = "none";
}

function switchToWeb() {
  document.getElementById("ussd-interface").style.display = "none";
  document.getElementById("web-interface").style.display = "block";
  document.getElementById("switch-mode").style.display = "block";
                          }
