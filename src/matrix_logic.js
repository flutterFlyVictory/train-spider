document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    const messagesContainer = $('messages-container');
    const messageInput = $('message-input');
    const roomsList = $('rooms-list-container');
    const activeRoomName = $('active-room-name');
    const commandPalette = $('command-palette');

    // Color palette for user avatars
    const avatarColors = [
        'linear-gradient(135deg, #7c5cfc, #b06cfc)',
        'linear-gradient(135deg, #3ba55d, #5ce08a)',
        'linear-gradient(135deg, #ed4245, #ff6b6b)',
        'linear-gradient(135deg, #faa81a, #ffd66b)',
        'linear-gradient(135deg, #5865f2, #7983f5)',
        'linear-gradient(135deg, #eb459e, #f280b6)',
    ];

    let rooms = [
        { id: 'general', name: 'general' },
        { id: 'dev', name: 'dev' },
        { id: 'design', name: 'design' },
        { id: 'offtopic', name: 'off-topic' },
    ];

    const mockMessages = {
        general: [
            { user: 'Joe', text: 'Hey everyone 👋 Welcome to Train Spider!', time: '12:55 PM' },
            { user: 'Alice', text: 'This client is looking **really** clean.', time: '12:56 PM' },
            { user: 'Joe', text: 'Thanks! Feel free to check out `#dev` for implementation details.', time: '12:57 PM' },
        ],
        dev: [
            { user: 'Bot', text: 'Latest commit: *refactor auth module*', time: '1:00 PM' },
            { user: 'Alice', text: 'The Matrix SDK integration is coming along nicely.', time: '1:02 PM' },
        ],
        design: [
            { user: 'Joe', text: 'Working on the new theme system. Thoughts?', time: '11:30 AM' },
        ],
        offtopic: [
            { user: 'Alice', text: 'Anyone else hyped for the new season? 🎉', time: '2:00 PM' },
        ],
    };

    let currentRoom = rooms[0];

    function init() {
        renderRooms();
        renderMessages(mockMessages[currentRoom.id] || []);
        setupListeners();
    }

    function renderRooms() {
        // Clear existing rooms
        roomsList.textContent = '';

        rooms.forEach(r => {
            const li = document.createElement('li');
            li.className = 'room-item' + (r.id === currentRoom.id ? ' active' : '');
            if (r.id != null) {
                li.dataset.id = String(r.id);
            }
            if (r.name != null) {
                li.title = String(r.name);
            }

            const contentDiv = document.createElement('div');
            contentDiv.style.flexGrow = '1';
            contentDiv.style.display = 'flex';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.overflow = 'hidden';

            const hashSpan = document.createElement('span');
            hashSpan.className = 'room-hash';
            hashSpan.textContent = '#';

            const nameSpan = document.createElement('span');
            nameSpan.style.overflow = 'hidden';
            nameSpan.style.textOverflow = 'ellipsis';
            nameSpan.style.whiteSpace = 'nowrap';
            if (r.name != null) {
                nameSpan.textContent = String(r.name);
            }

            contentDiv.appendChild(hashSpan);
            contentDiv.appendChild(nameSpan);
            li.appendChild(contentDiv);

            if (r.unread) {
                const badge = document.createElement('span');
                badge.className = 'notification-badge';
                badge.style.position = 'static';
                badge.style.marginLeft = '8px';
                badge.style.fontSize = '10px';
                badge.textContent = String(r.unread);
                li.appendChild(badge);
            }

            roomsList.appendChild(li);
        });
    }

    function renderMessages(msgs) {
        messagesContainer.innerHTML = msgs.map(m => buildMessage(m.user, m.text, m.time)).join('');
        scrollToBottom();
    }

    function buildMessage(user, text, time) {
        const colorIdx = hashStr(user) % avatarColors.length;
        return `
        <div class="message">
            <div class="message-avatar" style="background:${avatarColors[colorIdx]}">${user[0]}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="user-name" style="color:${nameColor(user)}">${user}</span>
                    <span class="timestamp">${time || now()}</span>
                </div>
                <div class="message-text">${md(text)}</div>
            </div>
        </div>`;
    }

    function md(t) {
        return t
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    function setupListeners() {
        messageInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const text = messageInput.value.trim();
                if (!text) return;
                const div = document.createElement('div');
                div.innerHTML = buildMessage('You', text);
                messagesContainer.appendChild(div.firstElementChild);
                messageInput.value = '';
                // Save to mock data
                if (!mockMessages[currentRoom.id]) mockMessages[currentRoom.id] = [];
                mockMessages[currentRoom.id].push({ user: 'You', text, time: now() });
                scrollToBottom();
            }
        });

        roomsList.addEventListener('click', e => {
            const item = e.target.closest('.room-item');
            if (!item) return;
            currentRoom = rooms.find(r => r.id === item.dataset.id) || rooms[0];
            activeRoomName.textContent = currentRoom.name;
            messageInput.placeholder = `Message #${currentRoom.name}`;
            renderRooms();
            renderMessages(mockMessages[currentRoom.id] || []);
        });

        // Command palette
        window.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                commandPalette.classList.toggle('hidden');
                if (!commandPalette.classList.contains('hidden')) {
                    commandPalette.querySelector('input').focus();
                }
            }
            if (e.key === 'Escape') commandPalette.classList.add('hidden');
        });

        commandPalette.addEventListener('click', e => {
            if (e.target === commandPalette) commandPalette.classList.add('hidden');
        });

        // Search trigger click
        document.querySelector('.search-bar-trigger')?.addEventListener('click', () => {
            commandPalette.classList.remove('hidden');
            commandPalette.querySelector('input').focus();
        });

        // Server icon switching
        document.querySelectorAll('.servers-sidebar .server-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                document.querySelectorAll('.servers-sidebar .server-icon').forEach(i => i.classList.remove('active'));
                icon.classList.add('active');
            });
        });

        // Titlebar window controls (Tauri 2.0)
        try {
            if (window.__TAURI__) {
                const { getCurrentWindow } = window.__TAURI__.window;
                const appWindow = getCurrentWindow();

                document.getElementById('titlebar-minimize')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    appWindow.minimize();
                });
                document.getElementById('titlebar-maximize')?.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const maximized = await appWindow.isMaximized();
                    maximized ? appWindow.unmaximize() : appWindow.maximize();
                });
                document.getElementById('titlebar-close')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    appWindow.close();
                });
            }
        } catch (e) {
            console.log('Tauri window API not available:', e);
        }

        // Matrix Login Modal Logic
        const matrixModal = $('matrix-login-modal');
        const matrixBtn = $('matrix-login-btn');
        const matrixSkipBtn = $('matrix-skip-btn');
        const matrixStatus = $('matrix-login-status');
        
        // Show login modal nicely on launch
        setTimeout(() => {
            if (matrixModal) matrixModal.classList.remove('hidden');
        }, 300);

        if (matrixSkipBtn) {
            matrixSkipBtn.addEventListener('click', () => {
                matrixModal.classList.add('hidden');
            });
        }

        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && matrixModal && !matrixModal.classList.contains('hidden')) {
                matrixModal.classList.add('hidden');
            }
        });

        if (matrixBtn) {
            matrixBtn.addEventListener('click', async () => {
                const homeserver = $('matrix-homeserver').value.trim();
                const username = $('matrix-username').value.trim();
                const password = $('matrix-password').value.trim();

                if (!homeserver || !username || !password) {
                    matrixStatus.style.color = '#ff6b6b';
                    matrixStatus.textContent = 'Please fill all fields.';
                    return;
                }

                matrixBtn.textContent = 'Logging in...';
                matrixBtn.style.opacity = '0.7';
                matrixBtn.disabled = true;
                matrixStatus.textContent = '';

                try {
                    if (window.__TAURI__) {
                        const { invoke } = window.__TAURI__.core;
                        const result = await invoke('matrix_login', { homeserver, username, password });
                        matrixStatus.style.color = '#5ce08a';
                        matrixStatus.textContent = result;
                        
                        // Immediately fetch live rooms from Matrix
                        matrixBtn.textContent = 'Syncing rooms...';
                        try {
                            const liveRooms = await invoke('matrix_get_rooms');
                            if (liveRooms && liveRooms.length > 0) {
                                rooms = liveRooms.map(lr => ({
                                    id: lr.id,
                                    name: lr.name.length > 28 ? lr.name.substring(0, 25) + '...' : lr.name,
                                    unread: lr.unread_count
                                }));
                                currentRoom = rooms[0];
                                activeRoomName.textContent = currentRoom.name;
                                renderRooms();
                            }
                        } catch (err) {
                            console.error("Failed fetching rooms:", err);
                        }

                        setTimeout(() => matrixModal.classList.add('hidden'), 1500);
                    } else {
                        matrixStatus.style.color = '#ff6b6b';
                        matrixStatus.textContent = 'Tauri API not found. Are you running in browser?';
                    }
                } catch (e) {
                    matrixStatus.style.color = '#ff6b6b';
                    matrixStatus.textContent = e.toString();
                } finally {
                    matrixBtn.textContent = 'Login to Matrix';
                    matrixBtn.style.opacity = '1';
                    matrixBtn.disabled = false;
                }
            });
        }
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }

    function now() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function hashStr(s) {
        let h = 0;
        for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
        return Math.abs(h);
    }

    function nameColor(user) {
        const colors = ['#7c5cfc','#3ba55d','#ed4245','#faa81a','#5865f2','#eb459e','#00b0f4','#fee75c'];
        return colors[hashStr(user) % colors.length];
    }

    init();
});
