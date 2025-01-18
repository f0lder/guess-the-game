import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Guess the game",
	description: "Guess the game is made with Next.js and Tailwind CSS by f0lder",
	robots: "index, follow",
	authors: [{ name: "f0lder", url: "https://f0lder.xyz/" }],
	keywords: ["next.js", "tailwindcss", "typescript", "react", "game", "guess"],
	twitter: { creator: "@f0lderDOTxyz" },
	metadataBase: new URL("https://guess.f0lder.xyz/"),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				<Footer />
			</body>
		</html>
	);
}
