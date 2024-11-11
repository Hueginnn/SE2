document.addEventListener('DOMContentLoaded', () => {
    // Reference to different game pages and buttons
    const homepage = document.getElementById('homepage');
    const registrationPage = document.getElementById('registrationPage');
    const rankingPage = document.getElementById('rankingPage');
    const gameContainer = document.getElementById('gameContainer');
    const endGameScreen = document.getElementById('endGameScreen');
    const startBtn = document.getElementById('startBtn');
    const viewRankingBtn = document.getElementById('viewRankingBtn');
    const exitBtn = document.getElementById('Exit');
    const registerBtn = document.getElementById('registerBtn');
    const playerNameInput = document.getElementById('playerName');
    const registeredPlayersDiv = document.getElementById('registeredPlayers');
    const confirmPlayerCountBtn = document.getElementById('confirmPlayerCountBtn');
    const playerCountInput = document.getElementById('playerCount');
    const returnToHomeBtn = document.getElementById('returnToHomeBtn');
    const returnBtn = document.getElementById('returnBtn');
    const returnBtnEnd = document.getElementById('returnBtnEnd');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const resetRankingBtn = document.getElementById('resetRankingBtn'); // Add reset ranking button

    let players = JSON.parse(localStorage.getItem('players')) || [];
    let maxPlayers = 2;
    let currentPlayerIndex = 0;
    let currentQuestionIndex = 0;
    let currentRound = 1;

    const roundQuestions = {
        1: [
            { question: "What is data transformation?", choices: ["Conversion", "Processing", "Transformation", "Shaping"], correctAnswer: 2 },
            { question: "Best chart for proportions?", choices: ["Line", "Bar", "Pie", "Scatter"], correctAnswer: 2 },
            { question: "What is ETL?", choices: ["Extract, Load", "Transform", "Expand", "Encode"], correctAnswer: 0 },
            { question: "Handling missing data?", choices: ["Drop", "Replace", "Fill", "All"], correctAnswer: 3 },
            { question: "Association test?", choices: ["T-test", "Chi-square", "ANOVA", "Correlation"], correctAnswer: 1 }
        ],
        2: [
            { question: "What is a T-test?", choices: ["Difference", "ANOVA", "Chi-square", "Correlation"], correctAnswer: 0 },
            { question: "Algorithm without programming?", choices: ["Supervised", "Unsupervised", "Reinforcement", "Deep"], correctAnswer: 3 },
            { question: "Non-linear structure?", choices: ["Array", "Queue", "Stack", "Tree"], correctAnswer: 3 },
            { question: "Continuous to categories?", choices: ["Regression", "Clustering", "Binning", "Normalization"], correctAnswer: 2 },
            { question: "Frequent itemsets?", choices: ["Apriori", "SVM", "K-Means", "Random"], correctAnswer: 0 }
        ],
        3: [
            { question: "High-level to machine code?", choices: ["Compilation", "Interpretation", "Execution", "Debugging"], correctAnswer: 0 },
            { question: "Constant access structure?", choices: ["Array", "List", "Hash", "Tree"], correctAnswer: 2 },
            { question: "Small program?", choices: ["App", "Function", "Routine", "Utility"], correctAnswer: 3 },
            { question: "Bjarne's language?", choices: ["Java", "Python", "C++", "JavaScript"], correctAnswer: 2 },
            { question: "Error fixing?", choices: ["Testing", "Debugging", "Profiling", "Optimizing"], correctAnswer: 1 }
        ]
    };

    startBtn.addEventListener('click', () => {
        homepage.style.display = 'none';
        registrationPage.style.display = 'block';
    });

    // Event listener for view ranking
    viewRankingBtn.addEventListener('click', () => {
        homepage.style.display = 'none';
        rankingPage.style.display = 'block';
        updateRanking();
    });

    // Exit button listener
    exitBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Confirm number of players
    confirmPlayerCountBtn.addEventListener('click', () => {
        maxPlayers = parseInt(playerCountInput.value);
        if (maxPlayers >= 2 && maxPlayers <= 5) {
            alert(`Player count set to ${maxPlayers}. Please register players.`);
            playerNameInput.disabled = false;
            registerBtn.disabled = false;
        } else {
            alert('Please select a valid number of players (2-5).');
        }
    });

    // Register each player
    registerBtn.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName && players.length < maxPlayers) {
            players.push({ name: playerName, wins: 0 });
            updateRegisteredPlayers();
            playerNameInput.value = '';
            if (players.length === maxPlayers) {
                startGame();
            }
        } else if (players.length >= maxPlayers) {
            alert(`You have reached the maximum of ${maxPlayers} players.`);
        } else {
            alert('Please enter a valid player name.');
        }
    });

    // Return to home page after viewing ranking
    returnToHomeBtn.addEventListener('click', () => {
        resetPlayers();
        rankingPage.style.display = 'none';
        homepage.style.display = 'block';
    });

    // Return to home page after registering players
    returnBtn.addEventListener('click', () => {
        resetPlayers();
        registrationPage.style.display = 'none';
        homepage.style.display = 'block';
    });

    // Return to home page after game ends
    returnBtnEnd.addEventListener('click', () => {
        resetPlayers();
        endGameScreen.style.display = 'none';
        homepage.style.display = 'block';
    });

    // Replay the game
    playAgainBtn.addEventListener('click', () => {
        endGameScreen.style.display = 'none';
        startGame();
    });

    // Reset the ranking
    resetRankingBtn.addEventListener('click', () => {
        // Reset the players data in localStorage
        localStorage.removeItem('players');
        updateRanking(); // Update the ranking UI after reset
        alert('Ranking has been reset!');
    });

    // Update UI to show registered players
    function updateRegisteredPlayers() {
        registeredPlayersDiv.innerHTML = players.map(player => `<p>${player.name}</p>`).join('');
    }

    // Start game after registration
    function startGame() {
        registrationPage.style.display = 'none';
        gameContainer.style.display = 'block';
        currentPlayerIndex = 0;
        currentQuestionIndex = 0;
        currentRound = 1;
        players.forEach(player => player.wins = 0);
        startPlayerTurn();
    }

    // Start turn for current player
    function startPlayerTurn() {
        const currentPlayer = players[currentPlayerIndex];
        const questions = roundQuestions[currentRound];
        const currentQuestion = questions[currentQuestionIndex];
        
        document.getElementById('roundTitle').textContent = `Player: ${currentPlayer.name}`;
        document.getElementById('questionText').textContent = currentQuestion.question;

        const choicesContainer = document.getElementById('choicesContainer');
        choicesContainer.innerHTML = '';
        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.addEventListener('click', () => checkAnswer(index, currentQuestion.correctAnswer));
            choicesContainer.appendChild(button);
        });
    }

    // Check answer and update score if correct
    function checkAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            players[currentPlayerIndex].wins++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < roundQuestions[currentRound].length) {
            startPlayerTurn();
        } else {
            currentQuestionIndex = 0;
            currentPlayerIndex++;
            if (currentPlayerIndex < players.length) {
                startPlayerTurn();
            } else {
                handleRoundEnd();
            }
        }
    }

    // At end of round, check for players with lowest scores and eliminate them
    function handleRoundEnd() {
        currentPlayerIndex = 0;

        // Eliminate players with the lowest scores and store their names
        const eliminatedPlayers = eliminatePlayers();

        // Display notification about eliminated players
        if (eliminatedPlayers.length > 0) {
            alert(`This round's eliminated players: ${eliminatedPlayers.join(', ')}`);
        }

        if (players.length > 1) {
            currentRound++;
            startPlayerTurn();
        } else {
            endGame();
        }
    }

    // Eliminate players with least wins and return their names
    function eliminatePlayers() {
        const sortedPlayers = players.slice().sort((a, b) => a.wins - b.wins);
        const eliminations = currentRound === 1
            ? players.length >= 5 ? 2 : 1
            : 1;
        const playersToEliminate = sortedPlayers.slice(0, eliminations);
        const eliminatedPlayerNames = playersToEliminate.map(player => player.name);

        // Filter out eliminated players from the main players array
        players = players.filter(player => !playersToEliminate.includes(player));
        return eliminatedPlayerNames;
    }

    // End the game and save the winner's data to localStorage
    function endGame() {
        gameContainer.style.display = 'none';
        endGameScreen.style.display = 'block';
        const winner = players[0]; // Assuming players[0] is the winner
        document.getElementById('winnerDisplay').textContent = `Winner: ${winner.name}`;
        const summaryDisplay = document.getElementById('summaryDisplay');
        summaryDisplay.innerHTML = players.map(player => `<p>${player.name}: ${player.wins} wins</p>`).join('');

        // Add +1 win to the winner's total score in localStorage (not per round)
        let savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
        const existingWinner = savedPlayers.find(player => player.name === winner.name);
        if (existingWinner) {
            existingWinner.wins += 1; // Add only 1 win to total
        } else {
            savedPlayers.push({ name: winner.name, wins: 1 });
        }

        localStorage.setItem('players', JSON.stringify(savedPlayers)); // Save to localStorage
    }

    // Update ranking table based on localStorage data
    function updateRanking() {
        const rankingTableBody = document.getElementById('rankingTable').querySelector('tbody');
        const savedPlayers = JSON.parse(localStorage.getItem('players')) || [];
        rankingTableBody.innerHTML = savedPlayers
            .sort((a, b) => b.wins - a.wins)
            .map(player => `<tr><td>${player.name}</td><td>${player.wins}</td></tr>`)
            .join('');
    }

    // Reset players data
    function resetPlayers() {
        players = [];
        registeredPlayersDiv.innerHTML = '';
        playerNameInput.disabled = false;
        registerBtn.disabled = false;
        playerNameInput.value = '';
        playerCountInput.value = '';
    }
});
