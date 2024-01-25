import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {

    let search ='';
    let page ='';

    if (req.url) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        search = url.searchParams.get('search') || '';

        page = url.searchParams.get('page') || '';

        const response = await fetch(`https://api.rawg.io/api/games?token&key=dc8770cecd274c2dbf0ee2f021df72e2&page=${encodeURIComponent(page)}&page_size=5&search=${encodeURIComponent(search)}`);

        const data = await response.json();

        return NextResponse.json({ data: data }, { status: 200 });
    }
}