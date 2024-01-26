import { randomInt } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiResponse) {

    if (req.url) {

        const page = randomInt(1, 100);

        const response = await fetch(`https://api.rawg.io/api/games?token&key=dc8770cecd274c2dbf0ee2f021df72e2&page=${encodeURIComponent(page)}&page_size=5`);

        const data = await response.json();

        const game = data.results[randomInt(0, 4)];

        const id = game.id;

        const screans= await fetch(`https://api.rawg.io/api/games/${encodeURIComponent(id)}/screenshots?token&key=dc8770cecd274c2dbf0ee2f021df72e2`);

        const screansData = await screans.json();

        game.screenshots = screansData.results;

        return NextResponse.json({ data: game }, { status: 200 });
    }
}