"use client";


//TODO: random zoom on image to make it harder to see

import Image from "next/image";
import { useState, useEffect, use } from "react";
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
}
type Game = {
	id: number;
	name: string;
	background_image: string;
	short_screenshots: {
		id: number;
		image: string;
	}[];
}


export default function Home() {

	const DEBUG = false;
	 
	const [data, setData] = useState<Data | null>(null);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingGame, setLoadingGame] = useState(true);
	const [randomGame, setRandomGame] = useState<Game | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [disabledIndex, setDisabledIndex] = useState(1);
	const [skips, setSkips] = useState<string[]>([]);
	const [win, setWin] = useState(false);
	const [lose, setLose] = useState(false);

	useEffect(() => {
		const fetchRandomGame = async () => {
			const res = await fetch('/api/games/random');
			const d = await res.json();
			setRandomGame(d.data);
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
			const res = await fetch(`/api/games?search=${encodeURIComponent(search)}&page=${encodeURIComponent(page)}`);

			if (!res.ok) {
				setData(null);
				return;
			}

			const d = await res.json();

			console.log(res);

			console.log(d);
			setData(d.data);
			setLoading(false);

		};

		if (debouncedSearch) {
			fetchData(search, "1");
		}

	}, [debouncedSearch,search]);


	useEffect(() => {
		if (randomGame && disabledIndex >= randomGame.short_screenshots.length){
			setLose(true);
		}
	},[randomGame, disabledIndex,lose]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		setLoading(true);

		if (!e.target.value) {
			setLoading(false)
		}
	};

	const handleSkip = (message:string) => {
		if (currentImageIndex < (randomGame?.short_screenshots.length ?? 0)) {
			setDisabledIndex(disabledIndex + 1);
			setCurrentImageIndex(disabledIndex);
			setSkips([...skips, message]);
		} else {
			setLose(true);
		 }
	};

	useEffect(() => {
		setLoadingGame(true);
	},[]);

	return (
		<div>
			<Menu />

			{randomGame && (
				<div className="flex flex-col justify-center items-center">
					<div role="alert" className="alert alert-warning m-2 w-1/3">
						<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
						<span>Warning: Slow loading due to low server resources!</span>
					</div>
					<div className="flex justify-center m-3 overflow-hidden">
						{DEBUG && (
							<div>
								{randomGame.name}
							</div>
						)}

						<Image
							src={randomGame.short_screenshots[currentImageIndex].image}
							alt={"guess"}
							width={1000}
							height={1000}
							style={{ maxHeight: '1000px', width: "1000px" }}
							quality={70}
							onLoad={() => setLoadingGame(false)}
						/>
						{loadingGame && (
							<div className="flex justify-center">
								<div className="skeleton h-52 w-full"></div>
							</div>
						)}
					</div>

					<div className="flex items-center justify-center">
						{randomGame.short_screenshots.map((screenshot, index) => (
							<button
								key={screenshot.id}
								className={`btn p-3 m-2 w-12 h-12${index === currentImageIndex ? ' btn-primary' : ''}`}
								onClick={() => setCurrentImageIndex(index)}
								disabled={index >= disabledIndex && !win}>
									{index + 1}
							</button>
						))}
						<button
							className="btn btn-secondary p-3 m-2 w-12 h-12"
							onClick={() => handleSkip("Skipped")}
							disabled={disabledIndex >= randomGame.short_screenshots.length || win}

						>
							Skip
						</button>
					</div>
					<div>
						{win && (
							<div className="flex items-center justify-center mt-4">
								<button className="btn btn-success">You win: {randomGame.name}</button>
							</div>
						)}
					</div>
					<div>
						{lose && (
							<div className="flex items-center justify-center mt-4">
								<button className="btn btn-error">You lose. The game was {randomGame.name}</button>
							</div>
						)}
					</div>
				</div>
				
			)}
			<div className="flex flex-col items-center mt-10">

				<input
					type="text"
					placeholder="Search for a game"
					className="input input-bordered w-1/3 mb-3"
					value={search}
					onChange={handleInput}
					disabled={win || lose}
				/>
				<div className="w-1/3">
					{loading ? (
						<div className="">
							<div className="btn skeleton w-full p-3 m-2"></div>
							<div className="btn skeleton w-full p-3 m-2"></div>
							<div className="btn skeleton w-full p-3 m-2"></div>
							<div className="btn skeleton w-full p-3 m-2"></div>
							<div className="btn skeleton w-full p-3 m-2"></div>
						</div>
					) : (
						!(win || lose) && search && data && data.results && data.results.map((game) => (
							<div key={game.id}>
								<button
									className="btn p-3 m-2 w-full"
									onClick={() => {
										if (game.name === randomGame?.name) {
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
				<div className="flex flex-col items-center mt-3 w-full">
					{skips.map((skip, index) => (
						<div key={index} className="btn btn-warning m-1 w-1/3">{skip}</div>
					))}
				</div>
			</div>
		</div>
	);
}