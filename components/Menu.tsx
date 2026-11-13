"use client";
import { useState, useEffect } from "react";
import { readStats, STATS_EVENT } from "@/lib/stats";

const Menu = () => {
	const [stats, setStats] = useState({ won: 0, lost: 0 });

	useEffect(() => {
		const update = () => setStats(readStats());
		update();
		// same tab (game finished) and other tabs (storage event)
		window.addEventListener(STATS_EVENT, update);
		window.addEventListener("storage", update);
		return () => {
			window.removeEventListener(STATS_EVENT, update);
			window.removeEventListener("storage", update);
		};
	}, []);

	const total = stats.won + stats.lost;
	const winRate = total === 0 ? "-" : `${Math.round((stats.won / total) * 100)}%`;

	return (
		<div className="navbar bg-base-100 border-b border-gray-700 mb-4">
			<div className="flex-1">
				<div>
					<a className="btn btn-ghost text-xl" href="/">
						Guess the Game
					</a>
					<p className="text-sm">
						by{" "}
						<a
							className="underline text-primary"
							href="https://f0lder.xyz/"
							target="_blank"
							rel="noreferrer"
						>
							f0lder
						</a>
					</p>
				</div>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li className="pointer-events-none">
						<div
							className="bg-base-300 rounded-box place-items-center text-gray-300"
							title="Won / Lost / Win rate"
						>
							<span className=" text-green-500">{stats.won}</span> /
							<span className=" text-red-500">{stats.lost}</span> /
							<span>{winRate}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Menu;
