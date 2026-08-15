import "./globals.css";

export const metadata = {
  title: {
    default: "U Graphics | Signage, Advertising & Web Design",
    template: "%s | U Graphics",
  },
  description:
    "U Graphics — professional signboard, advertising and web design company in India. Signboards, LED signage, vehicle branding, printing, and custom website design.",
  metadataBase: new URL("https://www.ugraphics.in"),
  openGraph: {
    type: "website",
    siteName: "U Graphics",
    title: "U Graphics | Signage, Digital Printing & Branding",
    description: "Professional signage, digital printing and branding solutions.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
