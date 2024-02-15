"use client";
import Menu from "@/components/Menu";
import { sign } from "crypto";
import { useState, useEffect, use } from 'react';

export default function Black() {


    type TableData = {
        [key: number]: {
            [key: number]: string;
        };
    }


    let Single: TableData = {
        8: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        9: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        10: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'H', 10: 'H', 11: 'H' },
        11: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'D', 11: 'D' },
        12: { 2: 'H', 3: 'H', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        13: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        14: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        15: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        16: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
    }

    //from 17 just stand

    let As: TableData = {
        2: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        3: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        4: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        5: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        6: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        7: { 2: 'S', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'S', 8: 'S', 9: 'H', 10: 'H', 11: 'H' },
        8: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
    }

    let double: TableData = {
        2: { 2: 'P/H', 3: 'P/H', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        3: { 2: 'P/H', 3: 'P/H', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        4: { 2: 'H', 3: 'H', 4: 'H', 5: 'P/H', 6: 'P/H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        5: { 2: 'D/H', 3: 'D/H', 4: 'D/H', 5: 'D/H', 6: 'D/H', 7: 'D/H', 8: 'D/H', 9: 'H', 10: 'H', 11: 'H' },
        6: { 2: 'P/H', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        7: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
        8: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'Split', 9: 'Split', 10: 'Split', 11: 'Split' },
        9: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'S', 8: 'Split', 9: 'Split', 10: 'S', 11: 'S' },
        10: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
        1: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'Split', 9: 'Split', 10: 'Split', 11: 'Split' },
    }

    const [cardnumber, setCardnumber] = useState(2)
    const [yourHand, setYourHand] = useState(0)
    const [cards, setCards] = useState([0])
    const [dealer, setDealer] = useState(0)
    const [choise, setChoise] = useState("")

    const handleInputChange = (i: number, event: React.FormEvent<HTMLInputElement>) => {

        const v = Number((event.target as HTMLInputElement).value);

        const newCards = cards;
        newCards[i - 1] = v > 0 && v < 22 ? v : 0;
        setCards(newCards);

        const sum = cards.reduce((a, b) => a + b, 0);
        setYourHand(sum);
    }

    useEffect(() => {
        //check if cards contains a 1
        if (cards.includes(1) && cards[0] !== cards[1]) {
            //check if we can use the ace as 11
            if (yourHand + 10 <= 21) {
                setYourHand(yourHand + 10);
            }

            //get the other card as a number from cards array
            const otherCard = cards.filter((c) => c !== 1)[0];

            if (!As[otherCard] || !As[otherCard][dealer]) {
                setChoise("Stand");
            } else {
                setChoise(As[otherCard][dealer]);
            }
        } else if (cards.length === 2 && cards[0] === cards[1]) {
            if (!double[cards[0]] || !double[cards[0]][dealer]) {
                setChoise("S");
            } else {
                setChoise(double[cards[0]][dealer]);
            }
        } else if (!Single[yourHand] || !Single[yourHand][dealer]) {
            if (yourHand < 8) {
                setChoise("H");
            } else {
                setChoise("Stand");
            }
        } else {
            setChoise(Single[yourHand][dealer]);
        }

    }, [yourHand, dealer, cards])


    useEffect(() => {
        if (yourHand < 21) {
            setCardnumber(cards.length + 1);
        }
        cards.forEach((c, i) => {
            if (c === 0) {
                setCardnumber(cardnumber - 1);
            }
        })
    }, [yourHand])

    return (

        <>
            <Menu />
            <div>
                {yourHand > 21 ? <p className="text-red-500">BUST</p> : <p className="text-green-500">NOT BUST</p>}

                <p>Your hand:{yourHand}</p>
                <p>Dealers hand:{dealer}</p>

                <p>Cards: {cards.map((card, index) => (
                    <span key={index}>{card} </span>
                ))}</p>
            </div>
            <div className="flex justify-center w-2/3 mx-auto">
                <div className={yourHand > 21 ? "flex flex-col border border-red-500 w-1/3 m-2" : "flex flex-col w-1/3 m-2"}>
                    <h1 className="text-4xl text-center">Your Hand</h1>

                    <div className="flex flex-wrap">
                        {Array.from({ length: cardnumber }, (_, i) => i + 1).map((i) => (
                            <input key={i} min="1" max="21" name={`card${i}`} type="number" placeholder={`Card ${i}`} className="input input-bordered text-2xl h-20 m-2 text-center"
                                onInput={event => handleInputChange(i, event)}
                            />
                        ))}
                    </div>
                    <input name="hand" min="1" max="21" type="nmber" placeholder="Your hand" value={yourHand} className="input input-bordered text-2xl h-20 m-2 text-center" disabled />
                </div>
                <div className="flex flex-col w-1/3 m-2">
                    <h1 className="text-4xl text-center">Dealer</h1>
                    <input name="dealer" min="1" max="21" type="number" placeholder="Dealers hand" className="input input-bordered input-accent text-2xl h-20 m-2 text-center"

                        onInput={event => {
                            let v = Number((event.target as HTMLInputElement).value);
                            if (v === 1) {
                                v = 11;
                            }
                            setDealer(v);
                        }
                        }
                    />
                </div>

                <div className="flex flex-col w-1/3 m-2">
                    <h1 className="text-4xl text-center">Choice</h1>
                    <input name="out" min="1" max="21" type="nmber" value={choise} placeholder="Your choise" disabled className="input input-bordered text-2xl h-20 m-2 text-center" />
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button className="btn btn-outline m-2"
                    onClick={() => window.location.reload()}
                >
                    Reset
                </button>
            </div>

            <div className="flex justify-center items-center">
                <div className="overflow-x-auto w-1/2">
                    <table className="table text-lg">
                        <thead>
                            <tr>
                                <th>Dealer <br />Your cards</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>6</th>
                                <th>7</th>
                                <th>8</th>
                                <th>9</th>
                                <th>10</th>
                                <th>A</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(Single).map((key) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{Single[Number(key)][2]}</td>
                                    <td>{Single[Number(key)][3]}</td>
                                    <td>{Single[Number(key)][4]}</td>
                                    <td>{Single[Number(key)][5]}</td>
                                    <td>{Single[Number(key)][6]}</td>
                                    <td>{Single[Number(key)][7]}</td>
                                    <td>{Single[Number(key)][8]}</td>
                                    <td>{Single[Number(key)][9]}</td>
                                    <td>{Single[Number(key)][10]}</td>
                                    <td>{Single[Number(key)][11]}</td>
                                </tr>
                            ))}
                            {Object.keys(As).map((key) => (
                                <tr key={key}>
                                    <td>A + {key}</td>
                                    <td>{As[Number(key)][2]}</td>
                                    <td>{As[Number(key)][3]}</td>
                                    <td>{As[Number(key)][4]}</td>
                                    <td>{As[Number(key)][5]}</td>
                                    <td>{As[Number(key)][6]}</td>
                                    <td>{As[Number(key)][7]}</td>
                                    <td>{As[Number(key)][8]}</td>
                                    <td>{As[Number(key)][9]}</td>
                                    <td>{As[Number(key)][10]}</td>
                                    <td>{As[Number(key)][11]}</td>
                                </tr>
                            ))}
                            {Object.keys(double).map((key) => (
                                <tr key={key}>
                                    <td>{key} + {key}</td>
                                    <td>{double[Number(key)][2]}</td>
                                    <td>{double[Number(key)][3]}</td>
                                    <td>{double[Number(key)][4]}</td>
                                    <td>{double[Number(key)][5]}</td>
                                    <td>{double[Number(key)][6]}</td>
                                    <td>{double[Number(key)][7]}</td>
                                    <td>{double[Number(key)][8]}</td>
                                    <td>{double[Number(key)][9]}</td>
                                    <td>{double[Number(key)][10]}</td>
                                    <td>{double[Number(key)][11]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
