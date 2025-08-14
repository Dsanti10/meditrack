import { Features } from "../components/Features";
import Hero from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import ScrollToTop from "react-scroll-to-top";
import { ChevronUp } from "lucide-react";

export default function Home() {
  return (
    <>
      <ScrollToTop
        smooth
        component={<ChevronUp style={{ color: "black", width: "100%" }} />}
      />
      <Hero />
      <Features />
      <HowItWorks />
    </>
  );
}
