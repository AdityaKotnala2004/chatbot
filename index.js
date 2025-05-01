const io = require('socket.io')(7000, {
    cors: {
        origin: "*", // Allow connections from any origin for development
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user:", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    
    socket.on('send', message => {
        socket.broadcast.emit('receive', { 
            message: message, 
            name: users[socket.id]
        });
    });
    
    socket.on('disconnect', () => {
        if(users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    });
});