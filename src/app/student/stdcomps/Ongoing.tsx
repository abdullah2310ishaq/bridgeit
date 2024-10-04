// // OngoingProjects.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// interface OngoingProject {
//   id: string;
//   title: string;
//   description: string;
//   expertName: string;
//   status: string;
//   endDate: string;
// }

// interface OngoingProjectsProps {
//   studentId: string;
// }

// const OngoingProjects: React.FC<OngoingProjectsProps> = ({ studentId }) => {
//   const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchOngoingProjects() {
//       try {
//         const token = localStorage.getItem("jwtToken");
//         if (!token) return;

//         const response = await fetch(
//           `https://localhost:7053/api/projects/get-student-with-expert-project-by-id/${studentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.ok) {
//           const projectsData = await response.json();
//           setOngoingProjects(projectsData);
//         } else {
//           console.error("Failed to fetch ongoing projects.");
//         }
//       } catch (error) {
//         console.error("Error fetching ongoing projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOngoingProjects();
//   }, [studentId]);

//   if (loading) {
//     return <div>Loading ongoing projects...</div>;
//   }

//   return (
//     <div className="my-8">
//       <h2 className="text-3xl font-bold mb-6">Ongoing Projects</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {ongoingProjects.length > 0 ? (
//           ongoingProjects.map((project) => (
//             <motion.div
//               key={project.id}
//               whileHover={{ scale: 1.05 }}
//               className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
//             >
//               <h3 className="text-2xl font-bold text-green-300 mb-4">{project.title}</h3>
//               <p className="text-gray-400 mb-4">{project.description}</p>
//               <p className="text-sm text-gray-400">Expert: {project.expertName}</p>
//               <p className="text-sm text-gray-400">Status: {project.status}</p>
//               <p className="text-sm text-gray-400">End Date: {project.endDate}</p>
//             </motion.div>
//           ))
//         ) : (
//           <p>No ongoing projects available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OngoingProjects;
