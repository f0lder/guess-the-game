import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiResponse) {

    let search ='';
    let page ='';

    if (req.url) {
        const url = new URL(req.url, `http://${req.url}`);
        search = url.searchParams.get('search') || '';

        const key = process.env.KEY;

        page = url.searchParams.get('page') || '';

        const response = await fetch(`https://api.rawg.io/api/games?token&key=${key}&page=${encodeURIComponent(page)}&page_size=5&search=${encodeURIComponent(search)}`);

        const data = await response.json();

        return NextResponse.json({ data: data }, { status: 200 });
    }
}