
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import FeatureCard from "./FeaturedCard";

export default function KeyFeaturesSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-16">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<FaLinkedin className="w-8 h-8 text-blue-400" />}
            title="Seamless Collaboration"
            description="Connect and collaborate with industry experts and academia to create impactful projects."
          />
          <FeatureCard
            icon={<FaGithub className="w-8 h-8 text-purple-400" />}
            title="Resource Sharing"
            description="Access a wide range of resources to support your academic and professional growth."
          />
          <FeatureCard
            icon={<FaEnvelope className="w-8 h-8 text-green-400" />}
            title="Expert Mentorship"
            description="Get guidance from industry leaders who are at the forefront of their fields."
          />
        </div>
      </div>
    </section>
  );
}
