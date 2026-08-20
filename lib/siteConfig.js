export const siteConfig = {
  name: "U Graphics",
  email: "ugraphics@gmail.com",
  indiaPhone: "+919790965755",
  indiaAddress: "15, Vasantha Nagar, Wireless Road, Airport, Tiruchirappalli, 620007 (Beside to BG Naidu Sweets)",
  malaysiaAddress: "239A3, Jalan Sultan Azlan Shah, Sentul, 52100 Kuala Lumpur, Malaysia",
  malaysiaPhone: "+60142585755",
  whatsapp: "919790965755",
};

export const whatsappUrl = (message = "Hi, I'm interested in U Graphics services.") =>
  `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
