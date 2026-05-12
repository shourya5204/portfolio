import './style.css';

// ─── CONFIG ────────────────────────────────────────────────────────
const HF_TOKEN = "YOUR_HF_TOKEN_HERE"; // Replace with your token
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

// ─── NAV SHADOW ON SCROLL ──────────────────────────────────────────
const header = document.querySelector('header');
const bgLayer = document.querySelector('.bg-layer');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── BACKGROUND SPOTLIGHT ──────────────────────────────────────────
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  bgLayer.style.setProperty('--m-x', `${x}%`);
  bgLayer.style.setProperty('--m-y', `${y}%`);
});

// ─── SCROLL REVEAL ─────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target); // fire once only
    }
  });
}, { threshold: 0.08 });

// Section-level reveals
document.querySelectorAll('.section-label, .about-grid, .contact-block')
  .forEach(el => { el.classList.add('reveal'); revealObs.observe(el); });

// Work items — stagger each one individually
document.querySelectorAll('.work-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.07}s`;
  revealObs.observe(el);
});

// ─── CHATBOT TOGGLE ───────────────────────────────────────────────
let open = false;
const toggleBtn = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const closeBtn  = document.getElementById('chat-close');
const chatLog   = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend  = document.getElementById('chat-send');

function toggleChat() {
  open = !open;
  chatPanel.classList.toggle('hidden', !open);
  if (open) setTimeout(() => chatInput.focus(), 300);
}

toggleBtn.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleChat(); });

// ─── CHAT LOGIC (GRADIO API) ──────────────────────────────────────
function addMsg(text, cls) {
  const d = document.createElement('div');
  d.className = `msg ${cls}`;
  d.textContent = text;
  chatLog.appendChild(d);
  chatLog.scrollTop = chatLog.scrollHeight;
  return d;
}

import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// Initialize client once to maintain session/history
let hfClient = null;
async function initClient() {
  if (!hfClient) hfClient = await Client.connect("tellme1212/career_conversation");
  return hfClient;
}

async function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  addMsg(text, 'user');

  const think = addMsg('...', 'bot thinking');

  try {
    const client = await initClient();
    const result = await client.predict("/chat", { 
      message: text,
    });

    think.remove();
    const botReply = result.data[0];
    if (botReply) {
      addMsg(botReply, 'bot');
    } else {
      addMsg("I couldn't get a response. Try again?", 'bot');
    }
  } catch (err) {
    think.textContent = 'Connection error. Try again.';
    console.error(err);
  }
}

chatSend.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
