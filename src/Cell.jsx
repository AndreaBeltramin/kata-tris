export default function Cell({ value, onClick }) {
	return (
		<div
			className="cell d-flex align-items-center justify-content-center"
			onClick={onClick}
		>
			<h1>{value}</h1>
		</div>
	);
}
