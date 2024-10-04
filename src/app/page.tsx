"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import LineChart from "./dashboard/components/LineChart";
import SummaryCard from "./dashboard/components/SummaryCards";
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhone, FaArrowRight } from "react-icons/fa";

// Type Definitions
type ImpactView = "users" | "visualizations";

interface Data {
  universities: number;
  students: number;
  industryExperts: number;
  faculties: number;
  companies: number;
}

interface ToggleSwitchProps {
  leftLabel: string;
  rightLabel: string;
  isChecked: boolean;
  onToggle: () => void;
}

interface UsersViewProps {
  data: Data;
}

interface VisualizationsViewProps {
  data: any; // Replace with actual type based on LineChart's props
}

export default function HomePage() {
  const [impactView, setImpactView] = useState<ImpactView>("users");
  const [data, setData] = useState<Data>({
    universities: 0,
    students: 0,
    industryExperts: 0,
    faculties: 0,
    companies: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<string>("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("access_key", "8b4dd709-b9d0-48ee-8de7-8cd44ea8764d");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        (event.target as HTMLFormElement).reset();
      } else {
        setResult(data.message);
      }
    } catch (error) {
      setResult("An error occurred while submitting the form.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          universitiesRes,
          studentsRes,
          industryExpertsRes,
          facultiesRes,
          companiesRes,
        ] = await Promise.all([
          fetch("https://localhost:7053/api/universities/get-all-universities"),
          fetch("https://localhost:7053/api/get-student/students"),
          fetch("https://localhost:7053/api/get-industry-expert/industry-experts"),
          fetch("https://localhost:7053/api/get-faculty/faculties"),
          fetch("https://localhost:7053/api/companies/get-all-companies"),
        ]);

        if (
          !universitiesRes.ok ||
          !studentsRes.ok ||
          !industryExpertsRes.ok ||
          !facultiesRes.ok ||
          !companiesRes.ok
        ) {
          throw new Error("Failed to fetch one or more data sources.");
        }

        const [universitiesData, studentsData, industryExpertsData, facultiesData, companiesData] =
          await Promise.all([
            universitiesRes.json(),
            studentsRes.json(),
            industryExpertsRes.json(),
            facultiesRes.json(),
            companiesRes.json(),
          ]);

        setData({
          universities: universitiesData.length,
          students: studentsData.length,
          industryExperts: industryExpertsData.length,
          faculties: facultiesData.length,
          companies: companiesData.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Universities", "Students", "Industry Experts", "Faculties", "Companies"],
    datasets: [
      {
        label: "Count",
        data: [data.universities, data.students, data.industryExperts, data.faculties, data.companies],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
      },
    ],
  };

  const handleToggle = useCallback(() => {
    setImpactView((prev) => (prev === "users" ? "visualizations" : "users"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 bg-opacity-90 shadow-md fixed w-full z-50 backdrop-filter backdrop-blur-lg">
        <div className="flex items-center">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} />
          <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">BridgeIT</span>
        </div>
        <div className="flex space-x-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/dashboard">Analytics</NavLink>
        </div>
        <div>
          <Link href="/auth/login-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium px-5 py-2 rounded-full shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300"
              aria-label="Sign In"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between min-h-screen p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:w-1/2"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
            Welcome to BridgeIT!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Bridge the gap between academia and industry with our platform, where universities and experts connect directly with businesses.
          </p>
          <Link href="/auth/register-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300 text-lg"
              aria-label="Create an Account"
            >
              Get Started <FaArrowRight className="inline-block ml-2" />
            </motion.button>
          </Link>
        </motion.div>
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
          />
        </motion.div>
      </section>

      {/* Mission Section */}
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

      {/* Key Features Section */}
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

      {/* Our Impact Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-16">
            Our Impact
          </h2>

          <div className="flex justify-center mb-12">
            <ToggleSwitch
              leftLabel="Users"
              rightLabel="Visualizations"
              isChecked={impactView === "visualizations"}
              onToggle={handleToggle}
            />
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingSpinner key="loading" />
            ) : impactView === "users" ? (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <UsersView data={data} />
              </motion.div>
            ) : (
              <motion.div
                key="visualizations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <VisualizationsView data={chartData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-16">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <ContactInfo
                icon={<FaEnvelope className="text-green-400 text-2xl" />}
                info="contact@bridgeit.com"
                href="mailto:contact@bridgeit.com"
              />
              <ContactInfo
                icon={<FaPhone className="text-green-400 text-2xl" />}
                info="+92-346-2207429"
                href="tel:+92-346-2207429"
              />
              <ContactInfo
                icon={<FaMapMarkerAlt className="text-green-400 text-2xl" />}
                info="Air University, Islamabad"
              />
            </div>
            <form onSubmit={onSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                rows={5}
                required
              ></textarea>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
              >
                Send Message
              </motion.button>
            </form>
          </div>
          {result && (
            <p className="mt-6 text-center text-green-400 font-semibold">{result}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} />
            <span className="ml-3 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">BridgeIT</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-green-400 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition-colors duration-300">Contact Us</a>
          </div>
          <div className="mt-6 md:mt-0">
            <p>&copy; {new Date().getFullYear()} BridgeIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// NavLink Component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-lg text-gray-300 hover:text-green-400 transition-colors duration-300">
      {children}
    </Link>
  );
}

// ToggleSwitch Component
function ToggleSwitch({ leftLabel, rightLabel, isChecked, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm ${!isChecked ? "text-green-400" : "text-gray-400"}`}>{leftLabel}</span>
      <motion.div
        className="w-14 h-8 flex items-center bg-gray-700 rounded-full p-1 cursor-pointer"
        onClick={onToggle}
        role="switch"
        aria-checked={isChecked}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggle();
          }
        }}
      >
        <motion.div
          className="w-6 h-6 bg-green-400 rounded-full shadow-md"
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30
          }}
          animate={{ x: isChecked ? 24 : 0 }}
        />
      </motion.div>
      <span className={`text-sm ${isChecked ? "text-green-400" : "text-gray-400"}`}>{rightLabel}</span>
    </div>
  );
}

// FeatureCard Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
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

// UsersView Component
function UsersView({ data }: UsersViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <SummaryCard title="Universities" count={data.universities} description="Total number of universities" />
      <SummaryCard title="Students" count={data.students} description="Total number of students" />
      <SummaryCard title="Industry Experts" count={data.industryExperts} description="Total number of industry experts" />
      <SummaryCard title="Faculties" count={data.faculties} description="Total number of faculties" />
      <SummaryCard title="Companies" count={data.companies} description="Total number of companies" />
    </div>
  );
}

// VisualizationsView Component
function VisualizationsView({ data }: VisualizationsViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto h-96 bg-gray-800 rounded-xl shadow-2xl p-4">
      <LineChart data={data} />
    </div>
  );
}

// LoadingSpinner Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
    </div>
  );
}

// ContactInfo Component
function ContactInfo({ icon, info, href }: { icon: React.ReactNode; info: string; href?: string }) {
  return (
    <div className="flex items-center space-x-4">
      {icon}
      {href ? (
        <a href={href} className="text-gray-300 hover:text-green-400 transition-colors duration-300">
          {info}
        </a>
      ) : (
        <span className="text-gray-300">{info}</span>
      )}
    </div>
  );
}