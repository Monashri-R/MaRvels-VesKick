const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;

const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", cellClicked);
});

restartBtn.addEventListener("click", restartGame);

function cellClicked() {

    const index = this.getAttribute("data-index");

    if(board[index] !== "" || !running){
        return;
    }

    board[index] = currentPlayer;
    this.textContent = currentPlayer;

    checkWinner();
}

function changePlayer(){

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent = "Player " + currentPlayer + " Turn";
}

function checkWinner(){

    let roundWon = false;

    for(let i=0;i<winConditions.length;i++){

        const condition = winConditions[i];

        const a = board[condition[0]];
        const b = board[condition[1]];
        const c = board[condition[2]];

        if(a === "" || b === "" || c === ""){
            continue;
        }

        if(a === b && b === c){
            roundWon = true;
            break;
        }

    }

    if(roundWon){
        statusText.textContent = "🎉 Player " + currentPlayer + " Wins!";
        running = false;
        return;
    }

    if(!board.includes("")){
        statusText.textContent = "🤝 Match Draw!";
        running = false;
        return;
    }

    changePlayer();
}

function restartGame(){

    board = ["","","","","","","","",""];

    currentPlayer = "X";

    running = true;

    statusText.textContent = "Player X Turn";

    cells.forEach(cell=>{
        cell.textContent = "";
    });

}