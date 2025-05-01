import { io } from "socket.io-client";
const socket = io('http://localhost:7000');

// code for sending message 
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messaageInp');
const messageContainer = document.querySelector('.container');

// code for displaying message in chat
const append = (message, position) =>{
    const messageElement= document.createElement('div');
    messageElement.innertext = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

// code for sending normal message
form.addEventListner('submit', (e)=>{
    e.preventDefault();
    const message= messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value ='';

})
// code for taking name from user
const name= prompt("Enter your name to join the chat: ");
socket.emit('new-user-joined' , name );

//code for displaying the new user name mess
socket.on('user-joined', data =>{
    append(`${name} joined the chat`, 'right');
})

//code for normal mess receiving format
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
})
