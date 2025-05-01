// Connect to the Socket.io server
const socket = io('http://localhost:7000');

// Get DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Sound effects (optional)
const messageSentSound = new Audio('https://cdn.freesound.org/previews/320/320654_5432081-lq.mp3');
const messageReceivedSound = new Audio('https://cdn.freesound.org/previews/235/235911_4187024-lq.mp3');

// Function to append messages
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    // Scroll to the latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
    // Play sound based on message type
    if (position === 'right') {
        messageSentSound.volume = 0.2;
        messageSentSound.play();
    } else if (position === 'left') {
        messageReceivedSound.volume = 0.2;
        messageReceivedSound.play();
    }
}

// Function to add system messages
const addSystemMessage = (message) => {
    const systemMessageElement = document.createElement('div');
    systemMessageElement.innerText = message;
    systemMessageElement.classList.add('system-message');
    messageContainer.append(systemMessageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Ask for username when page loads
let name = '';
while (!name.trim()) {
    name = prompt("Enter your name to join the chat:");
    if (name === null) {
        name = 'Guest-' + Math.floor(Math.random() * 1000);
        break;
    }
}

// Emit user joined event
socket.emit('new-user-joined', name);

// Listen for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim()) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Enable enter key to submit form
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

// Focus input when page loads
window.onload = () => {
    messageInput.focus();
};

// Socket event listeners
socket.on('user-joined', name => {
    addSystemMessage(`${name} joined the chat`);
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    addSystemMessage(`${name} left the chat`);
});

// Handle connection errors
socket.on('connect_error', () => {
    addSystemMessage('Connection failed. Please check if the server is running.');
});

socket.on('disconnect', () => {
    addSystemMessage('You have been disconnected. Trying to reconnect...');
});

socket.on('reconnect', () => {
    addSystemMessage('Reconnected to the server!');
});