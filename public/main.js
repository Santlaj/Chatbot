

const popup = document.getElementById('chatbotPopup');
const inputField = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatBody = document.getElementById('chatBody');
const closeChat = document.getElementById('closeChat');
const newChatBtn = document.getElementById('newChatBtn');
const toggleBtn = document.getElementById('chatbotToggle');

let restoreTimer;

newChatBtn.addEventListener('click', resetChat);

function resetChat() {
    chatBody.innerHTML = '';
    appendMessage('Bot', 'Hi there! How can I help you today?');
}

closeChat.addEventListener('click', () => {
    popup.classList.remove('show');
});

toggleBtn.addEventListener('click', () => {
    popup.classList.toggle('show');
});

sendBtn.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function cleanText(text) {
    return text
        .replace(/\*\*/g, "")   // remove bold markers
        .replace(/\*/g, "")     // remove list asterisks
        .replace(/#+/g, "")     // remove markdown headers
        .trim();
}

// const allowedKeywords = ["Findify", "search", "recommendation", "personalization", "analytics"];




async function sendMessage() {
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    appendMessage('User', userMessage);
    inputField.value = '';
    inputField.focus();

    // if (!allowedKeywords.some(word => userMessage.toLowerCase().includes(word.toLowerCase()))) {
    //     appendMessage('Bot', "Sorry, I only answer questions about Findify.");
    //     return;
    // }

    try {
        const response = await fetch("/api/chat", {   // 👈 call backend instead of Gemini
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMessage })
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        const botReply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't understand that.";
        const botCleanReply = cleanText(botReply);
        appendMessage("Bot", botCleanReply);
    } catch (error) {
        appendMessage("Bot", "Please try again later. " + error.message);
    }
}


// async function sendMessage() {
//     const userMessage = inputField.value.trim();
//     if (!userMessage) return;

//     appendMessage('User', userMessage);
//     inputField.value = '';
//     inputField.focus();

// if (!allowedKeywords.some(word => userMessage.toLowerCase().includes(word.toLowerCase()))) {
//         appendMessage('Bot', "Sorry, I only answer questions about Findify.");
//         return;
//     }
    

//     // const API_KEY = "hgvythv6tcgd_gbiub7"; // 👈 replace with your real Gemini key
//     // const MODEL = "gemini-2.5-flash";

//     try {
//         const response = await fetch( "/api/chat",
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     contents: [{ parts: [{ text:'You are a helpful assistant. Do not generate any code, scripts, or programming examples. Do not provide code blocks or syntax highlighting. Just provide natural language answers. userMessage' }] }],
//                     generationConfig: {
//                         thinkingConfig: {
//                             thinkingBudget: 0
//                         }
//                     }
//                 })
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
//         }

//         const data = await response.json();
//         const botReply =
//             data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//             "Sorry, I couldn't understand that.";
//         const botCleanReply=cleanText(botReply);
//         appendMessage("Bot", botCleanReply);
//     } catch (error) {
//         appendMessage("Bot", "Please try again Later, Sorry for Inconvenience" + error.message);
//     }
// }


function appendMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'Bot' ? 'bot-message' : 'user-message';
    msgDiv.textContent = message;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}