// this is node server used for socket io connection //
const io= require ('socket.io')(7000)

const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined' , name=>{

        console.log("new user ",name);

        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
    socket.on('send' , message =>{
        socket.broadcast.emit('receive', { message : message, name : users[socket.id]})
    });

})