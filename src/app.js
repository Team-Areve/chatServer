const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const server = http.createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const users = {};

io.on('connection', (socket) => {
  socket.on('room', (room_id) => {
    socket.join(room_id);
    // users[socket.id] = { room_id };
    // io.emit('users', users, { room_id, user_name });
    // io.emit('userId', socket.id);
  });

  //메시지
  socket.on('front_to_back', (msgObj) => {
    const date = new Date();
    const time = {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    };

    msgObj.user_id = 'receiver';

    io.to(msgObj.room_id).emit('back_to_front', msgObj, time);
    console.log(msgObj);
  });
});

app.use(express.static(path.join(__dirname, 'src')));

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`server is running ${PORT}`));
