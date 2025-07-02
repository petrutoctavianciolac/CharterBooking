import { useState } from "react";
import "./seatmap.css";

const SeatMapS = ({ seats, model, columns, rows, seatss, ns, onSelectionChange }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeatSelection = (seat) => {
        const isSelected = selectedSeats.some((s) => s._id === seat._id);
        const updated = isSelected
            ? selectedSeats.filter((s) => s._id !== seat._id)
            : [...selectedSeats, seat];

        setSelectedSeats(updated);
        onSelectionChange(updated); 
    };

    const sortedSeats = [...seats].sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.column.localeCompare(b.column);
    });

    const seatStatusMap = new Map(
    seatss.map((s) => [s.seatNumber, s.status])
    );


    const renderSeat = (seat) => {

        const status = seatStatusMap.get(seat.seatNumber);
        const isBooked = status !== "available";

        let classes = "seat";
        if (seat.isWindow) classes += " window";
        if (seat.isAisle) classes += " aisle";
        if (seat.isExitRow) classes += " exit";
        if (isBooked) classes += " booked";
        if (selectedSeats.some((s) => s._id === seat._id)) classes += " selected";
        

        return (
            <div key={seat._id} className={classes} onClick={() => toggleSeatSelection(seat)}>
                {seat.seatNumber}
            </div>
        );
    };

    return (
        <div className="seatmap">
            <h3>{model} seat map</h3>

            <div className="seat-selection-status">
                {selectedSeats.length} / {ns} seats selected
                </div>


            <div className="seat-legend">
                <div><span className="legend-box window" /> Window Seat</div>
                <div><span className="legend-box aisle" /> Aisle Seat</div>
                <div><span className="legend-box exit" /> Exit Row</div>
                <div><span className="legend-box selected" /> Selected</div>
                <div><span className="legend-box booked" /> Unavailable Seats</div>
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

export default SeatMapS;
