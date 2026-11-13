"use client";
import { useState } from "react";

// Basic strategy tables. Rows = player hand, columns = dealer up card (11 = Ace).
type Table = Record<number, Record<number, string>>;

const DEALER_CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Hard totals. 8 or less: always hit. 17 or more: always stand.
const HARD: Table = {
	8: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	9: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	10: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'H', 11: 'H' },
	11: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'D', 11: 'D' },
	12: { 2: 'H', 3: 'H', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	13: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	14: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	15: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	16: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
};

// Soft hands, keyed by the value of the non-ace part (A+2 = soft 13 ... A+8 = soft 19).
// A+9 and up: always stand.
const SOFT: Table = {
	2: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	3: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	4: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	5: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	6: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	7: { 2: 'S', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'S', 8: 'S', 9: 'H', 10: 'H', 11: 'H' },
	8: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
};

// Pairs, keyed by card value (1 = Ace).
const PAIRS: Table = {
	1: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'Split', 9: 'Split', 10: 'Split', 11: 'Split' },
	2: { 2: 'P/H', 3: 'P/H', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	3: { 2: 'P/H', 3: 'P/H', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	4: { 2: 'H', 3: 'H', 4: 'H', 5: 'P/H', 6: 'P/H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	5: { 2: 'D/H', 3: 'D/H', 4: 'D/H', 5: 'D/H', 6: 'D/H', 7: 'D/H', 8: 'D/H', 9: 'D/H', 10: 'H', 11: 'H' },
	6: { 2: 'P/H', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	7: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
	8: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'Split', 8: 'Split', 9: 'Split', 10: 'Split', 11: 'Split' },
	9: { 2: 'Split', 3: 'Split', 4: 'Split', 5: 'Split', 6: 'Split', 7: 'S', 8: 'Split', 9: 'Split', 10: 'S', 11: 'S' },
	10: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 11: 'S' },
};

/** Parses a card input. Valid: 1-11, where 1 and 11 are both an Ace (stored as 1). */
function parseCard(value: string): number | null {
	if (value.trim() === "") return null;
	const v = Number(value);
	if (!Number.isInteger(v) || v < 1 || v > 11) return null;
	return v === 11 ? 1 : v;
}

/** Parses the dealer's up card. Ace (1 or 11) is stored as 11 to match the table columns. */
function parseDealer(value: string): number | null {
	const v = parseCard(value);
	if (v === null) return null;
	return v === 1 ? 11 : v;
}

function handValue(cards: number[]) {
	const hard = cards.reduce((a, b) => a + b, 0);
	// At most one ace can count as 11 without busting.
	const soft = cards.includes(1) && hard + 10 <= 21;
	return { total: soft ? hard + 10 : hard, soft };
}

function describe(code: string, canDouble: boolean, total: number, soft: boolean) {
	switch (code) {
		case "H":
			return "Hit";
		case "S":
			return "Stand";
		case "Split":
			return "Split";
		case "P/H":
			return "Split (hit if double after split isn't allowed)";
		case "D":
		case "D/H":
			if (canDouble) return "Double";
			// Doubling is only allowed on the first two cards.
			return soft && total === 18 ? "Stand" : "Hit";
		default:
			return code;
	}
}

function getAdvice(cards: number[], dealer: number | null): string {
	if (cards.length < 2) return "Enter your cards";
	if (dealer === null) return "Enter dealer card";

	const { total, soft } = handValue(cards);
	if (total > 21) return "Bust";
	if (total === 21) return "Stand";

	const firstTwo = cards.length === 2;
	let code: string;

	if (firstTwo && cards[0] === cards[1]) {
		code = PAIRS[cards[0]][dealer];
	} else if (soft) {
		code = SOFT[total - 11]?.[dealer] ?? "S";
	} else if (total < 8) {
		code = "H";
	} else {
		code = HARD[total]?.[dealer] ?? "S";
	}

	return describe(code, firstTwo, total, soft);
}

function StrategyRows({
	table,
	label,
	prefix,
}: {
	table: Table;
	label: (key: number) => string;
	prefix: string;
}) {
	return (
		<>
			{Object.keys(table).map((key) => (
				<tr key={`${prefix}-${key}`}>
					<td>{label(Number(key))}</td>
					{DEALER_CARDS.map((d) => (
						<td key={d}>{table[Number(key)][d]}</td>
					))}
				</tr>
			))}
		</>
	);
}

export default function Black() {
	const [cardInputs, setCardInputs] = useState<string[]>([]);
	const [dealerInput, setDealerInput] = useState("");

	const cards = cardInputs
		.map(parseCard)
		.filter((c): c is number => c !== null);
	const dealer = parseDealer(dealerInput);
	const { total, soft } = handValue(cards);
	const bust = total > 21;
	const advice = getAdvice(cards, dealer);

	// Always show the filled slots plus one empty one, until the hand reaches 21.
	const lastFilled = cardInputs.reduce((last, v, i) => (v.trim() ? i : last), -1);
	const slotCount = Math.max(2, lastFilled + (total >= 21 ? 1 : 2));

	const handleCardChange = (index: number, value: string) => {
		setCardInputs((prev) => {
			const next = [...prev];
			while (next.length <= index) next.push("");
			next[index] = value;
			return next;
		});
	};

	const reset = () => {
		setCardInputs([]);
		setDealerInput("");
	};

	return (
		<>
			<div>
				{bust ? <p className="text-red-500">BUST</p> : <p className="text-green-500">NOT BUST</p>}

				<p>Your hand: {soft ? `soft ${total}` : total}</p>
				<p>Dealers card: {dealer ?? "-"}</p>
				<p>Cards: {cards.join(" ")}</p>
			</div>
			<div className="flex justify-center w-2/3 mx-auto">
				<div className={bust ? "flex flex-col border border-red-500 w-1/3 m-2" : "flex flex-col w-1/3 m-2"}>
					<h1 className="text-4xl text-center">Your Hand</h1>

					<div className="flex flex-wrap">
						{Array.from({ length: slotCount }, (_, i) => {
							const value = cardInputs[i] ?? "";
							const invalid = value.trim() !== "" && parseCard(value) === null;
							return (
								<input
									key={i}
									min="1"
									max="11"
									name={`card${i + 1}`}
									type="number"
									placeholder={`Card ${i + 1}`}
									className={`input input-bordered text-2xl h-20 m-2 text-center ${invalid ? "input-error" : ""}`}
									value={value}
									onChange={(e) => handleCardChange(i, e.target.value)}
								/>
							);
						})}
					</div>
					<input name="hand" type="text" placeholder="Your hand" value={soft ? `soft ${total}` : total} className="input input-bordered text-2xl h-20 m-2 text-center" disabled />
				</div>
				<div className="flex flex-col w-1/3 m-2">
					<h1 className="text-4xl text-center">Dealer</h1>
					<input
						name="dealer"
						min="1"
						max="11"
						type="number"
						placeholder="Dealers card"
						className={`input input-bordered input-accent text-2xl h-20 m-2 text-center ${dealerInput.trim() && dealer === null ? "input-error" : ""}`}
						value={dealerInput}
						onChange={(e) => setDealerInput(e.target.value)}
					/>
				</div>

				<div className="flex flex-col w-1/3 m-2">
					<h1 className="text-4xl text-center">Choice</h1>
					<input name="out" type="text" value={advice} placeholder="Your choice" disabled className="input input-bordered text-2xl h-20 m-2 text-center" />
				</div>
			</div>
			<p className="text-center text-sm opacity-70">Cards are 1-11 (1 or 11 = Ace, 10 = any face card).</p>
			<div className="flex items-center justify-center">
				<button className="btn btn-outline m-2" onClick={reset}>
					Reset
				</button>
			</div>

			<div className="flex justify-center items-center">
				<div className="overflow-x-auto w-1/2">
					<table className="table text-lg">
						<thead>
							<tr>
								<th>Dealer <br />Your cards</th>
								{DEALER_CARDS.map((d) => (
									<th key={d}>{d === 11 ? "A" : d}</th>
								))}
							</tr>
						</thead>
						<tbody>
							<StrategyRows table={HARD} prefix="hard" label={(k) => String(k)} />
							<StrategyRows table={SOFT} prefix="soft" label={(k) => `A + ${k}`} />
							<StrategyRows table={PAIRS} prefix="pair" label={(k) => (k === 1 ? "A + A" : `${k} + ${k}`)} />
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
