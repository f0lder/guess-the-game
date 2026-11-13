const RAWG_API = "https://api.rawg.io/api";

/**
 * Server-only helper for calling the RAWG API.
 * Throws on a missing key or a non-2xx response so callers can return a proper error.
 */
export async function rawg<T = any>(
	path: string,
	params: Record<string, string | number> = {},
): Promise<T> {
	const key = process.env.KEY;
	if (!key) {
		throw new Error("Missing RAWG API key (KEY env variable)");
	}

	const url = new URL(`${RAWG_API}${path}`);
	url.searchParams.set("key", key);
	for (const [name, value] of Object.entries(params)) {
		url.searchParams.set(name, String(value));
	}

	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) {
		throw new Error(`RAWG request to ${path} failed with status ${res.status}`);
	}
	return res.json();
}
