import { useEffect, useState } from "react";
import Board from "./Board";

function App() {
	const [board, setBoard] = useState(Array(9).fill(null)); // formo un array di 9 celle
	const [currentPlayer, setCurrentPlayer] = useState("");
	const [winner, setWinner] = useState("");
	const [userChoice, setUserChoice] = useState("");
	const [computerChoice, setComputerChoice] = useState("");

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
			// logica per le vincite
			const [a, b, c] = combination;
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return board[a]; // ritorna il vincitore ( X o O)
			}
		}
		return null; // se non c'è nessuna corrispondenza, nessun vincitore
	}

	function handleUserChoice(e) {
		const userChoice = e.target.innerText;
		setUserChoice(userChoice);
		const computerChoice = userChoice === "X" ? "O" : "X";
		setComputerChoice(computerChoice);
		// console.log(userChoice);
		// console.log(computerChoice);
	}

	// funzione al click sulla casella
	function handleClick(index) {
		if (board[index] || winner || !userChoice) return; // ignora il click se la cella è già stata cliccata o c'è già un vincitore o se è la mossa del computer

		const newBoard = [...board]; // mi faccio una copia della tabella
		newBoard[index] = userChoice; // riempio la cella col simbolo del giocatore
		setBoard(newBoard); // aggiorno la tabella con la nuova tabella

		if (checkWinner(newBoard)) {
			setWinner(userChoice); // setto il vincitore
			// console.log("Ha vinto " + currentPlayer);
		} else if (newBoard.every((cell) => cell !== null)) {
			// se tutte le celle sono piene
			setWinner("Pareggio"); // setto il pareggio
		} else {
			setCurrentPlayer(computerChoice); // se non c'è un vincitore allora camnio simbolo del giocatore per passare il turno al computer
		}
	}

	// funzione del computer
	function makeComputerMove() {
		const emptyCells = board
			.map((value, index) => (value === null ? index : null))
			.filter((index) => index !== null); // verifco le daselle vuote
		if (emptyCells.length === 0) return; // se non ci sono celle vuote mi fermo, è finita la partita
		const randomIndex =
			emptyCells[Math.floor(Math.random() * emptyCells.length)]; // scelgo casualmente una cella per il computer
		const newBoard = [...board];
		newBoard[randomIndex] = computerChoice; // asssegno al computer la O
		setBoard(newBoard); // aggiorno la tabella con la nuova tabella

		// controllo le varie condizioni
		if (checkWinner(newBoard)) {
			setWinner(computerChoice); // se vince il computer
		} else if (newBoard.every((cell) => cell !== null)) {
			setWinner("Pareggio"); // se è pareggio
		} else {
			setCurrentPlayer(userChoice); // se non vince il computer, cambio giocatore
		}
	}

	// funzione per resettare il gioco
	function handleResetGame() {
		setWinner(null);
		setBoard(Array(9).fill(null));
		setCurrentPlayer(null);
		setUserChoice(null);
		setComputerChoice(null);
	}

	useEffect(() => {
		if (currentPlayer === computerChoice && !winner) {
			const timeOut = setTimeout(() => {
				makeComputerMove();
			}, 800); // rendiamo automatica la mossa del computer dopo 800 ms
			return () => clearTimeout(timeOut); // puliamo il timeout
		}
	}, [currentPlayer, winner]);

	return (
		<div className="container m-5">
			<h1>Tris Kata</h1>
			<p>
				Welcome to Kata-tris, a Tetris clone built with HTML, CSS, and
				JavaScript.
			</p>
			<p>Allinea tre simboli uguali in orizzontale, verticale o diagonale!</p>
			<p>
				Scegli se giocare con{" "}
				<button className="btn bg-primary p-2" onClick={handleUserChoice}>
					X
				</button>{" "}
				o{" "}
				<button className=" btn bg-info p-2" onClick={handleUserChoice}>
					O
				</button>
			</p>
			<div className="board">
				<Board board={board} onClick={handleClick} />
			</div>

			{!winner && currentPlayer !== "" && (
				<p className="p-3 bg-info">Tocca a {currentPlayer}</p>
			)}

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
