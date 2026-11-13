import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { rawg } from "@/lib/rawg";

// Never prerender/cache this route - every request must return a new random game.
export const dynamic = "force-dynamic";

// Games with fewer screenshots than this are skipped (too few guesses to be fun).
const MIN_SCREENSHOTS = 3;
const MAX_ATTEMPTS = 5;

type Screenshot = {
	id: number;
	image: string;
	width: number;
	height: number;
	is_deleted?: boolean;
};

export async function GET() {
	try {
		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
			const page = randomInt(1, 1000);
			const data = await rawg<{ results?: any[] }>("/games", {
				page,
				page_size: 1,
			});

			const game = data.results?.[0];
			if (!game) continue;

			const shots = await rawg<{ results?: Screenshot[] }>(
				`/games/${encodeURIComponent(game.id)}/screenshots`,
			);
			const screenshots = (shots.results ?? []).filter(
				(s) => s.image && s.width && s.height && !s.is_deleted,
			);

			if (screenshots.length < MIN_SCREENSHOTS) continue;

			return NextResponse.json({ data: { ...game, screenshots } });
		}

		return NextResponse.json(
			{ error: "Could not find a game with enough screenshots" },
			{ status: 502 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to fetch a random game" },
			{ status: 502 },
		);
	}
}
