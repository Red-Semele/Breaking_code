const playerSetup = document.getElementById('player-setup');
const nameSetup = document.getElementById('name-setup');
const teamAssignment = document.getElementById('team-assignment');
const codedMessageInput = document.getElementById('codedMessage');
const plainTextInput = document.getElementById('plainTextMessage');
const submitButton = document.getElementById('submitButton');
const drawButton = document.getElementById('drawButton');
const writeButton = document.getElementById('writeButton');
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const outputArea = document.getElementById('output-area');
const inputArea = document.getElementById('input-area')
const displayMessage = document.getElementById('displayMessage');
const decodedMessageInput = document.getElementById('decodedMessage');
const decodeButton = document.getElementById('decodeButton');
const result = document.getElementById('result');
const wrongSound = new Audio('wrongCode.mp3');
codedMessageInput.style.display = 'none'
const playerCountInput = document.getElementById('playerCount');
const playerNamesDiv = document.getElementById('playerNames');
const blueTeamList = document.getElementById('blueTeamList');
const redTeamList = document.getElementById('redTeamList');
const nextButton = document.getElementById('nextButton');
const assignButton = document.getElementById('assignButton');
const startGameButton = document.getElementById('startGameButton');
const currentTeamDiv = document.getElementById('currentTeam');
let playerScores = {};
let codeCreator = "";
let mainTeam = ""
let isDrawing = false;
let codedMessage = '';
let decodedMessage;
let players = [];
let currentTeam = 'blue'; // Initial team
let blueTeam = [];
let redTeam = [];

writeButton.addEventListener('click', () => {
  codedMessageInput.style.display = 'block';
  canvas.style.display = 'none';
});

nextButton.addEventListener('click', () => {
  const playerCount = parseInt(playerCountInput.value);
  if (playerCount && playerCount > 1) {
    playerSetup.style.display = 'none';
    nameSetup.style.display = 'block';
    for (let i = 0; i < playerCount; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Player ${i + 1} Name`;
      playerNamesDiv.appendChild(input);
    }
  }
});

assignButton.addEventListener('click', () => {
  const playerInputs = playerNamesDiv.querySelectorAll('input');
  players = Array.from(playerInputs).map(input => input.value.trim()).filter(name => name !== '');
  if (players.length < 2) {
    alert('Please enter at least two player names.');
    return;
  }

  nameSetup.style.display = 'none';
  assignTeams();
});

startGameButton.addEventListener('click', () => {
  teamAssignment.style.display = 'none';
  inputArea.style.display = 'block';
  resetPlayerScores();
  currentTeam = 'blue';
  updateCurrentTeam(); // Display initial team
});

function resetPlayerScores() {
  players.forEach(player => {
    playerScores[player] = 0; // Initialize each player's score to 0
  });
}

function resizeCanvas() {
  const parent = canvas.parentElement;
  const parentWidth = parent.clientWidth || 300; // Default width if no parent width
  const parentHeight = parent.clientHeight || 150; // Default height if no parent height

  const maxWidth = window.innerWidth * 0.8; // Restrict width to 80% of window width
  const maxHeight = window.innerHeight * 0.8; // Restrict height to 80% of window height

  canvas.width = Math.min(parentWidth, maxWidth) || 300; // Set width with a default limit
  canvas.height = Math.min(parentHeight, maxHeight) || 150; // Set height with a default limit

  ctx = canvas.getContext('2d'); // Reset the context in case of canvas resize
}

drawButton.addEventListener('click', () => {
  codedMessageInput.style.display = 'none';
  canvas.style.display = 'block';  // Ensure the canvas is visible
  document.body.style.overflow = 'hidden';
  resizeCanvas(); // Set the initial size of the canvas


  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mousemove', draw);

  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);
  canvas.addEventListener('touchmove', draw, { passive: false });

  window.addEventListener('resize', resizeCanvas);
});

function startDrawing(event) {
  isDrawing = true;
  draw(event); // Start drawing immediately
}

function stopDrawing(event) {
  isDrawing = false;
  ctx.beginPath();
}

function draw(event) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  let offsetX, offsetY;

  if (event.touches) {
    const touch = event.touches[0];
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
  } else {
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
  }

  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
}

function transformPlaintext() {
  const obscuredPlain = plainTextInput.value.replace(/[a-zA-Z0-9]/g, '_\u00A0\u00A0\u00A0').replace(/ /g, '\u00A0\u00A0\u00A0');
  const count = plainTextInput.value.match(/[a-zA-Z0-9]/g)?.length || 0; // Count letters and numbers
  plaintextDisplay.textContent = obscuredPlain;
  plaintextCountDisplay.textContent = `(${count} characters)`;
}

plainTextInput.addEventListener('input', transformPlaintext);

submitButton.addEventListener('click', () => {
  codeCreator = currentTeam;
  toggleClientTeam();
  document.body.style.overflow = 'auto';
  if (canvas.style.display === 'block') {
    codedMessage = canvas.toDataURL();
  } else {
    codedMessage = codedMessageInput.value;
  }

  if (codedMessage) {
    document.getElementById('input-area').style.display = 'none';
    outputArea.style.display = 'block';

    if (canvas.style.display === 'block') {
      let img = new Image();
      img.src = codedMessage;
      displayMessage.appendChild(img);
    } else {
      displayMessage.textContent = codedMessage;
    }
  }
});

decodeButton.addEventListener('click', () => {
  decodedMessage = decodedMessageInput.value;

  if (decodedMessage) {
    if (decodedMessage === plainTextInput.value) {
      // Increment score for each player in the current team
      console.log("Correct answer");

      players.forEach(player => {
        console.log(player);
        if (isPlayerInCurrentTeam(player)) {
          //TODO: this part of the code does not seem to trigger, check how isPlayerInCurrentTeam works.
          playerScores[player]++;
          updateScore(player); //TODO: check server code
          console.log(player + " awarded 1 point");

          console.log("TEST1");
        }
      });
      result.textContent = 'Correct!';
      result.style.color = 'green';
      if (codeCreator === currentTeam) {
        alert('The teammates managed to decode their message.');
      } else {
        alert('The spies managed to break the intercepted code.');
      }
      console.log("Starting over");
      assignTeams();

    } else {
      result.textContent = 'Wrong!';
      result.style.color = 'red';
      wrongSound.pause(); // Stop the current sound
      wrongSound.currentTime = 0; // Reset to the beginning
      wrongSound.play();
      swapTeam();
      //TODO: Move on to the second team if the spy doesn't crack it.
    }
  }
});

function updateCurrentTeam() {
  console.log(currentTeam);
  currentTeamDiv.textContent = `Current Team: ${currentTeam}`;
}

function toggleClientTeam() {
  currentTeam = currentTeam === 'blue' ? 'red' : 'blue';
  updateCurrentTeam();
}

function isPlayerInCurrentTeam(player) {
  console.log("TeamCheck");
  console.log(currentTeam); //TODO: For some reason currentteam appears to be set wrong.
  if (currentTeam === 'blue') {
    console.log(blueTeam);
    return blueTeam.includes(player);
  } else if (currentTeam === 'red') {
    console.log(redTeam);
    return redTeam.includes(player);
  } else {
    console.log("error");
    return false;
  }
}

function assignTeams() {
  teamAssignment.style.display = 'block';

  const shuffledPlayers = players.sort(() => Math.random() - 0.5);
  const mid = Math.ceil(shuffledPlayers.length / 2);
  blueTeam = shuffledPlayers.slice(0, mid);
  redTeam = shuffledPlayers.slice(mid);

  blueTeamList.innerHTML = blueTeam.map(player => `<li>${player}</li>`).join('');
  redTeamList.innerHTML = redTeam.map(player => `<li>${player}</li>`).join('');
}



function updateUI() {
  updatePlayerListUI();
  updateTeamsUI();
  updateCurrentTeamUI();
}

function updatePlayerListUI() {
  // Update the UI to display the players
}

function updateTeamsUI() {
  // Update the UI to display the teams
}

function updateScoreUI(player, score) {
  // Update the UI to reflect the new score
}

function updateCurrentTeamUI() {
  // Update the UI to reflect the current team
}