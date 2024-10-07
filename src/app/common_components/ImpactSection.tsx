import { motion, AnimatePresence } from "framer-motion";
import ToggleSwitch from "./ToggleSwitch";
import LoadingSpinner from "./LoadingSpinner";

import VisualizationsView from "./VisualizationsView";
import UsersView from "./UserView";

interface Data {
  universities: number;
  students: number;
  industryExperts: number;
  faculties: number;
  companies: number;
}

interface ImpactSectionProps {
  impactView: "users" | "visualizations";
  handleToggle: () => void;
  data: Data;
  loading: boolean;
}

export default function ImpactSection({
  impactView,
  handleToggle,
  data,
  loading,
}: ImpactSectionProps) {
  const chartData = {
    labels: ["Universities", "Students", "Industry Experts", "Faculties", "Companies"],
    datasets: [
      {
        label: "Count",
        data: [
          data.universities,
          data.students,
          data.industryExperts,
          data.faculties,
          data.companies,
        ],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
      },
    ],
  };

  return (
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
  );
}
