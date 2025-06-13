import Cell from "./Cell";

export default function Board({ board, onClick }) {
	return (
		<div className="board">
			{board.map((value, index) => (
				<Cell key={index} onClick={() => onClick(index)} value={value} />
			))}
		</div>
	);
}
