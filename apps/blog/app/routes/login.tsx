import type { Route } from "./+types/login";

import { Background } from "@/components/background";
import LoginSection from "@/components/blocks/login-section";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/consts";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: SITE_TITLE, description: SITE_DESCRIPTION, pathname: location.pathname });

export default function Page() {
	return (
		<DefaultLayout>
			<Background>
				<LoginSection />
			</Background>
		</DefaultLayout>
	);
}
