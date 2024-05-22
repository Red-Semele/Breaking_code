import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = 3000;

let playerScores = {};
let currentTeam = 'blue'; // or 'red'
let blueTeam = [];
let redTeam = [];

const wss = new WebSocketServer({ noServer: true });

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws) => {
  console.log('A new client connected');

  // Send the current game state to the new client
  ws.send(JSON.stringify({ type: 'init', playerScores, currentTeam, blueTeam, redTeam }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'updateScore':
        updateScore(data.player);
        break;
      case 'swapTeam':
        swapTeam();
        break;
      // Add more cases as needed
    }
  });
});

function updateScore(player) {
  if (playerScores[player] !== undefined) {
    playerScores[player]++;
    broadcast({ type: 'updateScore', player, score: playerScores[player] });
  }
}

function swapTeam() {
  currentTeam = currentTeam === 'blue' ? 'red' : 'blue';
  broadcast({ type: 'swapTeam', currentTeam });
}

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}