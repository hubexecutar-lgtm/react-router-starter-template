import type { Route } from "./+types/ferramentas.processo-de-trabalho";
import { ProcessWorkApp } from "@/features/miniapp/ProcessWorkApp";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";
export const handle={manifest:"/ferramentas/processo-de-trabalho/manifest.webmanifest"};
export const meta:Route.MetaFunction=({location})=>seo({title:"Processo de Trabalho + Prisma",description:"Planeje um processo, revise ações e imprima o Prisma A4. Os dados permanecem no dispositivo.",pathname:location.pathname});
export default function ProcessoDeTrabalho(){return <DefaultLayout><ProcessWorkApp/></DefaultLayout>}
