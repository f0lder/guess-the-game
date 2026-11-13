"use client";
//TODO: random zoom on image to make it harder to see

import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { bumpStat } from "@/lib/stats";

type SearchResult = {
	id: number;
	name: string;
};

type SearchData = {
	count: number;
	hasMore: boolean;
	results: SearchResult[];
};

type Game = {
	id: number;
	name: string;
	background_image: string;
	screenshots: {
		id: number;
		image: string;
		width: number;
		height: number;
	}[];
	metacritic: number | null;
	playtime: number;
	released: string | null;
	esrb_rating: { name: string } | null;
	platforms: { platform: { name: string } }[] | null;
	tags: { name: string }[] | null;
};

async function fetchResults(
	query: string,
	page: number,
	signal?: AbortSignal,
): Promise<SearchData> {
	const res = await fetch(
		`/api/games?search=${encodeURIComponent(query)}&page=${page}`,
		{ signal },
	);
	if (!res.ok) throw new Error(`Search failed with status ${res.status}`);
	const d = await res.json();
	return d.data;
}

export default function Home() {
	const DEBUG = false;

	// --- the game to guess ---
	const [randomGame, setRandomGame] = useState<Game | null>(null);
	const [gameError, setGameError] = useState(false);

	// --- search ---
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [data, setData] = useState<SearchData | null>(null);
	const [page, setPage] = useState(1);
	const [fetching, setFetching] = useState(false);
	const [searchError, setSearchError] = useState(false);
	const activeQuery = useRef("");

	// --- game progress ---
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	// how many screenshots are unlocked; one guess per screenshot
	const [unlocked, setUnlocked] = useState(1);
	const [history, setHistory] = useState<string[]>([]);
	const [guessedIds, setGuessedIds] = useState<number[]>([]);
	const [win, setWin] = useState(false);
	const [lose, setLose] = useState(false);
	const [firstTry, setFirstTry] = useState(false);

	const gameOver = win || lose;
	const totalImages = randomGame?.screenshots.length ?? 0;

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				const res = await fetch("/api/games/random", {
					signal: controller.signal,
				});
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const d = await res.json();
				if (!d.data?.screenshots?.length) throw new Error("No screenshots");
				setRandomGame(d.data);
			} catch {
				if (!controller.signal.aborted) setGameError(true);
			}
		})();
		return () => controller.abort();
	}, []);

	// Hint N is shown on screenshot N+1 (the first screenshot has no hint).
	// Missing data is skipped so later screenshots still get a hint.
	const hints = useMemo(() => {
		if (!randomGame) return [];
		const g = randomGame;
		return [
			g.metacritic ? `Metacritic score: ${g.metacritic}` : "",
			g.playtime ? `Playtime: ${g.playtime} hours` : "",
			g.released ? `Released: ${g.released}` : "",
			g.esrb_rating ? `ESRB Rating: ${g.esrb_rating.name}` : "",
			g.platforms?.length
				? `Platforms: ${g.platforms.map((p) => p.platform.name).join(", ")}`
				: "",
			g.tags?.length
				? `Tags: ${g.tags
						.slice(0, 5)
						.map((t) => t.name)
						.join(", ")}`
				: "",
		].filter(Boolean);
	}, [randomGame]);
	const currentHint =
		currentImageIndex > 0 ? hints[currentImageIndex - 1] : undefined;

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(search.trim()), 1000);
		return () => clearTimeout(timer);
	}, [search]);

	useEffect(() => {
		activeQuery.current = debouncedSearch;
		setData(null);
		setPage(1);
		setSearchError(false);
		setFetching(false);

		if (!debouncedSearch) return;

		const controller = new AbortController();
		setFetching(true);
		fetchResults(debouncedSearch, 1, controller.signal)
			.then(setData)
			.catch(() => {
				if (!controller.signal.aborted) setSearchError(true);
			})
			.finally(() => {
				if (!controller.signal.aborted) setFetching(false);
			});

		return () => controller.abort();
	}, [debouncedSearch]);

	const loadMore = async () => {
		const query = debouncedSearch;
		const nextPage = page + 1;
		setFetching(true);
		try {
			const d = await fetchResults(query, nextPage);
			if (activeQuery.current !== query) return; // search changed meanwhile
			setData((prev) => {
				if (!prev) return d;
				const seen = new Set(prev.results.map((r) => r.id));
				return {
					...d,
					results: [...prev.results, ...d.results.filter((r) => !seen.has(r.id))],
				};
			});
			setPage(nextPage);
		} catch {
			if (activeQuery.current === query) setSearchError(true);
		} finally {
			if (activeQuery.current === query) setFetching(false);
		}
	};

	const isLoading = search.trim() !== debouncedSearch || fetching;

	const clearSearch = () => {
		setSearch("");
		setDebouncedSearch("");
	};

	const endGame = (won: boolean) => {
		if (gameOver) return;
		if (won) {
			setWin(true);
			bumpStat("wonGames");
		} else {
			setUnlocked(totalImages);
			setLose(true);
			bumpStat("lostGames");
		}
	};

	// A skip or a wrong guess: unlock the next screenshot, or lose if none are left.
	const advance = (message: string) => {
		if (gameOver || !randomGame) return;
		setHistory((h) => [...h, message]);
		if (unlocked >= totalImages) {
			endGame(false);
			return;
		}
		setCurrentImageIndex(unlocked);
		setUnlocked(unlocked + 1);
	};

	const handleGuess = (game: SearchResult) => {
		clearSearch();
		if (game.id === randomGame?.id) {
			if (unlocked === 1) setFirstTry(true);
			endGame(true);
		} else {
			setGuessedIds((ids) => [...ids, game.id]);
			advance(game.name || "Unknown game");
		}
	};

	if (gameError) {
		return (
			<div className="flex flex-col gap-4 items-center justify-center w-full h-screen">
				<p>Could not load a game. The game API might be down or rate limited.</p>
				<button
					type="button"
					className="btn btn-outline"
					onClick={() => window.location.reload()}
				>
					Try again
				</button>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen">
			{randomGame ? (
				<div className="flex flex-col justify-center items-center max-w-xl mx-auto">
					{DEBUG && <div>{randomGame.name}</div>}

					<div className="max-w-3xl">
						<Image
							src={randomGame.screenshots[currentImageIndex].image}
							alt={"guess"}
							width={randomGame.screenshots[currentImageIndex].width / 2}
							height={randomGame.screenshots[currentImageIndex].height / 2}
							quality={50}
							priority={true}
							className="w-fit border border-gray-700"
						/>

						{currentHint && (
							<p className="bg-primary text-white dark:text-black text-center text-xl">
								{currentHint}
							</p>
						)}
					</div>

					<div className="w-full mx-auto grid sm:grid-flow-col gap-2 my-4">
						{randomGame.screenshots.map((screenshot, index) => (
							<button
								type="button"
								key={screenshot.id}
								className={`btn ${index === currentImageIndex ? " btn-primary" : ""} ${firstTry ? "btn-success" : ""}`}
								onClick={() => setCurrentImageIndex(index)}
								disabled={index >= unlocked && !gameOver}
							>
								{index + 1}
							</button>
						))}
						<button
							type="button"
							className="btn btn-secondary col-span-6 sm:col-span-1"
							onClick={() => advance(`Skipped picture number ${unlocked}`)}
							disabled={gameOver}
						>
							SKIP
						</button>
					</div>

					{gameOver && (
						<div className="w-full grid grid-cols-1 md:grid-flow-col gap-2">
							{win && (
								<button type="button" className="btn btn-success">
									You win: {randomGame.name}
								</button>
							)}

							{lose && (
								<button type="button" className="btn btn-error">
									You lose. The game was {randomGame.name}
								</button>
							)}

							<button
								type="button"
								className="btn btn-outline"
								onClick={() => {
									window.location.reload();
								}}
							>
								New game?
							</button>
						</div>
					)}

					{!gameOver && (
						<input
							type="text"
							placeholder="Search for a game"
							className="input input-bordered w-full rounded-none focus:outline-none"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					)}

					{!gameOver && search.trim().length > 0 && (
						<div className="w-full border-b border-x border-gray-700">
							{data?.results.map((game) => {
								const alreadyGuessed = guessedIds.includes(game.id);
								return (
									<button
										key={game.id}
										type="button"
										className={`p-1 rounded-none w-full text-left ${alreadyGuessed ? "line-through opacity-50" : ""}`}
										disabled={alreadyGuessed || isLoading}
										onClick={() => handleGuess(game)}
									>
										{game.name}
									</button>
								);
							})}

							{isLoading ? (
								<div className="flex items-center justify-center m-5">
									<div className="loading loading-spinner size-10 mx-auto" />
								</div>
							) : searchError ? (
								<p className="p-2 text-error">Search failed, try again.</p>
							) : data && data.results.length === 0 ? (
								<p className="p-2">No games found.</p>
							) : (
								data?.hasMore && (
									<button
										type="button"
										className="btn btn-ghost btn-sm w-full rounded-none"
										onClick={loadMore}
									>
										More results
									</button>
								)
							)}
						</div>
					)}

					{history.length > 0 && (
						<div className="grid grid-flow-row gap-2 w-full">
							<div className="w-full grid grid-cols-3">
								<div className="divider" />
								<p className="text-center flex items-center justify-center">
									Guess History
								</p>
								<div className="divider" />
							</div>
							{history.map((entry, i) => (
								<div
									key={i}
									className="btn btn-outline w-full btn-warning pointer-events-none"
								>
									{entry}
								</div>
							))}
						</div>
					)}

					{!gameOver && (
						<button
							type="button"
							className="btn btn-outline btn-error mt-4"
							onClick={() => endGame(false)}
						>
							Give up?
						</button>
					)}
				</div>
			) : (
				<div className="flex items-center justify-center w-full h-screen">
					<div className="loading loading-spinner size-10" />
				</div>
			)}
		</div>
	);
}
