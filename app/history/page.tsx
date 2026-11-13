"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { clearAll, readHistory, subscribeStats, type GameRecord } from "@/lib/stats";

const RESULT_STYLE: Record<GameRecord["result"], { label: string; className: string }> = {
	won: { label: "Won", className: "badge-success" },
	lost: { label: "Lost", className: "badge-error" },
	"gave-up": { label: "Gave up", className: "badge-warning" },
};

export default function History() {
	// null = not read from storage yet (avoids flashing "no games" on load)
	const [games, setGames] = useState<GameRecord[] | null>(null);

	useEffect(() => subscribeStats(() => setGames(readHistory())), []);

	if (games === null) {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<div className="loading loading-spinner size-10" />
			</div>
		);
	}

	const wins = games.filter((g) => g.result === "won");
	const firstTries = wins.filter((g) => g.firstTry).length;
	const avgImages =
		wins.length > 0
			? (wins.reduce((sum, g) => sum + g.imagesUsed, 0) / wins.length).toFixed(1)
			: "-";

	return (
		<div className="w-full min-h-screen max-w-xl mx-auto px-4">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-3xl font-bold">Game history</h1>
				{games.length > 0 && (
					<button
						type="button"
						className="btn btn-outline btn-error btn-sm"
						onClick={() => {
							if (window.confirm("Delete your game history and reset your stats?")) {
								clearAll();
							}
						}}
					>
						Reset
					</button>
				)}
			</div>

			{games.length === 0 ? (
				<div className="text-center my-10">
					<p className="mb-4">No games played yet.</p>
					<a className="btn btn-primary" href="/">
						Play a game
					</a>
				</div>
			) : (
				<>
					<div className="stats stats-vertical sm:stats-horizontal w-full mb-4 bg-base-200">
						<div className="stat">
							<div className="stat-title">Games</div>
							<div className="stat-value">{games.length}</div>
						</div>
						<div className="stat">
							<div className="stat-title">First tries</div>
							<div className="stat-value text-success">{firstTries}</div>
						</div>
						<div className="stat">
							<div className="stat-title">Avg. image on win</div>
							<div className="stat-value">{avgImages}</div>
						</div>
					</div>

					<ul className="flex flex-col gap-2 mb-10">
						{games.map((game, i) => {
							const style = RESULT_STYLE[game.result] ?? RESULT_STYLE.lost;
							return (
								<li
									key={`${game.playedAt}-${i}`}
									className="flex gap-3 border border-gray-700 p-2"
								>
									{game.image ? (
										<Image
											src={game.image}
											alt={game.name}
											width={120}
											height={68}
											className="object-cover w-[120px] h-[68px] shrink-0"
										/>
									) : (
										<div className="w-[120px] h-[68px] bg-base-300 shrink-0" />
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											<span className="font-bold truncate">{game.name}</span>
											<span className={`badge ${style.className}`}>{style.label}</span>
											{game.firstTry && (
												<span className="badge badge-success badge-outline">
													First try!
												</span>
											)}
										</div>
										<p className="text-sm opacity-70">
											{game.result === "won"
												? `Guessed on image ${game.imagesUsed} of ${game.totalImages}`
												: `Saw ${game.imagesUsed} of ${game.totalImages} images`}
											{" · "}
											{new Date(game.playedAt).toLocaleString()}
										</p>
										{game.guesses.length > 0 && (
											<details className="text-sm">
												<summary className="cursor-pointer opacity-70">
													{game.guesses.length} wrong guess
													{game.guesses.length === 1 ? "" : "es"} / skips
												</summary>
												<ol className="list-decimal list-inside">
													{game.guesses.map((g, j) => (
														<li key={j}>{g}</li>
													))}
												</ol>
											</details>
										)}
									</div>
								</li>
							);
						})}
					</ul>
				</>
			)}
		</div>
	);
}
