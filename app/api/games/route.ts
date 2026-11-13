import { NextRequest, NextResponse } from "next/server";
import { rawg } from "@/lib/rawg";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 5;

type RawgSearch = {
	count: number;
	next: string | null;
	results: { id: number; name: string }[];
};

export async function GET(req: NextRequest) {
	const search = req.nextUrl.searchParams.get("search")?.trim() ?? "";
	const pageParam = Number(req.nextUrl.searchParams.get("page") ?? 1);
	const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

	if (!search) {
		return NextResponse.json({ data: { count: 0, hasMore: false, results: [] } });
	}

	try {
		const data = await rawg<RawgSearch>("/games", {
			search,
			page,
			page_size: PAGE_SIZE,
		});

		// Only forward what the client needs. RAWG's `next`/`previous` URLs contain the API key.
		return NextResponse.json({
			data: {
				count: data.count,
				hasMore: Boolean(data.next),
				results: (data.results ?? []).map((g) => ({ id: g.id, name: g.name })),
			},
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Search failed" }, { status: 502 });
	}
}
