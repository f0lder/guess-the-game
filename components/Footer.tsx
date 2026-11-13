const Footer = () => {
	return (
		<footer className="border-t border-gray-700 pt-10">
			<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4">
				<div className="col-span-3">
					<h1 className="text-4xl font-bold mb-2"> About this app</h1>
					<p className="text-justify">
						Guess the game is a simple game where you have to guess the game
						from its screenshots. Search for a game and pick your guess - every
						wrong guess or skip reveals another screenshot and a hint. The game is made with
						Next.js and Tailwind CSS by f0lder.
					</p>
                    <p>
                        Check out my portofolio at{" "}
                        <a
                            className="underline"
                            href="https://f0lder.xyz/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            f0lder.xyz
                        </a>
                    </p>
				</div>
				<div>
					<ul className="space-y-1 m-3 text-center">
						<li className="text-lg text-blue-500">Next.JS</li>
						<li className="text-lg text-blue-500">React</li>
						<li className="text-lg text-blue-500">Typescript</li>
						<li className="text-lg text-blue-500">TailwindCSS</li>
						<li className="text-lg text-blue-500">
							API from{" "}
							<a className="underline" href="https://rawg.io/">
								RAWG
							</a>
						</li>
					</ul>

					<a
						className="border border-blue-500 rounded p-1 text-center w-full"
						href="https://github.com/f0lder/guess-the-game"
						target="_blank"
						rel="noreferrer"
					>
						f0lder/guess-the-game
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
