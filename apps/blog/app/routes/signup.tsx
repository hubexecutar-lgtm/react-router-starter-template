import type { Route } from "./+types/signup";

import { Background } from "@/components/background";
import SignupSection from "@/components/blocks/signup-section";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/consts";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: SITE_TITLE, description: SITE_DESCRIPTION, pathname: location.pathname });

export default function Page() {
	return (
		<DefaultLayout>
			<Background>
				<SignupSection />
			</Background>
		</DefaultLayout>
	);
}
