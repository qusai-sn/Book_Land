async function addNewsletter() {
  event.preventDefault(); // Prevent the default form submission
  debugger; // Pause execution for debugging

  const form = document.getElementById("newsletterForm"); // Get the form element
  const formData = new FormData(form); // Create FormData object from the form

  let url = "https://localhost:44301/api/Newsletter"; // API endpoint
  let request = await fetch(url, {
    method: "POST", // Set request method to POST
    body: formData, // Attach the FormData object to the request body
  });
  debugger; // Pause execution for debugging

  if (request.ok) {
    // Check if request was successful
    const result = await request.json(); // Parse response JSON
    console.log(result); // Log the result to the console
    Swal.fire({
      icon: "success",
      title: "Subscription Successful",
      text: "Your email has been successfully added!",
      confirmButtonText: "OK",
    });
    // Optional: Redirect or clear form
    // window.location.href = "/frontend/somepage.html";
    // form.reset();
  } else {
    const error = await request.json();
    console.error("Failed to subscribe:", error);
    Swal.fire({
      icon: "error",
      title: "Subscription Failed",
      text: "An error occurred while subscribing. Please try again.",
      confirmButtonText: "OK",
    });
  }
}

document
  .getElementById("newsletterForm")
  .addEventListener("submit", addNewsletter);