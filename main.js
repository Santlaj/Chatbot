const toggleBtn = document.getElementById('chatbotToggle');
const popup = document.getElementById('chatbotPopup');
const inputField = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatBody = document.getElementById('chatBody');

const closeChat = document.getElementById('closeChat');
const newChatBtn = document.getElementById('newChatBtn');
let restoreTimer;

newChatBtn.addEventListener('click', resetChat);

function resetChat() {
    chatBody.innerHTML = `<p><strong>Bot:</strong> Hi there! How can I help you today?</p>`;
}


closeChat.addEventListener('click', () => {
    popup.classList.remove('show');


});



toggleBtn.addEventListener('click', () => {
    popup.classList.toggle('show');
});

sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    inputField.value = '';

    // Gemini API call (Replace YOUR_API_KEY with your real key)
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });
        const data = await response.json();
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
        appendMessage('Bot', botReply);
    } catch (error) {
        appendMessage('Bot', "Error: " + error.message);
    }
}

function appendMessage(sender, message) {
    const msgDiv = document.createElement('div');
    
    msgDiv.className = sender === 'Bot' ? 'bot-message' : 'user-message';
    msgDiv.textContent = message;

    chatBody.appendChild(msgDiv);
  

    chatBody.scrollTop = chatBody.scrollHeight;
}
