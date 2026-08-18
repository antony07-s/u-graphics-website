import { notFound } from "next/navigation";
import CatalogDetail from "@/components/services/CatalogDetail";
import { signboards, serviceDescription } from "@/lib/serviceCatalog";
import { getManagedCatalog } from "@/lib/catalogData";
import { getProjectsForService } from "@/lib/serviceProjects";
export const dynamic = "force-dynamic";
export async function generateMetadata({params}) { const services=await getManagedCatalog("signboards",signboards); const service=services.find((item)=>item.slug===params.slug); return service ? {title: service.title,description: service.shortDescription || serviceDescription(service), alternates: { canonical: `/signboards/${service.slug}` }, openGraph: { images: service.image ? [{ url: service.image, alt: `${service.title} by U Graphics` }] : [] }} : {}; }
export default async function Page({params}) { const services=await getManagedCatalog("signboards",signboards); const service=services.find((item)=>item.slug===params.slug); if(!service) notFound(); const projects = await getProjectsForService(service.slug); return <CatalogDetail service={service} group="Signboards" related={services} projects={projects} />; }
