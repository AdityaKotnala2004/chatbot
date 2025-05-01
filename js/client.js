const socket = io('http://localhost:7000');

// Get DOM elements
// code for sending message 
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// code for displaying message in chat
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

// Ask for username when page loads
const name = prompt("Enter your name to join the chat: ");
socket.emit('new-user-joined', name);


// code for sending normal message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if(message.trim()) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Socket event listeners
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Optional: Handle user disconnect
socket.on('disconnect', () => {
    append('Connection lost. Please refresh the page.', 'left');
});