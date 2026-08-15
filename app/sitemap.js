import { signboards, digitalPrinting } from "@/lib/serviceCatalog";

export default function sitemap() {
  const base = "https://www.ugraphics.in";
  const staticPages = ["", "/about", "/services", "/portfolio", "/blog", "/contact", "/get-a-quote", "/signboards", "/digital-printing"];
  return [
    ...staticPages.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 })),
    ...signboards.map(({ slug }) => ({ url: `${base}/signboards/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 })),
    ...digitalPrinting.map(({ slug }) => ({ url: `${base}/digital-printing/${slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 })),
  ];
}
