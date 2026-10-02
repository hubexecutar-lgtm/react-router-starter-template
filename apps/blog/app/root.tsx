import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";

import "@/styles/global.css";
import { SITE_METADATA } from "@/consts";

export const links: Route.LinksFunction = () => [
	// Google Fonts (ADR-11): Inter for display and text, IBM Plex Mono for technical text.
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
	// Favicon
	...SITE_METADATA.icons.icon.map((icon) => ({ rel: "icon", type: icon.type, sizes: icon.sizes, href: icon.url })),
	...SITE_METADATA.icons.apple.map((icon) => ({ rel: "apple-touch-icon", sizes: icon.sizes, href: icon.url })),
	...SITE_METADATA.icons.shortcut.map((icon) => ({ rel: "shortcut icon", href: icon.url })),
	{ rel: "sitemap", href: "/sitemap-index.xml" },
];

// Applied before paint to prevent the theme from flashing (localStorage or system preference).
const THEME_SCRIPT = `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',(s||d)==='dark');})();`;

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
				<Meta />
				<Links />
			</head>
			<body className="bg-background text-foreground min-h-screen antialiased">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
