import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { colors } from "@/app/common_components/Utils/colors"; // ✅ Import Colors

export default function HeroSection() {
  return (
    <section
      className="flex flex-col md:flex-row items-center justify-between min-h-screen p-8 md:p-16 pt-24"
      style={{ backgroundColor: colors.background, color: colors.text }} // ✅ Applied Background & Text Color
    >
      {/* Left Side Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center md:text-left md:w-1/2"
      >
        <h1
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`, // ✅ Gradient Heading
          }}
        >
          Welcome to BridgeIT!
        </h1>
        <p className="text-xl mb-8" style={{ color: colors.text }}>
          Bridge the gap between academia and industry with our platform, where universities and experts connect directly with businesses.
        </p>

        {/* Button */}
        <Link href="/auth/register-user">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300 text-lg"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`, // ✅ Button Gradient
              color: colors.cardBackground, // White Text on Button
            }}
            aria-label="Create an Account"
          >
            Get Started <FaArrowRight className="inline-block ml-2" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Right Side Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-12 md:mt-0 md:w-1/2 flex justify-center"
      >
        <Image
          src="/heroimage.png"
          alt="Hero Image"
          width={600}
          height={400}
          className="rounded-2xl shadow-2xl"
          style={{ borderColor: colors.border }} // ✅ Border Color Applied
        />
      </motion.div>
    </section>
  );
}
