import { notFound } from "next/navigation";
import CatalogDetail from "@/components/services/CatalogDetail";
import { digitalPrinting, serviceDescription } from "@/lib/serviceCatalog";
import { getManagedCatalog } from "@/lib/catalogData";
export const dynamic = "force-dynamic";
export async function generateMetadata({params}) { const services=await getManagedCatalog("digital-printing",digitalPrinting); const service=services.find((item)=>item.slug===params.slug); return service ? {title: service.title,description: service.shortDescription || serviceDescription(service), alternates: { canonical: `/digital-printing/${service.slug}` }, openGraph: { images: service.image ? [{ url: service.image, alt: `${service.title} by U Graphics` }] : [] }} : {}; }
export default async function Page({params}) { const services=await getManagedCatalog("digital-printing",digitalPrinting); const service=services.find((item)=>item.slug===params.slug); if(!service) notFound(); return <CatalogDetail service={service} group="Digital Printing" related={services} />; }
