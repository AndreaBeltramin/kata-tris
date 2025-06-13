import { useState } from "react";
import Board from "./Board";

function App() {
	const [board, setBoard] = useState(Array(9).fill(null)); // formo un array di 9 celle
	const [currentPlayer, setCurrentPlayer] = useState("X"); // parti con la X
	const [winner, setWinner] = useState(null);

	// funzione per controllare il vincitore ricevendo la tabella come parametro
	function checkWinner(board) {
		// combinazioni di vittoria
		const winningCombinations = [
			[0, 1, 2], // Riga 1
			[3, 4, 5], // Riga 2
			[6, 7, 8], // Riga 3
			[0, 3, 6], // Colonna 1
			[1, 4, 7], // Colonna 2
			[2, 5, 8], // Colonna 3
			[0, 4, 8], // Diagonale \
			[2, 4, 6], // Diagonale /
		];

		for (const combination of winningCombinations) {
			const [a, b, c] = combination;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return board[a]; // ritorna il vincitore ( X o O)
			}
		}
		return null; // se non c'è nessuna corrispondenza, nessun vincitore
	}

	// funzione al click sulla casella
	function handleClick(index) {
		if (board[index] || winner) return; // ignora il click se la cella è già stata cliccata o c'è già un vincitore

		const newBoard = [...board]; // mi faccio una copia della tabella
		newBoard[index] = currentPlayer; // riempio la cella col simbolo del giocatore
		setBoard(newBoard); // aggiorno la tabella con la nuova tabella

		const hasWon = checkWinner(newBoard); // controllo se il giocatore corrente ha vinto passando alla funzione la tabella aggiornata
		if (hasWon) {
			// se c'è un vincitore
			setWinner(currentPlayer); // setto il vincitore con il giocatore corrente
			// console.log("Ha vinto " + currentPlayer);
		} else if (newBoard.every((cell) => cell)) {
			// se tutte le celle sono piene
			setWinner("Pareggio"); // setto il pareggio
		} else {
			setCurrentPlayer(currentPlayer === "X" ? "O" : "X"); // se non c'è un vincitore allora camnio simbolo del giocatore
		}
	}

	// funzione per resettare il gioco
	function handleResetGame() {
		setWinner(null);
		setBoard(Array(9).fill(null));
		setCurrentPlayer("X");
	}

	// console.log(winner);

	return (
		<div className="container m-5">
			<h1>Tris Kata</h1>
			<p>
				Welcome to Kata-tris, a Tetris clone built with HTML, CSS, and
				JavaScript.
			</p>
			<p>Allinea tre simboli uguali in orizzontale, verticale o diagonale!</p>
			<div className="board">
				<Board board={board} onClick={handleClick} />
			</div>

			{!winner && <p className="p-3 bg-info">Tocca a {currentPlayer}</p>}

			{winner && winner !== "Pareggio" && (
				<p className="p-3 bg-success">Ha vinto {winner}</p>
			)}

			{winner && winner === "Pareggio" && (
				<p className="p-3 bg-warning">Pareggio!!</p>
			)}

			{winner && (
				<button className="btn btn-primary" onClick={handleResetGame}>
					Rinizia il gioco
				</button>
			)}
		</div>
	);
}

export default App;
