import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileActionBar from "@/components/layout/MobileActionBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "U Graphics | Signage, Advertising & Web Design",
    template: "%s | U Graphics",
  },
  description:
    "U Graphics — professional signboard, advertising and web design company in India. Signboards, LED signage, vehicle branding, printing, and custom website design.",
  metadataBase: new URL("https://www.ugraphics.in"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-body">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <MobileActionBar />
      </body>
    </html>
  );
}
