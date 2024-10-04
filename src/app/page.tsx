"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import LineChart from "./dashboard/components/LineChart";
import SummaryCard from "./dashboard/components/SummaryCards";
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 bg-opacity-90 shadow-md fixed w-full z-50 backdrop-filter backdrop-blur-lg">
        <div className="flex items-center">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} />
          <span className="ml-3 text-2xl font-extrabold text-green-300">BridgeIT</span>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="text-lg text-gray-200 hover:text-green-300 transition-colors duration-300">
            Home
          </Link>
          <Link href="/about" className="text-lg text-gray-200 hover:text-green-300 transition-colors duration-300">
            About
          </Link>
          <Link href="/dashboard" className="text-lg text-gray-200 hover:text-green-300 transition-colors duration-300">
            Analytics
          </Link>
        </div>
        <div>
          <Link href="/auth/login-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-green-400 to-teal-500 text-gray-900 font-medium px-5 py-2 rounded-lg shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300"
              aria-label="Sign In"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 p-8 md:p-16 pt-28">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left md:w-1/2"
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
            Welcome to BridgeIT!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Bridge the gap between academia and industry with our platform, where universities and experts connect directly with businesses.
          </p>
          <Link href="/auth/register-user">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl active:opacity-75 outline-none duration-300"
              aria-label="Create an Account"
            >
              <span className="mr-2">&#128274;</span> Create an Account
            </motion.button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 md:mt-0 md:w-1/2 flex justify-center"
        >
          <Image
            src="/heroimage.png"
            alt="Hero Image"
            width={500}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 text-center">
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg text-gray-300 max-w-4xl mx-auto mb-12"
          >
            At BridgeIT, our mission is to connect the dots between academia and industry, enabling the next generation of professionals to collaborate and innovate.
          </motion.p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
          <FeatureCard
            icon={
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7l16 0M4 12l16 0M4 17l16 0"></path>
              </svg>
            }
            title="Seamless Collaboration"
            description="Collaborate with industry experts and academia to create impactful projects."
          />
          <FeatureCard
            icon={
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 12 6 6 6 18z"></path>
              </svg>
            }
            title="Resource Sharing"
            description="Access a wide range of resources to support your academic and professional growth."
          />
          <FeatureCard
            icon={
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l6-6M8 12l6 6"></path>
              </svg>
            }
            title="Expert Mentorship"
            description="Get guidance from industry experts who are leaders in their fields."
          />
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-12">
            Our Impact
          </h2>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <ToggleSwitch
              leftLabel="Users"
              rightLabel="Visualizations"
              isChecked={impactView === "visualizations"}
              onToggle={handleToggle}
            />
          </div>

          {/* Content based on toggle state */}
          {loading ? (
            <LoadingSpinner />
          ) : impactView === "users" ? (
            <UsersView data={data} />
          ) : (
            <VisualizationsView data={chartData} />
          )}
        </div>
      </section>


{/*Chat Us*/}

<section id="contact" className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Whether you have questions, feedback, or partnership inquiries, we'd love to hear from you.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-green-400 text-xl" />
              <a href="mailto:contact@bridgeit.com" className="text-gray-300 hover:text-green-400">
                contact@bridgeit.com
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="text-green-400 text-xl" />
              <a href="tel:+92-346-2207429" className="text-gray-300 hover:text-green-400">
                +92-346-2207429
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-400 text-xl" />
              <span className="text-gray-300">Air University, Islamabad</span>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={onSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              rows={5}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
            >
              Send Message
            </button>
          </form>
          <span className="text-gray-400 mt-4">{result}</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-8 px-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} />
          <span className="ml-3 text-xl font-extrabold text-green-300">BridgeIT</span>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ToggleSwitch Component
function ToggleSwitch({ leftLabel, rightLabel, isChecked, onToggle }: ToggleSwitchProps) {
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

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
          transition={spring}
          animate={{ x: isChecked ? 24 : 0 }}
        />
      </motion.div>
      <span className={`text-sm ${isChecked ? "text-green-400" : "text-gray-400"}`}>{rightLabel}</span>
    </div>
  );
}

// FeatureCard Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotateY: 5, rotateX: 5 }}
      className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-xl p-10 text-center transition-all duration-300 transform hover:shadow-2xl relative"
    >
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-400 rounded-full p-3 shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-green-300 mb-4 mt-10">{title}</h3>
      <p className="text-gray-400">{description}</p>
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
