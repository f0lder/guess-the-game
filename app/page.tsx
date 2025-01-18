"use client";
//TODO: random zoom on image to make it harder to see

import Image from "next/image";
import { useState, useEffect } from "react";
import Menu from "@/components/Menu";

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
		<div className="w-full h-screen">
			<Menu />

			{randomGame && (
				<div className="flex flex-col justify-center items-center">
					<div className="flex justify-center m-3 overflow-hidden">
						{DEBUG && <div>{randomGame.name}</div>}

						<div>
							<Image
								src={randomGame.screenshots[currentImageIndex].image}
								alt={"guess"}
								width={randomGame.screenshots[currentImageIndex].width / 2}
								height={randomGame.screenshots[currentImageIndex].height / 2}
								quality={50}
								unoptimized={true}
								priority={true}
								className="max-w-3xl"
							/>
							{hints && (
								<p className="bg-primary text-white dark:text-black text-center text-xl">
									{hints[currentImageIndex]}
								</p>
							)}
						</div>
					</div>

					<div className="flex flex-wrap flex-col sm:flex-row">
						<div className="flex flex-wrap justify-center items-center">
							{randomGame.screenshots.map((screenshot, index) => (
								<button
									type="button"
									key={screenshot.id}
									className={`btn p-3 m-2 w-12 h-12${index === currentImageIndex ? " btn-primary" : ""} ${fisrttry ? "btn-success" : ""}`}
									onClick={() => setCurrentImageIndex(index)}
									disabled={index >= disabledIndex && !win}
								>
									{index + 1}
								</button>
							))}
						</div>
						<button
							type="button"
							className="btn btn-secondary p-3 m-2 w-full sm:w-12 h-12"
							onClick={() =>
								handleSkip(`Skipped picture number ${currentImageIndex + 1}`)
							}
							disabled={disabledIndex >= randomGame.screenshots.length || win}
						>
							Skip
						</button>
					</div>

					{win && (
						<div className="flex items-center justify-center mt-4">
							<button type="button" className="btn btn-success">
								You win: {randomGame.name}
							</button>
						</div>
					)}

					{lose && (
						<div className="flex items-center justify-center mt-4">
							<button type="button" className="btn btn-error">
								You lose. The game was {randomGame.name}
							</button>
						</div>
					)}
					{(win || lose) && (
						<button
							type="button"
							className="btn btn-outline mt-4"
							onClick={() => {
								window.location.reload();
							}}
						>
							New game?
						</button>
					)}
				</div>
			)}
			<div className="flex flex-col items-center mt-10">
				{!(win || lose) && (
					<input
						type="text"
						placeholder="Search for a game"
						className="input input-bordered w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
						value={search}
						onChange={handleInput}
					/>
				)}

				<div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
					{loading ? (
						<div className="">
							<div className="btn skeleton w-full p-3 m-2" />
							<div className="btn skeleton w-full p-3 m-2" />
							<div className="btn skeleton w-full p-3 m-2" />
							<div className="btn skeleton w-full p-3 m-2" />
							<div className="btn skeleton w-full p-3 m-2" />
						</div>
					) : (
						!(win || lose) &&
						search &&
						data &&
						data.results &&
						data.results.map((game) => (
							<div key={game.id}>
								<button
								type="button"
									className="btn p-3 m-2 w-full"
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
							</div>
						))
					)}
				</div>
				{skips.length > 0 && (
					<div className="flex flex-col items-center mt-3 w-full p-2">
						<p>Guess History</p>
						{skips.map((skip, index) => (
							<div
								key={skip}
								className="btn btn-outline btn-warning m-2 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 pointer-events-none"
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
		</div>
	);
}
