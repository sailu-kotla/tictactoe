document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');

    let currentPlayer = 'X'; // User is always X
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // Only allow click if cell is empty, game is active, and it's user's turn (X)
        if (gameState[clickedCellIndex] !== "" || !gameActive || currentPlayer !== 'X') {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        
        if (handleResultValidation()) {
            currentPlayer = 'O'; // Switch for status display
            statusText.innerHTML = `Computer's <span>Thinking...</span>`;
            setTimeout(makeComputerMove, 800); // Computer moves after a delay
        }
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningLine = [];

        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') continue;
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            statusText.innerHTML = currentPlayer === 'X' ? 'You <span>Won!</span>' : 'Computer <span>Won!</span>';
            statusText.style.color = currentPlayer === 'X' ? 'var(--primary)' : 'var(--secondary)';
            highlightWinner(winningLine);
            gameActive = false;
            return false;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusText.innerHTML = "Game is a <span>Draw!</span>";
            statusText.style.color = "white";
            gameActive = false;
            return false;
        }

        return true; // Game continues
    }

    function makeComputerMove() {
        if (!gameActive) return;

        currentPlayer = 'O';
        let moveIndex = findBestMove();
        
        const cell = document.querySelector(`.cell[data-index="${moveIndex}"]`);
        handleCellPlayed(cell, moveIndex);
        
        if (handleResultValidation()) {
            currentPlayer = 'X';
            statusText.innerHTML = `Your <span>Turn (X)</span>`;
        }
    }

    function findBestMove() {
        // 1. Try to win
        let move = findWinningMove('O');
        if (move !== -1) return move;

        // 2. Block player's winning move
        move = findWinningMove('X');
        if (move !== -1) return move;

        // 3. Take center
        if (gameState[4] === "") return 4;

        // 4. Take random corner
        const corners = [0, 2, 6, 8].filter(i => gameState[i] === "");
        if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

        // 5. Take any empty spot
        const available = gameState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        return available[Math.floor(Math.random() * available.length)];
    }

    function findWinningMove(player) {
        for (let condition of winningConditions) {
            const values = condition.map(i => gameState[i]);
            const playerCount = values.filter(v => v === player).length;
            const emptyCount = values.filter(v => v === "").length;

            if (playerCount === 2 && emptyCount === 1) {
                return condition[values.indexOf("")];
            }
        }
        return -1;
    }

    function highlightWinner(line) {
        line.forEach(index => {
            cells[index].classList.add('winner');
        });
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusText.innerHTML = "Your <span>Turn (X)</span>";
        statusText.style.color = "white";
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('x', 'o', 'winner');
        });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', handleRestartGame);
});
