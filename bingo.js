// ======================================
// MoonsVPlay Bingo
// Part 1
// ======================================

// Detect game mode
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "pass";

// HTML Elements
const passPlayContainer = document.getElementById("passPlayContainer");
const singleBoardContainer = document.getElementById("singleBoardContainer");

const player1Board = document.getElementById("player1Board");
const player2Board = document.getElementById("player2Board");
const singleBoard = document.getElementById("singleBoard");

const turnText = document.getElementById("turnText");

const winnerPopup = document.getElementById("winnerPopup");
const winnerTitle = document.getElementById("winnerTitle");
const winnerMessage = document.getElementById("winnerMessage");
const playAgainBtn = document.getElementById("playAgainBtn");

const loadingScreen = document.getElementById("loadingScreen");

// ----------------------------
// Game Variables
// ----------------------------

let currentPlayer = 1;

let player1Numbers = [];
let player2Numbers = [];
let singleNumbers = [];

let player1Marked = [];
let player2Marked = [];
let singleMarked = [];

let gameFinished = false;

// ----------------------------
// Shuffle Function
// ----------------------------

function shuffleArray(arr){

    for(let i = arr.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;

}

// ----------------------------
// Generate Random Numbers
// ----------------------------

function generateBoardNumbers(){

    let numbers = [];

    for(let i=1;i<=25;i++){

        numbers.push(i);

    }

    return shuffleArray(numbers);

}

// ----------------------------
// Create Boards
// ----------------------------

function initializeBoards(){

    if(mode === "pass"){

        passPlayContainer.style.display = "block";
        singleBoardContainer.style.display = "none";

        player1Numbers = generateBoardNumbers();
        player2Numbers = generateBoardNumbers();

    }

    else{

        passPlayContainer.style.display = "none";
        singleBoardContainer.style.display = "flex";

        singleNumbers = generateBoardNumbers();

    }

}

// ----------------------------
// Start Game
// ----------------------------

initializeBoards();

// Remove Loading Screen

setTimeout(()=>{

    loadingScreen.style.display="none";

},700);
// ======================================
// MoonsVPlay Bingo
// Part 2
// Board Creation & Rendering
// ======================================

// Create one board
function createBoard(boardElement, numbers, markedArray) {

    boardElement.innerHTML = "";

    for (let i = 0; i < 25; i++) {

        const cell = document.createElement("div");

        cell.className = "cell";

        cell.innerText = numbers[i];

        cell.dataset.number = numbers[i];
        cell.dataset.index = i;

        cell.addEventListener("click", function () {

            if (gameFinished) return;

            handleCellClick(Number(this.dataset.number));

        });

        boardElement.appendChild(cell);

        markedArray.push(false);

    }

}

// Draw all boards
function renderBoards() {

    player1Marked = [];
    player2Marked = [];
    singleMarked = [];

    if (mode === "pass") {

        createBoard(player1Board, player1Numbers, player1Marked);

        createBoard(player2Board, player2Numbers, player2Marked);

        turnText.innerText = "Player 1 Turn";

    } else {

        createBoard(singleBoard, singleNumbers, singleMarked);

    }

}

// Mark same number on a board
function markBoard(boardElement, markedArray, number) {

    const cells = boardElement.querySelectorAll(".cell");

    cells.forEach((cell, index) => {

        if (Number(cell.dataset.number) === number) {

            cell.classList.add("marked");

            markedArray[index] = true;

        }

    });

}
function updateBoardState(){

    if(currentPlayer === 1){

        player1Board.classList.remove("disabled");
        player1Board.classList.add("active");

        player2Board.classList.remove("active");
        player2Board.classList.add("disabled");

    }else{

        player2Board.classList.remove("disabled");
        player2Board.classList.add("active");

        player1Board.classList.remove("active");
        player1Board.classList.add("disabled");

    }

}
// Start rendering
renderBoards();
updateBoardState();
// ======================================
// MoonsVPlay Bingo
// Part 3
// Turn System & Number Marking
// ======================================

function handleCellClick(number) {

    if (mode !== "pass") return;

    // Player 1 Turn
    if (currentPlayer === 1) {

        const p1Cell = [...player1Board.querySelectorAll(".cell")]
            .find(cell => Number(cell.dataset.number) === number);

        if (!p1Cell || p1Cell.classList.contains("marked"))
            return;

        markBoard(player1Board, player1Marked, number);
        markBoard(player2Board, player2Marked, number);

        document.getElementById("currentNumber").innerText = number;

        
        currentPlayer = 2;
        turnText.innerText = "Player 2 Turn";
        updateBoardState();
    }

    // Player 2 Turn
    else {

        const p2Cell = [...player2Board.querySelectorAll(".cell")]
            .find(cell => Number(cell.dataset.number) === number);

        if (!p2Cell || p2Cell.classList.contains("marked"))
            return;

        markBoard(player1Board, player1Marked, number);
        markBoard(player2Board, player2Marked, number);

        document.getElementById("currentNumber").innerText = number;

        currentPlayer = 1;
        turnText.innerText = "Player 1 Turn";
        updateBoardState();
    }

    checkWinner();

}

// ======================================
// Count Completed Lines
// ======================================

function countCompletedLines(markedArray) {

    let lines = 0;

    // Rows
    for (let r = 0; r < 5; r++) {

        let ok = true;

        for (let c = 0; c < 5; c++) {

            if (!markedArray[r * 5 + c]) {

                ok = false;
                break;

            }

        }

        if (ok) lines++;

    }

    // Columns
    for (let c = 0; c < 5; c++) {

        let ok = true;

        for (let r = 0; r < 5; r++) {

            if (!markedArray[r * 5 + c]) {

                ok = false;
                break;

            }

        }

        if (ok) lines++;

    }

    // Main Diagonal
    let d1 = true;

    for (let i = 0; i < 5; i++) {

        if (!markedArray[i * 5 + i]) {

            d1 = false;
            break;

        }

    }

    if (d1) lines++;

    // Second Diagonal
    let d2 = true;

    for (let i = 0; i < 5; i++) {

        if (!markedArray[i * 5 + (4 - i)]) {

            d2 = false;
            break;

        }

    }

    if (d2) lines++;

    return lines;

}
// ======================================
// MoonsVPlay Bingo
// Part 4
// BINGO Letters, Winner & Restart
// ======================================

function bingoText(lines){

    if(lines <= 0) return "_ _ _ _ _";
    if(lines == 1) return "B _ _ _ _";
    if(lines == 2) return "B I _ _ _";
    if(lines == 3) return "B I N _ _";
    if(lines == 4) return "B I N G _";

    return "B I N G O";

}

function checkWinner(){

    const p1Lines = countCompletedLines(player1Marked);
    const p2Lines = countCompletedLines(player2Marked);

    document.getElementById("player1Word").innerText =
        bingoText(p1Lines);

    document.getElementById("player2Word").innerText =
        bingoText(p2Lines);

    if(p1Lines >= 5){

        gameFinished = true;

        winnerTitle.innerText = "🏆 Player 1 Wins!";
        winnerMessage.innerText = "Player 2 Loses";

        winnerPopup.style.display = "flex";

        return;

    }

    if(p2Lines >= 5){

        gameFinished = true;

        winnerTitle.innerText = "🏆 Player 2 Wins!";
        winnerMessage.innerText = "Player 1 Loses";

        winnerPopup.style.display = "flex";

        return;

    }

}

// ============================
// Play Again
// ============================

playAgainBtn.addEventListener("click", function(){

    winnerPopup.style.display = "none";

    gameFinished = false;

    currentPlayer = 1;

    turnText.innerText = "Player 1 Turn";

    document.getElementById("currentNumber").innerText = "-";

    initializeBoards();

    renderBoards();
updateBoardState();

});
