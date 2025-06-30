
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Shield, Globe, Cpu, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced machine learning algorithms that adapt and learn from your data patterns.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast Performance",
    description: "Optimized for speed with real-time processing and instant results.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and security protocols to protect your valuable data.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Deploy worldwide with our distributed infrastructure and CDN network.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Cpu,
    title: "Advanced Analytics",
    description: "Deep insights with interactive 3D visualizations and predictive modeling.",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Sparkles,
    title: "Seamless Integration",
    description: "Connect with your existing tools and workflows effortlessly.",
    gradient: "from-pink-500 to-rose-500"
  }
];

export const FeatureCards = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience the next generation of SaaS with features that push the boundaries of what's possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 h-full hover:bg-white/10 transition-all duration-300 hover:border-purple-400/50">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70 group-hover:text-white/90 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
