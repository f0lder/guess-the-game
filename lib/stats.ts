export const STATS_EVENT = "guess-stats-updated";

type StatKey = "wonGames" | "lostGames";

const HISTORY_KEY = "gameHistory";
// Only the most recent games are kept; the won/lost counters still count every game.
const MAX_HISTORY = 100;

export type GameResult = "won" | "lost" | "gave-up";

export type GameRecord = {
	id: number;
	name: string;
	image: string | null;
	result: GameResult;
	/** how many screenshots were unlocked when the game ended */
	imagesUsed: number;
	totalImages: number;
	firstTry: boolean;
	/** wrong guesses and skips, in order */
	guesses: string[];
	/** ISO timestamp */
	playedAt: string;
};

function read(key: StatKey): number {
	try {
		return Number(window.localStorage.getItem(key)) || 0;
	} catch {
		return 0;
	}
}

export function readStats() {
	return { won: read("wonGames"), lost: read("lostGames") };
}

export function readHistory(): GameRecord[] {
	try {
		const raw = window.localStorage.getItem(HISTORY_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/** Saves a finished game: bumps the won/lost counter and prepends it to the history. */
export function recordGame(record: GameRecord) {
	const key: StatKey = record.result === "won" ? "wonGames" : "lostGames";
	try {
		window.localStorage.setItem(key, String(read(key) + 1));
		const history = [record, ...readHistory()].slice(0, MAX_HISTORY);
		window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
	} catch {
		// storage unavailable (private mode, blocked, full) - the game just won't persist
	}
	window.dispatchEvent(new Event(STATS_EVENT));
}

/**
 * Calls `onChange` now and whenever stats/history change, in this tab or another one.
 * Returns an unsubscribe function, so it can be returned straight from a useEffect.
 */
export function subscribeStats(onChange: () => void) {
	onChange();
	window.addEventListener(STATS_EVENT, onChange);
	window.addEventListener("storage", onChange);
	return () => {
		window.removeEventListener(STATS_EVENT, onChange);
		window.removeEventListener("storage", onChange);
	};
}

/** Clears the history and the won/lost counters. */
export function clearAll() {
	try {
		window.localStorage.removeItem(HISTORY_KEY);
		window.localStorage.removeItem("wonGames");
		window.localStorage.removeItem("lostGames");
	} catch {
		// ignore
	}
	window.dispatchEvent(new Event(STATS_EVENT));
}
