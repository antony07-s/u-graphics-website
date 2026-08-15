import PageHero from "@/components/ui/PageHero";
import CatalogGrid from "@/components/services/CatalogGrid";
import { digitalPrinting } from "@/lib/serviceCatalog";
import { getManagedCatalog } from "@/lib/catalogData";
export const dynamic = "force-dynamic";
export const metadata = { title: "Digital Printing", description: "Professional business printing, promotional products, packaging and branded print materials by U Graphics." };
export default async function DigitalPrintingPage() { const items = await getManagedCatalog("digital-printing", digitalPrinting); return <><PageHero title="Digital Printing" subtitle="Reliable print products that keep your brand consistent in every interaction." crumbs={[{label:"Home",href:"/"},{label:"Digital Printing"}]} /><section className="section"><div className="container-page"><p className="mb-8 max-w-3xl text-ink/70">Choose professional print solutions for business collateral, campaigns, branded merchandise and packaging.</p><CatalogGrid group="Digital Printing" items={items} /></div></section></>; }
