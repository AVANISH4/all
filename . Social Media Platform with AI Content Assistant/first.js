// Smooth scroll effect
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Simple alert on "Hire Me" button
document.getElementById("hireBtn").addEventListener("click", () => {
  alert("Thank you for showing interest! Let's connect via email.");
});
