// Temporary web reference images. Replace any individual URL from the admin
// without changing a component when a U Graphics project photograph is ready.
const signboardImages = {
  "3d-eg-box-up-signboard": "https://loremflickr.com/1200/800/3d,illuminated,sign?lock=101",
  "3d-box-up-lettering-signboard": "https://loremflickr.com/1200/800/3d,lettering,signage?lock=102",
  "3d-led-conceal-box-up-lettering-signboard": "https://loremflickr.com/1200/800/concealed,led,signage?lock=103",
  "3d-led-backlit-box-up-signboard": "https://loremflickr.com/1200/800/backlit,signage,led?lock=104",
  "3d-led-channel-signboard": "https://loremflickr.com/1200/800/channel,letters,led?lock=105",
  "3d-led-signboard": "https://loremflickr.com/1200/800/led,signboard,shop?lock=106",
  "3d-aluminium-big-box-up-lettering-signage": "https://loremflickr.com/1200/800/aluminium,signage,letters?lock=107",
  "3d-stainless-steel-gold-signboard": "https://loremflickr.com/1200/800/gold,stainless,signage?lock=108",
  "3d-stainless-steel-silver-signboard": "https://loremflickr.com/1200/800/silver,stainless,signage?lock=109",
  "3d-stainless-steel-gold-led-backlit-signboard": "https://loremflickr.com/1200/800/gold,backlit,signage?lock=110",
  "3d-eg-box-up-led-frontlit-backlit-signboard": "https://loremflickr.com/1200/800/frontlit,backlit,sign?lock=111",
  lightbox: "https://loremflickr.com/1200/800/lightbox,advertising,sign?lock=112",
  "3d-led-front-lit-signage": "https://loremflickr.com/1200/800/frontlit,led,letters?lock=113",
  "3d-led-back-lit-signage": "https://loremflickr.com/1200/800/halo,backlit,letters?lock=114",
  "3d-led-light-frame-signboard": "https://loremflickr.com/1200/800/led,lightbox,frame?lock=115",
  "3d-pvc-lettering-signboard": "https://loremflickr.com/1200/800/pvc,letters,signage?lock=116",
  "acrylic-box-up": "https://loremflickr.com/1200/800/acrylic,signage,letters?lock=117",
  "gi-metal-signage": "https://loremflickr.com/1200/800/metal,signage,industrial?lock=118",
  "pylon-signboard": "https://millenniumsignage.co.za/cdn/shop/articles/product-picture_1_0c7a9ca1-45bd-45c3-bd15-8fa568cea178.png?v=1772458275",
  "wayfinding-directional-signboard": "https://loremflickr.com/1200/800/wayfinding,directional,signage?lock=120",
};
const printingImages = {
  "business-card": "https://loremflickr.com/1200/800/business,cards,printing?lock=201", flyers: "https://loremflickr.com/1200/800/flyers,printing?lock=202", brochure: "https://loremflickr.com/1200/800/brochure,printing?lock=203", poster: "https://loremflickr.com/1200/800/poster,printing?lock=204", "banner-bunting": "https://loremflickr.com/1200/800/banner,bunting,printing?lock=205", sticker: "https://loremflickr.com/1200/800/stickers,printing?lock=206", "car-sticker": "https://loremflickr.com/1200/800/car,wrap,sticker?lock=207", "t-shirt-printing": "https://static-01.daraz.com.bd/p/8fc9f5dcb6179cb8749cb54563e8f024.jpg", "mug-printing": "https://www.graphicana.in/hoawhoof/2021/05/MUG-T-SHIRT-PRINTING.jpg", "canvas-and-frame": "https://loremflickr.com/1200/800/canvas,frame,print?lock=210", "invitation-card": "https://loremflickr.com/1200/800/invitation,card,printing?lock=211", "thank-you-card": "https://loremflickr.com/1200/800/thank,you,card?lock=212", "certificate-printing": "https://loremflickr.com/1200/800/certificate,printing?lock=213", calendar: "https://loremflickr.com/1200/800/calendar,printing?lock=214", letterhead: "https://loremflickr.com/1200/800/letterhead,stationery?lock=215", envelope: "https://loremflickr.com/1200/800/envelope,printing?lock=216", notepad: "https://loremflickr.com/1200/800/notepad,printing?lock=217", "book-printing": "https://loremflickr.com/1200/800/book,printing?lock=218", packaging: "https://loremflickr.com/1200/800/packaging,printing?lock=219", "paper-bag": "https://loremflickr.com/1200/800/paper,bag,printing?lock=220",
};

export const signboards = [
  ["3D EG Box Up Signboard", "3d-eg-box-up-signboard"],
  ["3D Box Up Lettering Signboard", "3d-box-up-lettering-signboard"],
  ["3D LED Conceal Box Up Lettering Signboard", "3d-led-conceal-box-up-lettering-signboard"],
  ["3D LED Backlit Box Up Signboard", "3d-led-backlit-box-up-signboard"],
  ["3D LED Channel Signboard", "3d-led-channel-signboard"],
  ["3D LED Signboard", "3d-led-signboard"],
  ["3D Aluminium Big Box Up Lettering Signage", "3d-aluminium-big-box-up-lettering-signage"],
  ["3D Stainless Steel Gold Signboard", "3d-stainless-steel-gold-signboard"],
  ["3D Stainless Steel Silver Signboard", "3d-stainless-steel-silver-signboard"],
  ["3D Stainless Steel Gold LED Backlit Signboard", "3d-stainless-steel-gold-led-backlit-signboard"],
  ["3D EG Box Up LED Frontlit & Backlit Signboard", "3d-eg-box-up-led-frontlit-backlit-signboard"],
  ["Lightbox", "lightbox"],
  ["3D LED Front-Lit Signage", "3d-led-front-lit-signage"],
  ["3D LED Back-Lit Signage", "3d-led-back-lit-signage"],
  ["3D LED Light Frame Signboard", "3d-led-light-frame-signboard"],
  ["3D PVC Lettering Signboard", "3d-pvc-lettering-signboard"],
  ["Acrylic Box Up", "acrylic-box-up"],
  ["GI Metal Signage", "gi-metal-signage"],
  ["Pylon Signboard", "pylon-signboard"],
  ["Wayfinding & Directional Signboard", "wayfinding-directional-signboard"],
].map(([title, slug]) => ({ title, slug, type: "Signboard", image: signboardImages[slug] }));

export const digitalPrinting = [
  ["Business Card", "business-card"], ["Flyers", "flyers"], ["Brochure", "brochure"],
  ["Poster", "poster"], ["Banner Bunting", "banner-bunting"], ["Sticker", "sticker"],
  ["Car Sticker", "car-sticker"], ["T Shirt Printing", "t-shirt-printing"], ["Mug Printing", "mug-printing"],
  ["Canvas and Frame", "canvas-and-frame"], ["Invitation Card", "invitation-card"],
  ["Thank You Card", "thank-you-card"], ["Certificate Printing", "certificate-printing"],
  ["Calendar", "calendar"], ["Letterhead", "letterhead"], ["Envelope", "envelope"],
  ["Notepad", "notepad"], ["Book Printing", "book-printing"], ["Packaging", "packaging"],
  ["Paper Bag", "paper-bag"],
].map(([title, slug]) => ({ title, slug, type: "Digital printing", image: printingImages[slug] }));

export const serviceGroups = [
  { title: "Signboards", href: "/signboards", description: "Custom commercial signage, fabricated and installed for visibility that lasts.", items: signboards },
  { title: "Digital Printing", href: "/digital-printing", description: "Quality print collateral and branded products for everyday business needs.", items: digitalPrinting },
];

export function getCatalogService(group, slug) {
  const items = group === "signboards" ? signboards : group === "digital-printing" ? digitalPrinting : [];
  return items.find((item) => item.slug === slug);
}

export function serviceDescription(service) {
  return `U Graphics provides custom ${service.title.toLowerCase()} solutions with practical material guidance, careful production and a finish aligned to your brand. Talk to our team about size, artwork, quantity and installation or delivery requirements.`;
}
