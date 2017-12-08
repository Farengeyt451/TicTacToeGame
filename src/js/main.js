let gameBoard;
const humanPlayer = "O";
const aiPalyer = "X";
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

startGame();

function startGame() {
	gameBoard = Array.from(Array(9).keys());
	cells.forEach(cell => {
		cell.innerText = "";
		cell.addEventListener("click", turnClick);
		cell.style.backgroundColor = "#BADA55";
	});
}

function turnClick(e) {
	let idSquare = e.target.id;
	turn(idSquare, humanPlayer);
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
	console.log(board,player);
	let plays = board.reduce((acc, el, index) =>
		(el === player) ? acc.concat(index) : acc, []);
	// let plays = board.reduce((a, el, i) => {
	// 	if (el === player) {
	// 		return a.concat(i);
	// 	}
	// 	return a;
	// }, []);
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
}

replayBtn.addEventListener("click", startGame);
