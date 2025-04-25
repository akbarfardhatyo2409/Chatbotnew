const API_KEY = 'AIzaSyDw42Xn_RylG2ozkS29ZRk3VvEbUBdBb5U';
const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + API_KEY;

const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Menambahkan pesan ke chatbox
function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  const bubble = document.createElement('span');
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Mengirimkan prompt ke Gemini API
async function sendMessage() {
  const prompt = userInput.value.trim();
  if (!prompt) return;
  appendMessage(prompt, 'user');
  userInput.value = '';

  appendMessage('…thinking…', 'bot');
  const lastBot = chatbox.querySelectorAll('.bot span');
  const loadingElem = lastBot[lastBot.length - 1];

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || res.status);

    const reply = data.contents?.[0]?.parts?.[0]?.text || 'Tidak ada balasan.';
    loadingElem.textContent = reply;
  } catch (err) {
    loadingElem.textContent = 'Error: ' + err.message;
    console.error(err);
  }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });