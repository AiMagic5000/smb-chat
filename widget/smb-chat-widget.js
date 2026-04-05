(function () {
  'use strict';

  const WIDGET_VERSION = '5.0.0';

  // Find the script tag to get config
  const scriptTag = document.currentScript || document.querySelector('script[data-bot-id]');
  if (!scriptTag) return;

  const BOT_ID = scriptTag.getAttribute('data-bot-id');
  if (!BOT_ID) { console.error('[SMB Chat] Missing data-bot-id'); return; }

  const API_BASE = scriptTag.getAttribute('data-api') || window.location.origin;

  // State
  let isOpen = false;
  let conversationId = null;
  let messages = [];
  let config = null;
  let isLoading = false;
  let leadCaptured = false;

  // Styles
  const CSS = `
    #smb-chat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #smb-chat-launcher { position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s; z-index: 99999; }
    #smb-chat-launcher:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
    #smb-chat-launcher svg { width: 24px; height: 24px; fill: white; }
    #smb-chat-window { position: fixed; bottom: 88px; right: 20px; width: 380px; max-height: 560px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); display: none; flex-direction: column; z-index: 99999; overflow: hidden; border: 1px solid #e5e7eb; }
    #smb-chat-window.open { display: flex; }
    #smb-chat-header { padding: 16px; display: flex; align-items: center; justify-content: space-between; }
    #smb-chat-header h3 { font-size: 15px; font-weight: 600; color: white; }
    #smb-chat-header button { background: none; border: none; color: white; cursor: pointer; padding: 4px; opacity: 0.8; }
    #smb-chat-header button:hover { opacity: 1; }
    #smb-chat-messages { flex: 1; overflow-y: auto; padding: 16px; background: #f9fafb; min-height: 300px; max-height: 380px; }
    .smb-msg { margin-bottom: 12px; max-width: 85%; }
    .smb-msg-user { margin-left: auto; }
    .smb-msg-bot { margin-right: auto; }
    .smb-msg-bubble { padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; word-wrap: break-word; }
    .smb-msg-user .smb-msg-bubble { border-bottom-right-radius: 4px; color: white; }
    .smb-msg-bot .smb-msg-bubble { background: white; color: #1f2937; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }
    .smb-msg-system .smb-msg-bubble { background: #fef3c7; color: #92400e; font-size: 12px; text-align: center; max-width: 100%; }
    #smb-chat-input-area { padding: 12px 16px; border-top: 1px solid #e5e7eb; background: white; display: flex; gap: 8px; }
    #smb-chat-input { flex: 1; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 14px; outline: none; resize: none; }
    #smb-chat-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
    #smb-chat-send { border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 14px; font-weight: 500; color: white; transition: opacity 0.2s; }
    #smb-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
    .smb-typing { display: flex; gap: 4px; padding: 10px 14px; }
    .smb-typing span { width: 6px; height: 6px; border-radius: 50%; background: #9ca3af; animation: smb-bounce 1.4s infinite; }
    .smb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .smb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes smb-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }
    #smb-chat-lead-form { padding: 16px; background: white; }
    #smb-chat-lead-form input { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 14px; margin-bottom: 8px; outline: none; }
    #smb-chat-lead-form input:focus { border-color: #3b82f6; }
    #smb-chat-lead-form button { width: 100%; border: none; border-radius: 8px; padding: 10px; font-size: 14px; font-weight: 500; color: white; cursor: pointer; }
    #smb-chat-lead-form p { font-size: 12px; color: #6b7280; margin-bottom: 12px; }
    #smb-chat-footer { padding: 8px; text-align: center; background: white; border-top: 1px solid #f3f4f6; }
    #smb-chat-footer a { font-size: 11px; color: #9ca3af; text-decoration: none; }
    .smb-feedback { display: flex; gap: 4px; margin-top: 4px; }
    .smb-feedback button { background: none; border: 1px solid #e5e7eb; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 12px; color: #6b7280; }
    .smb-feedback button:hover { background: #f3f4f6; }
    .smb-feedback button.active { border-color: #3b82f6; color: #3b82f6; }
    #smb-chat-actions { display: flex; gap: 8px; padding: 0 16px 8px; background: #f9fafb; }
    #smb-chat-actions button { font-size: 12px; color: #6b7280; background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 4px 10px; cursor: pointer; }
    #smb-chat-actions button:hover { background: #f3f4f6; }
  `;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function createWidget() {
    const container = document.createElement('div');
    container.id = 'smb-chat-widget';

    const primaryColor = config?.accent_color || '#2563eb';
    const headerBg = primaryColor;
    const position = config?.position || 'bottom-right';
    const botName = config?.header_title || config?.name || 'AI Assistant';
    const greeting = config?.greeting_message || 'Hi! How can I help you?';

    container.innerHTML = `
      <div id="smb-chat-window" style="background:white;">
        <div id="smb-chat-header" style="background:${headerBg};">
          <h3>${escapeHtml(botName)}</h3>
          <div style="display:flex;gap:4px;">
            <button id="smb-chat-handoff" title="Talk to human">&#128100;</button>
            <button id="smb-chat-close" title="Close">&times;</button>
          </div>
        </div>
        <div id="smb-chat-messages"></div>
        <div id="smb-chat-actions">
          <button id="smb-chat-end-btn">End Chat</button>
        </div>
        <div id="smb-chat-input-area">
          <input id="smb-chat-input" type="text" placeholder="Type a message..." autocomplete="off" />
          <button id="smb-chat-send" style="background:${primaryColor};">Send</button>
        </div>
        ${config?.show_branding === false ? '' : '<div id="smb-chat-footer"><a href="https://startmybusiness.us" target="_blank">Powered by SMB Chat</a></div>'}
      </div>
      <button id="smb-chat-launcher" style="background:${primaryColor};">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </button>
    `;

    document.body.appendChild(container);

    // Position
    const launcher = document.getElementById('smb-chat-launcher');
    const chatWindow = document.getElementById('smb-chat-window');
    if (position === 'bottom-left') {
      launcher.style.left = '20px';
      launcher.style.right = 'auto';
      chatWindow.style.left = '20px';
      chatWindow.style.right = 'auto';
    }

    // Event listeners
    launcher.addEventListener('click', toggleChat);
    document.getElementById('smb-chat-close').addEventListener('click', toggleChat);
    document.getElementById('smb-chat-send').addEventListener('click', sendMessage);
    document.getElementById('smb-chat-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    document.getElementById('smb-chat-handoff').addEventListener('click', requestHandoff);
    document.getElementById('smb-chat-end-btn').addEventListener('click', endChat);

    // Show greeting
    addMessage('bot', greeting);
  }

  function toggleChat() {
    isOpen = !isOpen;
    const win = document.getElementById('smb-chat-window');
    win.classList.toggle('open', isOpen);

    if (isOpen && !conversationId) {
      startSession();
    }
  }

  async function startSession() {
    try {
      const res = await fetch(API_BASE + '/api/widget/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_id: BOT_ID }),
      });
      const data = await res.json();
      if (data.success) {
        conversationId = data.data.conversation_id;
        // Show lead capture if configured
        if (config?.require_lead_capture && !leadCaptured) {
          showLeadForm();
        }
      }
    } catch (err) {
      console.error('[SMB Chat] Session error:', err);
    }
  }

  function showLeadForm() {
    const messagesEl = document.getElementById('smb-chat-messages');
    const form = document.createElement('div');
    form.id = 'smb-chat-lead-form';
    const primaryColor = config?.accent_color || '#2563eb';
    form.innerHTML = `
      <p>Please share your info so we can help you better:</p>
      <input type="text" id="smb-lead-name" placeholder="Your name" />
      <input type="email" id="smb-lead-email" placeholder="Email address" />
      <input type="tel" id="smb-lead-phone" placeholder="Phone (optional)" />
      <button style="background:${primaryColor};">Start Chat</button>
    `;
    messagesEl.parentNode.insertBefore(form, messagesEl.nextSibling);
    form.querySelector('button').addEventListener('click', submitLead);
  }

  async function submitLead() {
    const name = document.getElementById('smb-lead-name').value.trim();
    const email = document.getElementById('smb-lead-email').value.trim();
    const phone = document.getElementById('smb-lead-phone').value.trim();

    if (!email) { alert('Email is required'); return; }

    try {
      await fetch(API_BASE + '/api/widget/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId, name, email, phone }),
      });
      leadCaptured = true;
      const form = document.getElementById('smb-chat-lead-form');
      if (form) form.remove();
    } catch (err) {
      console.error('[SMB Chat] Lead error:', err);
    }
  }

  async function sendMessage() {
    const input = document.getElementById('smb-chat-input');
    const text = input.value.trim();
    if (!text || isLoading) return;

    input.value = '';
    addMessage('user', text);
    showTyping();
    isLoading = true;

    try {
      const res = await fetch(API_BASE + '/api/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_id: BOT_ID,
          conversation_id: conversationId,
          message: text,
        }),
      });
      const data = await res.json();
      hideTyping();

      if (data.success) {
        addMessage('bot', data.data.response || data.data.reply, data.data.message_id);
        if (data.data.conversation_id) conversationId = data.data.conversation_id;
      } else {
        addMessage('bot', data.error || 'Sorry, something went wrong. Please try again.');
      }
    } catch (err) {
      hideTyping();
      addMessage('bot', 'Connection error. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  function addMessage(role, content, messageId) {
    const messagesEl = document.getElementById('smb-chat-messages');
    const wrapper = document.createElement('div');
    wrapper.className = 'smb-msg smb-msg-' + role;

    const bubble = document.createElement('div');
    bubble.className = 'smb-msg-bubble';
    if (role === 'user') {
      bubble.style.background = config?.accent_color || '#2563eb';
    }
    bubble.textContent = content;
    wrapper.appendChild(bubble);

    // Feedback buttons for bot messages
    if (role === 'bot' && messageId) {
      const feedback = document.createElement('div');
      feedback.className = 'smb-feedback';
      feedback.innerHTML = '<button data-rating="positive">&#128077;</button><button data-rating="negative">&#128078;</button>';
      feedback.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          submitFeedback(messageId, btn.dataset.rating);
          feedback.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
        });
      });
      wrapper.appendChild(feedback);
    }

    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    messages.push({ role: role, content: content, timestamp: new Date().toISOString() });
  }

  async function submitFeedback(messageId, rating) {
    try {
      await fetch(API_BASE + '/api/widget/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId,
          conversation_id: conversationId,
          rating: rating,
        }),
      });
    } catch (err) {
      console.error('[SMB Chat] Feedback error:', err);
    }
  }

  async function requestHandoff() {
    if (!conversationId) return;
    try {
      await fetch(API_BASE + '/api/widget/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId }),
      });
      addMessage('system', 'You have been connected to a live agent. Please wait for a response.');
    } catch (err) {
      addMessage('system', 'Unable to connect to a live agent right now.');
    }
  }

  async function endChat() {
    if (!conversationId) return;
    try {
      await fetch(API_BASE + '/api/widget/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId, transcript: messages }),
      });
      addMessage('system', 'Chat ended. Thank you!');
      document.getElementById('smb-chat-input').disabled = true;
      document.getElementById('smb-chat-send').disabled = true;
    } catch (err) {
      console.error('[SMB Chat] End chat error:', err);
    }
  }

  function showTyping() {
    const messagesEl = document.getElementById('smb-chat-messages');
    const typing = document.createElement('div');
    typing.id = 'smb-chat-typing';
    typing.className = 'smb-msg smb-msg-bot';
    typing.innerHTML = '<div class="smb-msg-bubble"><div class="smb-typing"><span></span><span></span><span></span></div></div>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('smb-chat-typing');
    if (el) el.remove();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Init
  async function init() {
    try {
      const res = await fetch(API_BASE + '/api/widget/config/' + BOT_ID);
      const data = await res.json();
      if (data.success) config = data.data;
    } catch (err) {
      console.error('[SMB Chat] Config error:', err);
    }

    injectStyles();
    createWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
