import { motion } from "framer-motion";
import { colors } from "@/app/common_components/Utils/colors"; // ✅ Import Colors

export default function MissionSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: colors.background, color: colors.text }} // ✅ Background & Text Color Applied
    >
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`, // ✅ Dynamic Gradient
          }}
        >
          Our Mission
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl leading-relaxed"
          style={{ color: colors.text }} // ✅ Applied Text Color
        >
          At BridgeIT, our mission is to connect the dots between academia and industry, enabling the next generation of professionals to collaborate and innovate. We strive to create a seamless ecosystem where knowledge meets opportunity, fostering growth and advancement for all.
        </motion.p>
      </div>
    </section>
  );
}
