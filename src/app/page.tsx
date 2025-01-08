"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "./common_components/HomeNavbar";
import HeroSection from "./common_components/HeroSection";
import MissionSection from "./common_components/MissionSection";
import KeyFeaturesSection from "./common_components/KeyFeatures";
import ImpactSection from "./common_components/ImpactSection";
import ContactSection from "./common_components/ContactSection";
import Footer from "./common_components/footer";

export default function HomePage() {
  const [impactView, setImpactView] = useState<"users" | "visualizations">("users");
  const [data, setData] = useState({
    universities: 0,
    students: 0,
    industryExperts: 0,
    faculties: 0,
    companies: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const handleToggle = useCallback(() => {
    setImpactView((prev) => (prev === "users" ? "visualizations" : "users"));
  }, []);

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

        const [
          universitiesData,
          studentsData,
          industryExpertsData,
          facultiesData,
          companiesData,
        ] = await Promise.all([
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <KeyFeaturesSection />
      <ImpactSection
        impactView={impactView}
        handleToggle={handleToggle}
        data={data}
        loading={loading}
      />
      <ContactSection />
      <Footer />
    </div>
  );
}
