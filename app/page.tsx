"use client";
//TODO: random zoom on image to make it harder to see

import Image from "next/image";
import { useState, useEffect } from "react";
type Data = {
	count: number;
	next: string;
	previous: string;
	results: {
		id: number;
		name: string;
		background_image: string;
	}[];
};
type Game = {
	id: number;
	name: string;
	background_image: string;
	short_screenshots: {
		id: number;
		image: string;
	}[];
	screenshots: {
		id: number;
		image: string;
		width: number;
		height: number;
	}[];
	metacritic: number; // hint 1
	playtime: number; //hint 2
	released: string; //hint 3
	esrb_rating: {
		// hint 4
		name: string;
	};
	platforms: {
		//hint 5
		platform: {
			name: string;
		};
	}[];
	tags: {
		//hint 6
		name: string;
	}[];
};

export default function Home() {
	const DEBUG = false;

	const [data, setData] = useState<Data | null>(null);
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [randomGame, setRandomGame] = useState<Game | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [disabledIndex, setDisabledIndex] = useState(1);
	const [skips, setSkips] = useState<string[]>([]);
	const [win, setWin] = useState(false);
	const [lose, setLose] = useState(false);
	const [hints, setHints] = useState<string[]>([]);
	const [fisrttry, setFirstTry] = useState(false);

	useEffect(() => {
		if (win) {
			const wonGamesFromStorage = Number(
				window.localStorage.getItem("wonGames") || 0,
			);
			window.localStorage.setItem("wonGames", String(wonGamesFromStorage + 1));
		}
	}, [win]);

	useEffect(() => {
		if (lose) {
			const lostGamesFromStorage = Number(
				window.localStorage.getItem("lostGames") || 0,
			);
			window.localStorage.setItem(
				"lostGames",
				String(lostGamesFromStorage + 1),
			);
		}
	}, [lose]);

	useEffect(() => {
		const fetchRandomGame = async () => {
			const res = await fetch("/api/games/random");
			const d = await res.json();
			setRandomGame(d.data);
			if (d.data) {
				setHints([
					"",
					d.data.metacritic ? `Metacritic score: ${d.data.metacritic}` : "",
					d.data.playtime ? `Playtime: ${d.data.playtime} hours` : "",
					d.data.released ? `Released: ${d.data.released}` : "",
					d.data.esrb_rating ? `ESRB Rating: ${d.data.esrb_rating.name}` : "",
					d.data.platforms
						? `Platforms: ${d.data.platforms.map((p: { platform: { name: string } }) => p.platform.name).join(", ")}`
						: "",
					"",
				]);
			}
		};
		fetchRandomGame();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [search]);

	useEffect(() => {
		const fetchData = async (search: string, page: string) => {
			const res = await fetch(
				`/api/games?search=${encodeURIComponent(search)}&page=${encodeURIComponent(page)}`,
			);

			if (!res.ok) {
				setData(null);
				return;
			}

			const d = await res.json();

			setData(d.data);

			setLoading(false);
		};

		if (debouncedSearch) {
			fetchData(search, "1");
		}
	}, [debouncedSearch, search]);

	useEffect(() => {
		if (randomGame && disabledIndex >= randomGame.screenshots.length) {
			setLose(true);
		}
	}, [randomGame, disabledIndex]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		setLoading(true);

		if (!e.target.value) {
			setLoading(false);
		}
	};

	const handleSkip = (message: string) => {
		if (currentImageIndex < (randomGame?.screenshots.length ?? 0)) {
			setDisabledIndex(disabledIndex + 1);
			setCurrentImageIndex(disabledIndex);
			setSkips([...skips, message]);
		} else {
			setLose(true);
		}
	};

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
						
						{hints && (
							<p className="bg-primary text-white dark:text-black text-center text-xl">
								{hints[currentImageIndex]}
							</p>
						)}
					</div>

					<div className="w-full mx-auto grid sm:grid-flow-col gap-2 my-4">
						{randomGame.screenshots.map((screenshot, index) => (
							<button
								type="button"
								key={screenshot.id}
								className={`btn ${index === currentImageIndex ? " btn-primary" : ""} ${fisrttry ? "btn-success" : ""}`}
								onClick={() => setCurrentImageIndex(index)}
								disabled={index >= disabledIndex && !win}
							>
								{index + 1}
							</button>
						))}
						<button
							type="button"
							className="btn btn-secondary col-span-6 sm:col-span-1"
							onClick={() =>
								handleSkip(`Skipped picture number ${currentImageIndex + 1}`)
							}
							disabled={disabledIndex >= randomGame.screenshots.length || win}
						>
							SKIP
						</button>
					</div>

					{(win || lose) && (
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

					{!(win || lose) && (
						<input
							type="text"
							placeholder="Search for a game"
							className="input input-bordered w-full rounded-none focus:outline-none"
							value={search}
							onChange={handleInput}
						/>
					)}

					{search.length > 0 && (
						<div className="w-full border-b border-x border-gray-700">
							{loading ? (
								<div className="flex items-center justify-center m-5">
									<div className="loading loading-spinner size-10 mx-auto" />
								</div>
							) : (
								!(win || lose) &&
								search &&
								data &&
								data.results &&
								data.results.map((game) => (
									<button
										key={game.id}
										type="button"
										className="p-1 rounded-none w-full text-left"
										onClick={() => {
											setSearch("");
											if (game.name === randomGame?.name) {
												console.log(disabledIndex);
												if (disabledIndex === 1) {
													setFirstTry(true);
												}
												setWin(true);
											} else {
												handleSkip(game.name ?? "Skipped");
											}
										}}
									>
										{game.name}
									</button>
								))
							)}
						</div>
					)}
					{skips.length > 0 && (
						<div className="grid grid-flow-row gap-2 w-full">
							<div className="w-full grid grid-cols-3">
								<div className="divider" />
								<p className="text-center flex items-center justify-center">
									Guess History
								</p>
								<div className="divider" />
							</div>
							{skips.map((skip) => (
								<div
									key={skip}
									className="btn btn-outline w-full btn-warning pointer-events-none"
								>
									{skip}
								</div>
							))}
						</div>
					)}
					{!(win || lose) && (
						<button
							type="button"
							className="btn btn-outline btn-error mt-4"
							onClick={() => {
								setDisabledIndex(randomGame?.screenshots.length ?? 0);
								setLose(true);
							}}
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
