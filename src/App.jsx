import { useEffect, useState } from "react";
import Board from "./Board";

function App() {
	const [board, setBoard] = useState(Array(9).fill(null)); // formo un array di 9 celle
	const [currentPlayer, setCurrentPlayer] = useState("");
	const [winner, setWinner] = useState("");
	const [userChoice, setUserChoice] = useState("");
	const [computerChoice, setComputerChoice] = useState("");
	const [countUserWin, setCountUserWin] = useState(0);
	const [countUserLose, setCountUserLose] = useState(0);
	const [countDraw, setCountDraw] = useState(0);

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

	// funzione per gestire la scelta dell'utente
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
			setCountUserWin((prev) => prev + 1);
			// console.log("Ha vinto " + currentPlayer);
		} else if (newBoard.every((cell) => cell !== null)) {
			const possibleWinner = checkWinner(newBoard);
			if (possibleWinner) {
				setWinner(possibleWinner); // se c'è un vincitore, setto il vincitore
			} else {
				// se tutte le celle sono piene
				setWinner("Pareggio"); // setto il pareggio
				setCountDraw((prev) => prev + 1);
			}
		} else {
			setCurrentPlayer(computerChoice); // se non c'è un vincitore allora camnio simbolo del giocatore per passare il turno al computer
		}
	}

	// funzione del computer
	function makeComputerMove() {
		const emptyCells = board
			.map((value, index) => (value === null ? index : null))
			.filter((index) => index !== null); // verifico le caselle vuote
		if (emptyCells.length === 0) return; // se non ci sono celle vuote mi fermo, è finita la partita
		const randomIndex =
			emptyCells[Math.floor(Math.random() * emptyCells.length)]; // scelgo casualmente una cella per il computer
		const newBoard = [...board];
		newBoard[randomIndex] = computerChoice; // asssegno al computer la mossa
		setBoard(newBoard); // aggiorno la tabella con la nuova tabella modificata

		// controllo le varie condizioni
		if (checkWinner(newBoard)) {
			setWinner(computerChoice); // se vince il computer
			setCountUserLose((prev) => prev + 1);
		} else if (newBoard.every((cell) => cell !== null)) {
			setWinner("Pareggio"); // se è pareggio
			setCountDraw((prev) => prev + 1);
		} else {
			setCurrentPlayer(userChoice); // se non vince il computer, cambio giocatore
		}
	}

	// funzione per resettare i punteggi
	function handleResetPoints() {
		setCountUserWin(0);
		setCountUserLose(0);
		setCountDraw(0);
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
			const emptyCells = board.filter((cell) => cell === null);
			if (emptyCells.length === 0) {
				const possibleWinner = checkWinner(board);
				if (possibleWinner) {
					setWinner(possibleWinner);
				} else {
					setWinner("Pareggio");
				}
				return;
			}
			const timeOut = setTimeout(() => {
				makeComputerMove();
			}, 800); // rendiamo automatica la mossa del computer dopo 800 ms
			return () => clearTimeout(timeOut); // puliamo il timeout
		}
	}, [currentPlayer, winner]);

	return (
		<div className="container mx-auto mt-5">
			<div className="text-center">
				<h1>Tris Kata</h1>
				<p>Allinea tre simboli uguali in orizzontale, verticale o diagonale!</p>
				<p>
					Scegli se giocare con{" "}
					<button
						className="btn btn-start bg-primary py-2"
						onClick={handleUserChoice}
					>
						X
					</button>{" "}
					o{" "}
					<button
						className=" btn btn-start bg-info p-2"
						onClick={handleUserChoice}
					>
						O
					</button>
				</p>
			</div>

			<div className="d-flex row gx-4">
				<div className="d-flex col-8 flex-column align-items-center">
					<Board board={board} onClick={handleClick} />
					<div
						style={{ minheight: "90px" }}
						className="d-flex flex-column justify-content-center "
					>
						<div>
							{!winner && currentPlayer !== computerChoice && (
								<p className="p-3 bg-info">Tocca a te!</p>
							)}
						</div>
						<div>
							{winner && winner !== "Pareggio" && winner === userChoice && (
								<p className="p-3 bg-success text-center">
									Complimenti, hai vinto!
								</p>
							)}

							{winner && winner !== "Pareggio" && winner === computerChoice && (
								<p className="p-3 bg-danger text-center">
									Mi dispiace, hai perso! Riprova
								</p>
							)}

							{winner && winner === "Pareggio" && (
								<p className="p-3 bg-warning text-center">Pareggio!</p>
							)}
						</div>

						<p className="mb-5 text-center">
							{winner && (
								<button className="btn btn-primary" onClick={handleResetGame}>
									Rinizia il gioco
								</button>
							)}
						</p>
					</div>
				</div>

				<div className="col-4 flex-column points ">
					<p className="p-3 bg-success text-center">Vittorie: {countUserWin}</p>
					<p className="p-3 bg-danger text-center">
						Sconfitte: {countUserLose}
					</p>
					<p className="p-3 bg-warning text-center">Pareggi: {countDraw}</p>
					<button
						className="p-3 btn btn-primary text-center"
						onClick={handleResetPoints}
					>
						Resetta i punteggi
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
