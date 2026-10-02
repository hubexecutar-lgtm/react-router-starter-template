import { ArrowLeft } from "lucide-react";
import { data } from "react-router";

import type { Route } from "./+types/$";

import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

// Catch-all: every unknown path renders the 404 page with a 404 status (was src/pages/404.astro).
export function loader() {
	return data(null, { status: 404 });
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "404: Not Found",
		description: "Sorry, the page you're looking for doesn't exist.",
		pathname: location.pathname,
	});

export default function NotFound() {
	return (
		<DefaultLayout>
			<Background>
				<div className="container flex min-h-[70vh] flex-col items-center justify-center py-28 text-center lg:min-h-[80vh] lg:py-32">
					<div className="relative z-10 max-w-2xl">
						<h1 className="from-foreground to-foreground/70 relative mb-6 bg-linear-to-br bg-clip-text py-2 text-5xl font-semibold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
							Page Not Found
						</h1>

						<p className="text-muted-foreground mb-10 text-xl">
							Sorry, we couldn't find the page you're looking for. The page might
							have been removed or the URL might be incorrect.
						</p>

						<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<Button size="lg" className="group min-w-[200px]" asChild>
								<a href="/">
									<ArrowLeft className="transition-transform group-hover:-translate-x-1" />
									Back to Home
								</a>
							</Button>
							<Button variant="outline" size="lg" className="min-w-[200px]" asChild>
								<a href="/contact">Contact Support</a>
							</Button>
						</div>
					</div>
				</div>
			</Background>
		</DefaultLayout>
	);
}
