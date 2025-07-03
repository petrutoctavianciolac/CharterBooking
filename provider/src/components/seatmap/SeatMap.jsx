import "./seatmap.css";

const SeatMap = ({ seats, model, columns, rows }) => {
    
    const sortedSeats = [...seats].sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.column.localeCompare(b.column);
    });

    const renderSeat = (seat) => {
        let classes = "seat";
        if (seat.isWindow) classes += " window";
        if (seat.isAisle) classes += " aisle";
        if (seat.isExitRow) classes += " exit";

        return (
            <div key={seat._id} className={classes}>
                {seat.seatNumber}
            </div>
        );
    };

    return (
        <div className="seatmap">
            <h3>{model} seat map</h3>

           <div className="seat-legend">
                <div><span className="legend-box window" /> Window Seat</div>
                <div><span className="legend-box aisle" /> Aisle Seat</div>
                <div><span className="legend-box exit" /> Exit Row</div>
            </div>

            {Array.from({ length: rows }, (_, rowIndex) => {
                const rowNumber = rowIndex + 1;
                return (
                    <div className="seat-row" key={rowNumber}>
                        {columns.map((col, colIndex) => {
                            const seat = sortedSeats.find(
                                (s) => s.row === rowNumber && s.column === col
                            );

                            const mid = Math.floor(columns.length / 2);
                            return (
                                <>
                                    {seat ? (
                                        renderSeat(seat)
                                    ) : (
                                        <div className="seat empty" key={`${rowNumber}${col}`} />
                                    )}
                                    {colIndex === mid - 1 && (
                                        <div className="aisle-spacer" key={`aisle-${rowNumber}-${col}`} />
                                    )}
                                </>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default SeatMap;