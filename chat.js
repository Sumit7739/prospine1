"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Select elements once when the script loads
const chatArea = document.querySelector('.chat-area');
const inputField = document.querySelector('.chat-input textarea');
const sendButton = document.querySelector('.chat-input button');
const typingIndicator = document.querySelector('.typing-indicator'); // Select the existing indicator
const apiURL = 'https://magicloops.dev/api/loop/0f02bdbe-b3aa-4c00-bfbf-c1b0150fc576/run';

// --- Event Listeners ---
sendButton.addEventListener('click', sendMessage);
inputField.addEventListener('keyup', (event) => {
    // Allow Shift+Enter for new lines, only send on Enter alone
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent default newline behavior
        sendMessage();
    }
});

// --- Core Functions ---
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const userMessage = inputField.value.trim();
        inputField.value = ''; // Clear input immediately
        inputField.style.height = 'auto'; // Reset height after sending

        if (!userMessage) return; // Don't send empty messages

        displayMessage(userMessage, 'user-message');
        showTypingIndicator(); // Show the indicator

        try {
            const response = yield fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage })
            });

            if (!response.ok) {
                // Handle HTTP errors (like 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = yield response.json();
            const botResponse = data.response || "Sorry, I didn't get a valid response."; // Handle potential empty response

            displayMessage(botResponse, 'bot-message');

        } catch (error) {
            console.error("Error fetching bot response:", error); // Log the actual error
            displayMessage(`Error: Could not retrieve response. ${error.message || ''}`, 'bot-message error-message'); // Show error to user

        } finally {
            hideTypingIndicator(); // Hide indicator whether successful or not
        }
    });
}

function displayMessage(message, cssClass) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', cssClass); // Add base 'message' class and specific type class

    // Sanitize message content slightly (more robust sanitization might be needed depending on source)
    const messageText = document.createElement('p'); // Use <p> for semantic text content
    messageText.textContent = message; // Use textContent to prevent basic HTML injection

    messageElement.appendChild(messageText);
    chatArea.appendChild(messageElement);
    scrollToBottom(); // Scroll after adding message
}

function showTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'flex'; // Or 'block'/'inline-flex' depending on your layout needs
        scrollToBottom(); // Scroll after showing indicator
    }
}

function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
        // Optional: Scroll again after hiding if needed, but usually not necessary here
        // scrollToBottom();
    }
}

function scrollToBottom() {
    // Scrolls the chat area to the latest message
    chatArea.scrollTop = chatArea.scrollHeight;
}

// --- Optional: Auto-resize Textarea ---
inputField.addEventListener('input', () => {
    inputField.style.height = 'auto'; // Reset height
    inputField.style.height = `${inputField.scrollHeight}px`; // Set to content height
});

// --- Initial Setup ---
// Optional: Add the welcome message via JS if you prefer it over HTML
document.addEventListener('DOMContentLoaded', () => {
   displayMessage("Welcome to the ProSpine Chatbot! How can I help you today?", 'bot-message');
});
