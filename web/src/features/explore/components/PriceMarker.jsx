"use client";

export function PriceMarker({ price, onClick, isSelected = false, available = true }) {
    if (isSelected) {
        return (
            <button
                onClick={onClick}
                className="bg-white text-green-600 px-3 py-2 rounded-full text-xs font-bold shadow-lg border-2 border-green-600 transition-all transform hover:scale-105"
                disabled={!available}
            >
                {price}€
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded-full text-xs font-bold shadow-lg transition-all transform hover:scale-105 border-2 border-white ${
                available 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
            disabled={!available}
        >
            {price}€
        </button>
    );
}