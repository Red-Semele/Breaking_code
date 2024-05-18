document.addEventListener('DOMContentLoaded', () => {
    const playerSetup = document.getElementById('player-setup');
    const nameSetup = document.getElementById('name-setup');
    const teamAssignment = document.getElementById('team-assignment');
    const codedMessageInput = document.getElementById('codedMessage');
    const plainTextInput = document.getElementById('plainTextMessage');
    const submitButton = document.getElementById('submitButton');
    const drawButton = document.getElementById('drawButton');
    const writeButton = document.getElementById('writeButton');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const outputArea = document.getElementById('output-area');
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
    
    let isDrawing = false;
    let codedMessage = '';
    let players = [];
    writeButton.addEventListener('click', () => {
        codedMessageInput.style.display = 'block'
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
        teamAssignment.style.display = 'block';

        const shuffledPlayers = players.sort(() => Math.random() - 0.5);
        const mid = Math.ceil(shuffledPlayers.length / 2);
        const blueTeam = shuffledPlayers.slice(0, mid);
        const redTeam = shuffledPlayers.slice(mid);

        blueTeamList.innerHTML = blueTeam.map(player => `<li>${player}</li>`).join('');
        redTeamList.innerHTML = redTeam.map(player => `<li>${player}</li>`).join('');
    });

    startGameButton.addEventListener('click', () => {
        teamAssignment.style.display = 'none';
        inputArea.style.display = 'block';
    });

    

    const resizeCanvas = () => {
        const parent = canvas.parentElement;
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        console.log(parentWidth)
        console.log (parent)
        console.log (parentHeight)
    
        // Set the canvas size to the parent's size or a default value if the parent has no size TODO: This is the reason the canvas is always too small.
        canvas.width = parentWidth || 300;
        const maxHeight = window.innerHeight * 0.8;
        canvas.height = Math.min(parentHeight, maxHeight) || 150;
    };
    drawButton.addEventListener('click', () => {
        codedMessageInput.style.display = 'none'
        canvas.style.display = 'block';
        resizeCanvas(); // Set the initial size of the canvas

        canvas.addEventListener('mousedown', () => {
            isDrawing = true;
        });

        window.addEventListener('resize', resizeCanvas);

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            ctx.beginPath();
        });

        canvas.addEventListener('mousemove', draw);
    });

     function transformPlaintext() {
        const obscuredPlain = plainTextInput.value.replace(/[a-zA-Z0-9]/g, '_\u00A0\u00A0\u00A0').replace(/ /g, '\u00A0\u00A0\u00A0');
        const count = plainTextInput.value.match(/[a-zA-Z0-9]/g)?.length || 0; // Count letters and numbers
        plaintextDisplay.textContent = obscuredPlain;
        plaintextCountDisplay.textContent = `(${count} characters)`
    }

    plainTextInput.addEventListener('input', transformPlaintext);

    function draw(event) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect(); // Get the position of the canvas relative to the viewport
        //const x = event.clientX - rect.left; // Adjust X coordinate relative to the canvas
        //const y = event.clientY - rect.top; // Adjust Y coordinate relative to the canvas
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        ctx.lineWidth = 1;
        ctx.lineCap = 'round';

        //ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        //ctx.stroke();
        //ctx.beginPath();
        //ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        //ctx.lineTo(x, y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        //ctx.moveTo(x, y);
    }

    submitButton.addEventListener('click', () => {
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
        const decodedMessage = decodedMessageInput.value;

        if (decodedMessage) {
            if (decodedMessage === plainTextInput.value) {
                result.textContent = 'Correct!';
                result.style.color = 'green';
            } else {
                result.textContent = 'Try again!';
                result.style.color = 'red';
                wrongSound.pause(); // Stop the current sound
                wrongSound.currentTime = 0; // Reset to the beginning
                wrongSound.play();
                //TODO: Move on to the second team if the spy doesn't crack it.
            }
        }
    });
});