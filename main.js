let ws = null;
const messageLog = document.getElementById('messageLog');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const connectButton = document.getElementById('connectButton');
const connectionStatus = document.getElementById('connectionStatus');
const ipAddressInput = document.getElementById('ipAddress');

function connect() {
    if (ws) {
        ws.close();
        return;
    }

    const ip = ipAddressInput.value;
    if (!ip) {
        alert('Please enter ESP8266 IP address');
        return;
    }

    try {
        ws = new WebSocket(`ws://${ip}:81`);

        ws.onopen = function() {
            connectionStatus.textContent = 'Connected';
            connectionStatus.className = 'status connected';
            messageInput.disabled = false;
            sendButton.disabled = false;
            connectButton.textContent = 'Disconnect';
            logMessage('System', 'Connected to WebSocket server');
        };

        ws.onclose = function() {
            connectionStatus.textContent = 'Disconnected';
            connectionStatus.className = 'status disconnected';
            messageInput.disabled = true;
            sendButton.disabled = true;
            connectButton.textContent = 'Connect';
            ws = null;
            logMessage('System', 'Disconnected from WebSocket server');
        };

        ws.onmessage = function(event) {
            logMessage('Received', event.data); // Logs the received message
        };

        ws.onerror = function(error) {
            logMessage('Error', 'WebSocket error occurred');
            console.error('WebSocket error:', error);
        };

    } catch (error) {
        alert('Error connecting to WebSocket server: ' + error.message);
    }
}

function sendMessage() {
    const message = messageInput.value;
    if (message && ws) {
        ws.send(message);
        logMessage('Sent', message);
        messageInput.value = '';
    }
}

function logMessage(type, message) {
    const entry = document.createElement('div');
    entry.className = `message ${type.toLowerCase()}`;
    entry.textContent = `${type}: ${message}`;
    messageLog.appendChild(entry);
    messageLog.scrollTop = messageLog.scrollHeight; // Scroll to the bottom
}

// Allow sending message with Enter key
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});