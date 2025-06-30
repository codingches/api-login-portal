
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 5 team members",
      "10GB storage",
      "Basic 3D visualizations",
      "Email support",
      "API access"
    ],
    popular: false,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Professional",
    price: "$99",
    description: "For growing businesses that need more power",
    features: [
      "Up to 25 team members",
      "100GB storage",
      "Advanced 3D analytics",
      "Priority support",
      "Custom integrations",
      "AI-powered insights"
    ],
    popular: true,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Enterprise",
    price: "$299",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited team members",
      "1TB storage",
      "Custom 3D environments",
      "24/7 dedicated support",
      "White-label solution",
      "Advanced security",
      "Custom AI models"
    ],
    popular: false,
    gradient: "from-orange-500 to-red-500"
  }
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simple Pricing
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`bg-white/5 backdrop-blur-lg border-white/10 h-full hover:bg-white/10 transition-all duration-300 ${
                plan.popular ? 'border-purple-400/50 ring-2 ring-purple-400/20' : 'hover:border-purple-400/30'
              }`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} p-2 mb-4 group-hover:scale-110 transition-transform`}>
                    <Zap className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/60 ml-1">/month</span>
                  </div>
                  <CardDescription className="text-white/70">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/80">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
