// Inscrição sem provedor definido: o formulário fica desativado e não coleta dados.
import { SURFACE } from "./surface";

import { buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { cn } from "@/lib/utils";

export function NewsletterNotice() {
	return (
		<div className={cn(SURFACE, "p-6 sm:p-8")}>
			<form aria-describedby="newsletter-status" onSubmit={(e) => e.preventDefault()}>
				<fieldset disabled className="flex flex-col gap-3 sm:flex-row">
					<label htmlFor="newsletter-email" className="sr-only">
						E-mail
					</label>
					<input
						id="newsletter-email"
						type="email"
						placeholder="Seu melhor e-mail"
						className="border-input bg-background h-11 flex-1 rounded-md border px-3 text-base disabled:cursor-not-allowed"
					/>
					<button type="submit" className={buttonVariants({ size: "lg" })}>
						Quero receber
					</button>
				</fieldset>
			</form>
			<div id="newsletter-status" className="mt-6">
				<Callout
					variant="pending"
					size="sm"
					subject="Inscrição"
					message="indisponível"
					description="A newsletter ainda não tem provedor definido; nenhum dado é coletado nesta página. Use o feed RSS para acompanhar os artigos."
				/>
			</div>
			<a href="/rss.xml" className="rc-link mt-4 inline-block">
				Assinar o feed RSS
			</a>
		</div>
	);
}
