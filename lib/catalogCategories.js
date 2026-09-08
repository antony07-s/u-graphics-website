// Source list supplied by U Graphics. It is used only by the idempotent seed script;
// storefront navigation always reads Category documents from MongoDB.
export const catalogCategories = [
  "3D Acrylic Signage", "3D Aluminium Box Up Signage", "3D Customized Fibreglass Model", "3D Dual Color LED Signage", "3D EG Box Up Signage", "3D LED Lattice Signage", "3D Mini Front Lit Acrylic Lettering", "3D Printing Signage", "3D Rimless LED Front Lit", "3D Sign PVC Cut Out", "3D Stainless Steel Box Up Signage", "A-Stand", "ACP/ ACM/ Alucarbon Signage", "Acrylic Box Up LED Light", "Acrylic Panel Signage", "Acrylic Performance Board", "Acrylic Product", "Address Sign", "Aluminium Display & Snap Frame",
  "Billboard Advertising Malaysia", "Brass Chemical Etching", "Brass Signage", "Building Lighting",
  "Chemical Etching Plate/ Plaque", "Construction Project Signboard", "Customized Signage",
  "Directory Signage", "Door Signage", "Dynamic Lightbox", "Edision Bulb Pallet Sign",
  "Glass Sign Panel", "Gold Acrylic Mirror", "Gold Stainless Steel Box Up",
  "High Rise Building Signage", "Hoarding Tarpaulin",
  "Indoor Facility M&E Sign", "Infinity Mirror LED Sign", "Inkjet Printing", "Isometric Metal Door With LED Light",
  "Laser Cut Out", "Leader/ Performance Board", "LED Flex Neon Signage", "LED Light", "LED Running Display/ Screen", "Lightbox",
  "Metal Works", "Mirror Stainless Steel Back Lit", "Mural & Wall Painting", "Neon Signage", "Organization Chart", "Outdoor Pole Sign",
  "Parking Signage", "Premium Back Lit Lettering", "Printing Signage", "PVC Foam Cut Out Lettering", "Pylon Signage",
  "Reflective Signage", "Road Signage", "Roll Up Bunting Stand", "Roller Shutter Painting",
  "Sandblast Sticker Die Cut", "Signage Remove/ Dismantle Service", "Signage Service and Maintenance", "Snap Frame Notice Board", "Spandrel / Cladding Base", "Stainless Steel Acrylic Cut Out Lettering", "Stainless Steel Plaque", "Sticker", "Sticker Cut Out",
  "Ultra Clear 3 Layer Printing", "UV Flatbed Direct Printing", "Vehicle Wrapping", "Wayfinding/ Directional Sign", "Whiteboard", "Window Tint Film", "Wood Signage", "World Map Signage", "Zig Zag Banner",
];

const digitalPrintingCategories = new Set([
  "3D Printing Signage", "Hoarding Tarpaulin", "Inkjet Printing", "Mural & Wall Painting",
  "Printing Signage", "Roll Up Bunting Stand", "Sandblast Sticker Die Cut", "Sticker",
  "Sticker Cut Out", "Ultra Clear 3 Layer Printing", "UV Flatbed Direct Printing", "Zig Zag Banner",
]);

export function sectionForCatalogCategory(name) {
  if (digitalPrintingCategories.has(name)) return "digital-printing";
  if (name === "Acrylic Product" || name === "Gold Acrylic Mirror") return "general";
  return "signboards";
}
