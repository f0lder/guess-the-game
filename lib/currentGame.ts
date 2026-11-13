// The game in progress is kept in localStorage so reloading the page (or opening
// another tab) resumes it instead of rolling a new game without counting a loss.

export const CURRENT_GAME_KEY = "currentGame";

export type GameProgress<G> = {
	game: G;
	unlocked: number;
	currentImageIndex: number;
	history: string[];
	guessedIds: number[];
};

export function parseProgress<G extends { screenshots: unknown[] }>(
	raw: string | null,
): GameProgress<G> | null {
	if (!raw) return null;
	try {
		const p = JSON.parse(raw);
		const valid =
			p &&
			Array.isArray(p.game?.screenshots) &&
			p.game.screenshots.length > 0 &&
			Number.isInteger(p.unlocked) &&
			p.unlocked >= 1 &&
			p.unlocked <= p.game.screenshots.length &&
			Number.isInteger(p.currentImageIndex) &&
			p.currentImageIndex >= 0 &&
			p.currentImageIndex < p.unlocked &&
			Array.isArray(p.history) &&
			Array.isArray(p.guessedIds);
		return valid ? p : null;
	} catch {
		return null;
	}
}

export function loadCurrentGame<G extends { screenshots: unknown[] }>() {
	try {
		return parseProgress<G>(window.localStorage.getItem(CURRENT_GAME_KEY));
	} catch {
		return null;
	}
}

export function saveCurrentGame<G>(progress: GameProgress<G>) {
	try {
		window.localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(progress));
	} catch {
		// storage unavailable - the game just won't survive a reload
	}
}

export function clearCurrentGame() {
	try {
		window.localStorage.removeItem(CURRENT_GAME_KEY);
	} catch {
		// ignore
	}
}
