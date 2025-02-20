import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import FeatureCard from "./FeaturedCard";
import { colors } from "@/app/common_components/Utils/colors"; // ✅ Import Colors

export default function KeyFeaturesSection() {
  return (
    <section
      className="py-20"
      style={{ backgroundColor: colors.background, color: colors.text }} // ✅ Background & Text Color Applied
    >
      <div className="max-w-6xl mx-auto px-8">
        <h2
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`, // ✅ Dynamic Gradient
          }}
        >
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          <FeatureCard
            icon={<FaLinkedin className="w-8 h-8" style={{ color: colors.primary }} />} // ✅ Icon Color
            title="Seamless Collaboration"
            description="Connect and collaborate with industry experts and academia to create impactful projects."
          />
          <FeatureCard
            icon={<FaGithub className="w-8 h-8" style={{ color: colors.secondary }} />} // ✅ Icon Color
            title="Resource Sharing"
            description="Access a wide range of resources to support your academic and professional growth."
          />
          <FeatureCard
            icon={<FaEnvelope className="w-8 h-8" style={{ color: colors.accent }} />} // ✅ Icon Color
            title="Expert Mentorship"
            description="Get guidance from industry leaders who are at the forefront of their fields."
          />
        </div>
      </div>
    </section>
  );
}
