// Typing effect text loop
const typingText = document.querySelector('.typing-text');
const words = ["Full stock web Developer", "Web Designer", "AI Enthusiast"];
let wordIndex = 0;
let charIndex = 0;
let typing = true;

function typeEffect() {
  if (typing) {
    if (charIndex < words[wordIndex].length) {
      typingText.textContent += words[wordIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeEffect, 100);
    } else {
      typing = false;
      setTimeout(typeEffect, 2000);
    }
  } else {
    if (charIndex > 0) {
      typingText.textContent = words[wordIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(typeEffect, 50);
    } else {
      typing = true;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeEffect, 500);
    }
  }
}

typeEffect();
