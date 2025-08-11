import { Features } from "./Features";
import Hero from "./Hero";
import { HowItWorks } from "./HowItWorks";
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
