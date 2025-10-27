const apiKey = ""; // API key is provided by the canvas environment
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

let currentSourceLanguage = 'Nepalese';

const sourceTextarea = document.getElementById('source-text');
const targetTextarea = document.getElementById('target-text');
const translateButton = document.getElementById('translate-btn');
const statusMessage = document.getElementById('status-message');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const langLabel = document.getElementById('current-lang-label');
const langButtons = document.querySelectorAll('.lang-btn');

/**
* Converts base64 encoded string to ArrayBuffer.
* Utility function required for the API call in this specific environment.
*/
const base64ToArrayBuffer = (base64) => {
const binaryString = atob(base64);
const len = binaryString.length;
const bytes = new Uint8Array(len);
for (let i = 0; i < len; i++) {
bytes[i] = binaryString.charCodeAt(i);
}
return bytes.buffer;
};

/**
* Handles the selection of the source language.
* @param {string} lang 'Nepalese' or 'Sinhalese'
*/
function selectSourceLanguage(lang) {
currentSourceLanguage = lang;
langLabel.textContent = lang;
sourceTextarea.placeholder = `Enter the text in ${lang} here...`;
targetTextarea.value = '';
errorBox.classList.add('hidden');

langButtons.forEach(btn => {
const isSelected = btn.textContent.includes(lang);
if (isSelected) {
btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
btn.classList.add('bg-purple-600', 'text-white', 'hover:bg-purple-700');
} else {
btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
btn.classList.remove('bg-purple-600', 'text-white', 'hover:bg-purple-700');
}
});
}

// Initialize the default selection
window.addEventListener('load', () => selectSourceLanguage('Nepalese'));


/**
* Calls the Gemini API to perform the translation.
* Implements exponential backoff for retries.
* @param {string} text The text to translate.
* @param {string} sourceLang The source language.
* @param {number} attempt Current retry attempt (defaults to 0).
*/
async function translateText(text, sourceLang, attempt = 0) {
const maxRetries = 3;
const systemPrompt = `You are a highly specialized text-to-text machine translation engine. Your task is to accurately translate the provided input text from ${sourceLang} to clear, professional English. Respond ONLY with the translated English text, without any additional commentary, notes, or explanations.`;
const userQuery = text;

const payload = {
contents: [{ parts: [{ text: userQuery }] }],
systemInstruction: { parts: [{ text: systemPrompt }] },
};

try {
const response = await fetch(apiUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});

if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}

const result = await response.json();

// Extract the generated text
const translatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Translation failed or returned empty.';

return translatedText;

} catch (error) {
if (attempt < maxRetries) {
const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
console.warn(`Translation failed (Attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay / 1000}s...`);
await new Promise(resolve => setTimeout(resolve, delay));
return translateText(text, sourceLang, attempt + 1);
} else {
console.error("Translation failed after multiple retries:", error);
throw new Error("Translation service is currently unavailable. Please try again later.");
}
}
}

/**
* Main handler for the translation button click.
*/
async function handleTranslation() {
const sourceText = sourceTextarea.value.trim();
targetTextarea.value = '';
errorBox.classList.add('hidden');

if (!sourceText) {
showError("Please enter some text to translate.");
return;
}

// Set loading state
translateButton.disabled = true;
translateButton.textContent = 'Translating...';
statusMessage.textContent = `Translating from ${currentSourceLanguage} to English...`;
targetTextarea.placeholder = 'Processing...';

try {
const translated = await translateText(sourceText, currentSourceLanguage);
targetTextarea.value = translated;
statusMessage.textContent = 'Translation complete!';
} catch (error) {
showError(error.message);
statusMessage.textContent = 'Translation failed.';
targetTextarea.value = 'Error: Could not complete translation.';
} finally {
// Reset state
translateButton.disabled = false;
translateButton.textContent = 'Translate';
targetTextarea.placeholder = 'Your English translation will appear here...';
}
}

/**
* Displays an error message in the dedicated UI box.
* @param {string} message The error message to display.
*/
function showError(message) {
errorMessage.textContent = message;
errorBox.classList.remove('hidden');
}

// Add event listener for the button
// Expose functions to the global scope so inline onclick handlers in the HTML can call them
// (module scripts are scoped, so inline handlers will otherwise get ReferenceError)
window.selectSourceLanguage = selectSourceLanguage;
window.handleTranslation = handleTranslation;

// Guarded event listener for the translate button (safety if DOM not found)
const _translateBtn = document.getElementById('translate-btn');
if (_translateBtn) {
	_translateBtn.addEventListener('click', handleTranslation);
}
