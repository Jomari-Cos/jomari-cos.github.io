document.addEventListener('DOMContentLoaded', () => {
      initThemeToggle();
      initHamburgerMenu();
      initBackToTop();
      initCarousel();
      initImageCarousels();
      initScrollAnimations();
      initContactForm();
      initTypingAnimation();
    });

    /* ===== OpenAI ChatBot ===== */
    (function initChatBot() {
        const API_ENDPOINT = '/api/chat'; // Vercel serverless function endpoint

        // Wait for DOM to be fully loaded
        function initializeChatBot() {
            // DOM
            const widget      = document.getElementById('chatbot-widget');
            const toggleBtn   = document.getElementById('chatbotToggle');
            const chatBox     = document.getElementById('chatbotBox');
            const closeBtn    = document.getElementById('chatbotClose');
            const messagesEl  = document.getElementById('chatbotMessages');
            const inputEl     = document.getElementById('chatbotInput');
            const sendBtn     = document.getElementById('chatbotSend');

            // Return early if elements aren't found
            if (!widget || !toggleBtn || !chatBox || !closeBtn || !messagesEl || !inputEl || !sendBtn) {
                console.warn('ChatBot elements not found in DOM');
                return;
            }

            // State
            let isOpen   = false;
            let isTyping = false;
            let history  = [];

            // --- ui helpers ---
            function openChat() {
                isOpen = true;
                chatBox.classList.add('open');
                setTimeout(() => inputEl.focus(), 300);
            }

            function closeChat() {
                isOpen = false;
                chatBox.classList.remove('open');
            }

            function addMessage(text, type) {
                const div      = document.createElement('div');
                div.className  = 'message ' + (type === 'bot' ? 'bot-message' : 'user-message');
                div.textContent = text;
                messagesEl.appendChild(div);
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }

            function showTyping() {
                const el = document.createElement('div');
                el.className = 'chatbot-typing';
                el.id = 'chatbotTyping';
                el.textContent = 'AI is typing';
                messagesEl.appendChild(el);
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }

            function removeTyping() {
                document.getElementById('chatbotTyping')?.remove();
            }

            // --- ChatBot API call ---
            async function getBotReply(userMessage) {
                try {
                    const resp = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: history }),
                    });

                    if (!resp.ok) {
                        throw new Error(`HTTP ${resp.status}`);
                    }

                    const data = await resp.json();
                    return data.reply ?? 'Sorry, I could not generate a response.';
                } catch (err) {
                    console.error('ChatBot API error:', err);
                    throw new Error('Failed to get response from chatbot');
                }
            }

            async function sendMessage() {
                const text = inputEl.value.trim();
                if (!text || isTyping) return;

                inputEl.value = '';
                addMessage(text, 'user');
                history.push({ role: 'user', content: text });

                isTyping = true;
                showTyping();

                try {
                    const reply = await getBotReply(text);
                    removeTyping();
                    addMessage(reply, 'bot');
                    history.push({ role: 'assistant', content: reply });
                } catch (err) {
                    removeTyping();
                    addMessage('Oops! Something went wrong. Please try again.', 'bot');
                    console.error(err);
                } finally {
                    isTyping = false;
                }
            }

            // --- Event listeners ---
            toggleBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
            closeBtn.addEventListener('click', closeChat);

            sendBtn.addEventListener('click', sendMessage);
            inputEl.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

            // Close on outside click
            document.addEventListener('click', e => {
                if (isOpen && !widget.contains(e.target)) closeChat();
            });
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeChatBot);
        } else {
            initializeChatBot();
        }
    })();