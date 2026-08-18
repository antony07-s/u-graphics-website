// Temporary, title-matched web reference images. Each slug has its own URL
// and can be replaced individually by an admin with U Graphics project work.
const signboardImages = {
  "3d-eg-box-up-signboard": "https://s.alicdn.com/@sc04/kf/H0152748d0bdf477ead4648ebc9d617f4l/Storefront-Display-Illuminated-Advertising-Led-Channel-Sign-Letter-Outdoor-Electric-Alphabet-Letters-Sign-3D-Acrylic-Led-Letters.jpg",
  "3d-box-up-lettering-signboard": "https://s.alicdn.com/@sc04/kf/Hd0d74eb1dbdb443386c56b436f6dd645S/Custom-3D-Gold-Mirror-Stainless-Steel-Channel-Letter-Sign-for-Business-Office-Shop-for-Outdoor-Wall-Logo-Hospital-Application.jpg",
  "3d-led-conceal-box-up-lettering-signboard": "https://s.alicdn.com/@sc04/kf/H8617a2f35f6e4ff8bc0d85127e28b514n/Custom-3D-Stainless-Steel-Interior-Wall-Letter-Logo-3D-Metal-Acrillic-Backlit-Channel-Letter-Sign.jpg",
  "3d-led-backlit-box-up-signboard": "https://s.alicdn.com/@sc04/kf/Hcc4caebec67c4a2981a361b600611407Y/Large-Custom-Business-Logo-Sign-3D-Led-Backlit-Reverse-Channel-Letters-Professional-Laser-Cut-Illuminated-Sign.jpg",
  "3d-led-channel-signboard": "https://nneeoonn.com/cdn/shop/files/DALL_E2023-11-0602.29.07-Photoofastorefrontatdusk_featuringasignwithbacklitfrontlightchannelletters.Thelettersformtheword_Lumina_andaremountedonasmoo_1400x.png?v=1699259396",
  "3d-led-signboard": "https://s.alicdn.com/@sc04/kf/H68806bc4918d4ca58dfd35177dbf66496/Outdoor-logo-Sign-3d-Led-Acrylic-Design-Letters-for-Shops-Restaurant-Electric-Sign-Board-Designs-Backlit-logo-Sign.png",
  "3d-aluminium-big-box-up-lettering-signage": "https://www.fasciasigns.com/wp-content/uploads/2024/01/face-and-back-lit-metal-channel-letters-for-hicrtoa.jpg",
  "3d-stainless-steel-gold-signboard": "https://inoxgiahung.vn/storage/8v/pi/8vpigaepz5m12i7eyqjeb4yu0v9l_chu-inox-vang-xuoc-13.jpeg",
  "3d-stainless-steel-silver-signboard": "https://flagbanner.us/media/catalog/product/cache/8/image/1800x/040ec09b1e35df139433887a97daa66f/s/t/stand-off-letters-signs.jpg",
  "3d-stainless-steel-gold-led-backlit-signboard": "https://www.signs4au.com/wp-content/uploads/2023/04/backlit-channel-letters-for-carven.jpg",
  "3d-eg-box-up-led-frontlit-backlit-signboard": "https://image.made-in-china.com/2f0j00DIwUWhAmkbkP/Ss-Advertising-3D-Laser-Cut-Channel-Storefront-Reverse-Backlit-Letters-Sign.webp",
  lightbox: "https://images.unsplash.com/photo-1786179737115-c114870553a0?w=1600&auto=format&fit=crop&q=85",
  "3d-led-front-lit-signage": "https://image.made-in-china.com/202f0j00lZaoCKQFhYbf/Custom-Hanging-Shop-LED-Sign-Advertising-Luminous-Light-Box-Signs-LED-Display-Screen-Signs.webp",
  "3d-led-back-lit-signage": "https://images.unsplash.com/photo-1663493257142-f73a6122422e?w=1600&auto=format&fit=crop&q=85",
  "3d-led-light-frame-signboard": "https://i.etsystatic.com/54502288/r/il/fd72a6/7585413034/il_794xN.7585413034_ors7.jpg",
  "3d-pvc-lettering-signboard": "https://image.made-in-china.com/202f0j00vebhiUwnwIkF/Custom-Logo-DIY-Metal-Alphabets-High-Quality-3D-Letter-Sign-Brushed-Steel-Metal-Letter.webp",
  "acrylic-box-up": "https://image.made-in-china.com/2f0j00WLJGnEsBAvbQ/Acrylic-LED-Channel-Letters-for-Advertising-Outdoor-3D-Backlit-Letters-Sign.jpg",
  "gi-metal-signage": "https://www.haichenled.com/web/allimg/index/index-identity06.webp",
  "pylon-signboard": "https://millenniumsignage.co.za/cdn/shop/articles/product-picture_1_0c7a9ca1-45bd-45c3-bd15-8fa568cea178.png?v=1772458275",
  "wayfinding-directional-signboard": "https://s.alicdn.com/@sc04/kf/H7f8a4676083743e49045730968354e57x/Finish-Metal-Letters-Non-Reflective-for-Hospital-Wayfinding-Systems-School-Campuses-and-Public-Safety-Zones.jpg",
};

const printingImages = {
  "business-card": "https://images.unsplash.com/photo-1599590984817-0c15f31b1fa5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8QnVzaW5lc3MlMjBDYXJkfGVufDB8fDB8fHww",
  flyers: "https://images.unsplash.com/photo-1508161773455-3ada8ed2bbec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEZseWVyc3xlbnwwfHwwfHx8MA%3D%3D",
  brochure: "https://plus.unsplash.com/premium_photo-1722686514121-2ab7a152454a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEJyb2NodXJlfGVufDB8fDB8fHww",
  poster: "https://images.unsplash.com/photo-1543487945-139a97f387d5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UG9zdGVyfGVufDB8fDB8fHww",
  "banner-bunting": "https://images.unsplash.com/photo-1764175760070-9d8fb94737ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8QmFubmVyJTIwQnVudGluZ3xlbnwwfHwwfHx8MA%3D%3D",
  sticker: "https://images.unsplash.com/photo-1543123452-278551b0e9a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN0aWNrZXJ8ZW58MHx8MHx8fDA%3D",
  "car-sticker": "https://images.unsplash.com/photo-1685553334511-b77b0a7ca676?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2FyJTIwU3RpY2tlcnxlbnwwfHwwfHx8MA%3D%3D",
  "t-shirt-printing": "https://static-01.daraz.com.bd/p/8fc9f5dcb6179cb8749cb54563e8f024.jpg",
  "mug-printing": "https://images.unsplash.com/photo-1539032760301-ca0ef7fd18d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fE11ZyUyMFByaW50aW5nfGVufDB8fDB8fHww",
  "canvas-and-frame": "https://images.unsplash.com/photo-1611657202240-f09ad7867676?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q2FudmFzJTIwYW5kJTIwRnJhbWV8ZW58MHx8MHx8fDA%3D",
  "invitation-card": "https://images.unsplash.com/photo-1741893043659-ca8b82a8b637?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEludml0YXRpb24lMjBDYXJkfGVufDB8fDB8fHww",
  "thank-you-card": "https://a.storyblok.com/f/165154/1280x720/88b82e01af/0159_us_multiproduct_3_1280x720.jpg/m/",
  "certificate-printing": "https://images.unsplash.com/photo-1785119774760-185873634dcb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2VydGlmaWNhdGUlMjBQcmludGluZ3xlbnwwfHwwfHx8MA%3D%3D",
  calendar: "https://images.unsplash.com/photo-1649298173603-9c95aa950879?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2FsZW5kYXJ8ZW58MHx8MHx8fDA%3D",
  letterhead: "https://plus.unsplash.com/premium_photo-1682109363124-26716c9db5b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TGV0dGVyaGVhZHxlbnwwfHwwfHx8MA%3D%3D",
  envelope: "https://plus.unsplash.com/premium_photo-1681487591275-4c38e89b1d5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8RW52ZWxvcGV8ZW58MHx8MHx8fDA%3D",
  notepad: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Tm90ZXBhZHxlbnwwfHwwfHx8MA%3D%3D",
  "book-printing": "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Qm9vayUyMFByaW50aW5nfGVufDB8fDB8fHww",
  packaging: "https://images.unsplash.com/photo-1624137527136-66e631bdaa0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFBhY2thZ2luZ3xlbnwwfHwwfHx8MA%3D%3D",
  "paper-bag": "https://plus.unsplash.com/premium_photo-1661636119130-0427b15cf821?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UGFwZXIlMjBCYWd8ZW58MHx8MHx8fDA%3D",
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
