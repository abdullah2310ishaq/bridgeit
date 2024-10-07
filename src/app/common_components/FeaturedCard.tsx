import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 rounded-xl p-8 text-center transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-gray-700 rounded-full p-4">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-green-400 mb-4">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}
