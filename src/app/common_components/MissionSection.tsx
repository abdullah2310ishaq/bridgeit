import { motion } from "framer-motion";

export default function MissionSection() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8"
        >
          Our Mission
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-300 leading-relaxed"
        >
          At BridgeIT, our mission is to connect the dots between academia and industry, enabling the next generation of professionals to collaborate and innovate. We strive to create a seamless ecosystem where knowledge meets opportunity, fostering growth and advancement for all.
        </motion.p>
      </div>
    </section>
  );
}
