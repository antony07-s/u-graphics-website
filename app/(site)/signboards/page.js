import PageHero from "@/components/ui/PageHero";
import CatalogGrid from "@/components/services/CatalogGrid";
import { signboards } from "@/lib/serviceCatalog";
import { getManagedCatalog } from "@/lib/catalogData";
export const dynamic = "force-dynamic";
export const metadata = { title: "Signboards", description: "Custom LED, 3D, stainless steel, pylon and directional signboards by U Graphics." };
export default async function SignboardsPage() { const items = await getManagedCatalog("signboards", signboards); return <><PageHero title="Signboards" subtitle="Commercial signage designed, fabricated and finished for your brand." crumbs={[{label:"Home",href:"/"},{label:"Signboards"}]} /><section className="section"><div className="container-page"><p className="mb-8 max-w-3xl text-ink/70">From illuminated 3D letters to pylon and wayfinding systems, we help businesses make a clear first impression.</p><CatalogGrid group="Signboards" items={items} /></div></section></>; }
