import Image from "next/image";
import heroImg from "@/public/images/hero/heroslider1.jpeg";

export default function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0b0f1a]">
      <Image src={heroImg} alt="U Graphics" className="w-full h-auto block" />
    </section>
  );
}