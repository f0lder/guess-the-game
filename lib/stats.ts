export const STATS_EVENT = "guess-stats-updated";

type StatKey = "wonGames" | "lostGames";

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

export function bumpStat(key: StatKey) {
	try {
		window.localStorage.setItem(key, String(read(key) + 1));
	} catch {
		// storage unavailable (private mode, blocked) - stats just won't persist
	}
	window.dispatchEvent(new Event(STATS_EVENT));
}
