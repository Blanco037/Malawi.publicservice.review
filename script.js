// Demo mode - replace with real Firebase config later
function submitReview() {
  const service = document.getElementById("service").value;
  const rating = document.getElementById("rating").value;
  
  document.getElementById("confirmation").innerHTML = `
    <span style="color: #002366;">
      ✓ Thank you! Your ${rating}-star review for <b>${service}</b> was recorded.
    </span>
  `;
  
  // For demo purposes only - will connect to Firebase later
  console.log(`Review: ${service} - ${rating} stars`);
}
