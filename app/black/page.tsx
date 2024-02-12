"use client";
import Menu from "@/components/Menu";
import { useState, useEffect } from 'react';

export default function Black() {

    const tableData = {
        8: { 9: 'H', 10: 'H', 11: 'cell3' },
        9: { 9: 'H', 10: 'H', 11: 'cell3' },
        10: { 9: 'H', 10: 'H', 11: 'cell3' },
        11: { 9: 'H', 10: 'H', 11: 'cell3' },

    }

    const headers = Object.keys(tableData[8]);

    const [cardnumber, setCardnumber] = useState(2)
    const [yourHand, setYourHand] = useState(0)
    const [cards, setCards] = useState([0])

    const handleInputChange = (i: number, event: React.FormEvent<HTMLInputElement>) => {
        const newCards = cards;
        newCards[i] = Number((event.target as HTMLInputElement).value);
        setCards(newCards);
        console.log(newCards);

        const sum = cards.reduce((a, b) => a + b, 0);
        setYourHand(sum);
    }

    return (    

        <>
            <Menu />


            <div>
                <button className="btn btn-error"
                    onClick={() => setCardnumber(cardnumber + 1)}
                >
                    HIT
                </button>
                <button className="btn btn-outline"
                    onClick={() => setCardnumber(2)}
                >
                    Reset
                </button>


                {yourHand > 21 ? <p>BUST</p> : <p>Not BUST</p>}

                <p>Your hand:{yourHand}</p>

            </div>

            <div className="flex items-center justify-center">
                {Array.from({ length: cardnumber }, (_, i) => i + 1).map((i) => (
                    <input key={i} name={`card${i}`} type="number" placeholder={`Card ${i}`} className="input input-bordered w-full max-w-xs m-2"
                        onInput={event => handleInputChange(i, event)}
                    />
                ))}
                <input name="dealer" type="number" placeholder="Dealers hand" className="input input-bordered input-accent w-full max-w-xs" />
                <input name="out" type="nmber" placeholder="Your choise" disabled className="input input-bordered w-full max-w-xs m-2" />
            </div>

            <>
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(tableData).map(([rowKey, columns]) => (
                            <tr key={rowKey}>
                                {Object.entries(columns).map(([colKey, cell]) => (
                                    <td key={colKey}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        </>
    )
}
