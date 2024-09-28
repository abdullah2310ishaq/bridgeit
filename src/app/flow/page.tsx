"use client";

import React, { useEffect, useState } from "react";

interface FlowStep {
  title: string;
  description: string;
  image?: string; // Optional image for the step
}

const FlowPage: React.FC = () => {
  const [studentSteps, setStudentSteps] = useState<FlowStep[]>([]);
  const [expertSteps, setExpertSteps] = useState<FlowStep[]>([]);
  const [facultySteps, setFacultySteps] = useState<FlowStep[]>([]);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<"student" | "expert" | "faculty">("student");

  useEffect(() => {
    const fetchSteps = async () => {
      const studentRes = await fetch("/flowSteps.json"); // Ensure this is the correct path
      const expertRes = await fetch("/flowSteps.json"); // Ensure this is the correct path
      const facultyRes = await fetch("/flowSteps.json"); // Ensure this is the correct path
      
      const studentData: FlowStep[] = await studentRes.json();
      const expertData: FlowStep[] = await expertRes.json();
      const facultyData: FlowStep[] = await facultyRes.json();

      setStudentSteps(studentData);
      setExpertSteps(expertData);
      setFacultySteps(facultyData);
    };

    fetchSteps();
  }, []);

  const getCurrentSteps = () => {
    switch (activeSection) {
      case "student":
        return studentSteps;
      case "expert":
        return expertSteps;
      case "faculty":
        return facultySteps;
      default:
        return studentSteps;
    }
  };

  const steps = getCurrentSteps();

  if (steps.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col items-center p-6">
      <div className="flex mb-6">
        <button onClick={() => setActiveSection("student")} className={`px-4 py-2 rounded-lg ${activeSection === "student" ? "bg-blue-600" : "bg-gray-700"} text-white`}>Student Flow</button>
        <button onClick={() => setActiveSection("expert")} className={`px-4 py-2 rounded-lg ${activeSection === "expert" ? "bg-blue-600" : "bg-gray-700"} text-white ml-4`}>Industry Expert Flow</button>
        <button onClick={() => setActiveSection("faculty")} className={`px-4 py-2 rounded-lg ${activeSection === "faculty" ? "bg-blue-600" : "bg-gray-700"} text-white ml-4`}>Faculty Flow</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`bg-gray-800 border border-transparent rounded-lg shadow-lg p-4 transition-transform duration-300 transform ${currentStep === index ? "scale-105" : "scale-100"}`}
            >
              <h2 className="text-lg font-bold text-white text-center">{step.title}</h2>
              {step.image && <img src={step.image} alt={step.title} className="my-2 w-full h-auto rounded-lg" />}
              <p className="text-gray-300 text-sm text-center">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between w-full max-w-lg mt-6">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className={`bg-gray-600 text-gray-200 p-2 rounded-lg ${currentStep === 0 ? "hidden" : ""}`}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          className={`bg-green-500 text-white p-2 rounded-lg ${currentStep === steps.length - 1 ? "hidden" : ""}`}
        >
          Next
        </button>
        
        {/* Completion Button */}
        {currentStep === steps.length - 1 && (
          <button className="bg-blue-600 text-white p-3 rounded-lg">
            Complete Tutorial
          </button>
        )}
      </div>
    </div>
  );
};

export default FlowPage;
