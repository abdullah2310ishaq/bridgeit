import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen p-8 md:p-16 pt-24 overflow-hidden">
      {/* Abstract background patterns */}
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-30">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute right-48 top-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left md:w-1/2 space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                BridgeIT!
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-xl mb-8">
              Bridge the gap between academia and industry with our platform, where universities and experts connect directly with businesses.
            </p>

            <div className="mt-8">
            <Link href="/auth/register-user">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-green-400/20 hover:shadow-2xl active:opacity-90 transition-all duration-300"
                aria-label="Create an Account"
              >
                Get Started <FaArrowRight className="inline-block ml-2" />
              </motion.button>
            </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 blur-3xl" />
              <Image
                src="/heroimage.png"
                alt="Hero Image"
                width={600}
                height={400}
                className="relative rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add animation keyframes for the blob animation */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}

