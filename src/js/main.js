let gameBoard;
let humanPlayer;
let aiPlayer;

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];
const cells = document.querySelectorAll(".cell");
const replayBtn = document.querySelector("#replay");
const resetBtn = document.querySelector("#reset");
const choseX = document.querySelector("#ex");
const choseO = document.querySelector("#zero");
const displayCell = document.querySelector(".tictactoe");
const displayChoice = document.querySelector(".choice");
const displayResult = document.querySelector("#result");

function chooseXorO(e) {
	let id = e.path[0].id;
	if (id === "ex") {
		humanPlayer = "X";
		aiPlayer = "O";
	} else {
		humanPlayer = "O";
		aiPlayer = "X";
	}
	startGame();
}

choseX.addEventListener("click", chooseXorO);
choseO.addEventListener("click", chooseXorO);



function startGame() {
	displayResult.innerText = "";
	displayCell.style.visibility = "visible";
	replayBtn.style.visibility = "visible";
	resetBtn.style.visibility = "visible";
	displayChoice.style.visibility = "hidden";
	displayChoice.style.opacity = "0";
	gameBoard = Array.from(Array(9).keys());
	cells.forEach(cell => {
		cell.innerText = "";
		cell.style.backgroundColor = "#BADA55";
		cell.addEventListener("click", turnClick);
	});
}

function turnClick(e) {
	let idSquare = e.target.id;
	if (typeof gameBoard[idSquare] === "number") {
		turn(idSquare, humanPlayer);
		if (!checkWin(gameBoard, humanPlayer) && !checkTie()) {
			turn(bestSpot(), aiPlayer);
		}
	}
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function turn(idSquare, player) {
	gameBoard[idSquare] = player;
	let clickedSquare = document.getElementById(idSquare);
	clickedSquare.innerHTML = player;
	let gameWon = checkWin(gameBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			(gameWon.player === humanPlayer) ? "#46B5FF" : "#6A6AFF";
	}
	cells.forEach(cell => cell.removeEventListener("click", turnClick));
	declareWinner((gameWon.player === humanPlayer) ? "You win" : "You lose");
}

function emptySquares() {
	return gameBoard.filter(elem => typeof elem === "number");
}

function bestSpot() {
	return minimax(gameBoard, aiPlayer).index;
}

function declareWinner(who) {
	displayResult.innerText = who;
}

function checkTie() {
	if (emptySquares().length == 0) {
		cells.forEach(cell => {
			cell.removeEventListener("click", turnClick);
		});
		declareWinner("Tie Game!");
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	let availSpots = emptySquares(newBoard);
	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;
		if (player == aiPlayer) {
			let result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
	let bestMove;
	if(player === aiPlayer) {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

function resetAll() {
	location.reload();
}

replayBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetAll);
