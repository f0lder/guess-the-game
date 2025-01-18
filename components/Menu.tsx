"use client";
import { useState, useEffect } from "react";
const Menu = () => {
	const [theme, setTheme] = useState("dark");
	const [wonGames, setWonGames] = useState(0);
	const [lostGames, setLostGames] = useState(0);

	useEffect(() => {
		setWonGames(Number(localStorage.getItem("wonGames") || 0));
		setLostGames(Number(localStorage.getItem("lostGames") || 0));
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

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
						<div className="bg-base-300 rounded-box place-items-center text-gray-300">
							<span className=" text-green-500">{wonGames}</span> /
							<span className=" text-red-500">{lostGames}</span> /
							<span>
								{lostGames === 0 ? 0 : (wonGames / lostGames).toFixed(2)}
							</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Menu;
