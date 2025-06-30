
import { motion } from "framer-motion";
import { Hero3D } from "@/components/Hero3D";
import { FeatureCards } from "@/components/FeatureCards";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <Hero3D />
      <FeatureCards />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
