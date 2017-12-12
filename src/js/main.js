let gameBoard;
let humanPlayer;
let aiPlayer;
let running = false;
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
const replayBtn = document.querySelector("button");
const choseX = document.querySelector("#ex");
const choseO = document.querySelector("#zero");

function chooseXorO(e) {
	let id = e.path[0].id;
	console.log(id);
	if (id === "ex") {
		console.log("OK");
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
			setTimeout(function() {
				turn(bestSpot(), aiPlayer);
			}, 1000);
		}
	}
}

function turn(idSquare, player) {
	gameBoard[idSquare] = player;
	// console.log(idSquare, player, gameBoard);
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
			(gameWon.player === humanPlayer) ? "blue" : "red";
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
	alert(who);
}

function checkTie() {
	if (emptySquares().length == 0) {
		cells.forEach(cell => {
			cell.style.backgroundColor = "green";
			cell.removeEventListener("click", turnClick);
		});
		declareWinner("Tie Game!")
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

replayBtn.addEventListener("click", startGame);
