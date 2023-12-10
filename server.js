const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let scores = {
    match1: { team1: 0, team2: 0 },
    match2: { team1: 0, team2: 0 }
};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('initialScores', scores);

    socket.on('updateScore', ({ match, team, runs }) => {
        scores[match][team] += parseInt(runs);
        io.emit('updateScores', scores);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
