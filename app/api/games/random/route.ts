import { randomInt } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiResponse) {

    if (req.url) {

        const page = randomInt(1, 1000);

        const key = process.env.KEY;

        const response = await fetch(`https://api.rawg.io/api/games?token&key=${key}&page=${encodeURIComponent(page)}&page_size=1`);

        const data = await response.json();

        const game = data.results[0];

        const id = game.id;

        const screans= await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(id)}/screenshots?token&key=${key}`);

        const screansData = await screans.json();

        game.screenshots = screansData.results;

        return NextResponse.json({ data: game }, { status: 200 });
    }
}