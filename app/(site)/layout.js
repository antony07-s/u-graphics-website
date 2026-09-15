import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileActionBar from "@/components/layout/MobileActionBar";
import { ToastProvider } from "@/components/providers/ToastProvider";

export default function SiteLayout({ children }) {
  return (
    <ToastProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileActionBar />
    </ToastProvider>
  );
}
