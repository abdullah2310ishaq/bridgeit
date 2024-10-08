// // ./components/HomeSearchResultCard.tsx

// "use client";

// import React from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";

// interface HomeSearchResultCardProps {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   imageData: string | null;
//   type: string;
// }

// const HomeSearchResultCard: React.FC<HomeSearchResultCardProps> = ({
//   userId,
//   firstName,
//   lastName,
//   email,
//   imageData,
//   type,
// }) => {
//   const formatImageSrc = (imageData: string | null) => {
//     if (imageData) {
//       return imageData.startsWith("data:image")
//         ? imageData
//         : `data:image/jpeg;base64,${imageData}`;
//     }
//     return "/unknown.jpg"; // Provide a default image if none exists
//   };

//   return (
//     <motion.div
//       className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
//       whileHover={{ scale: 1.05 }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Profile Image */}
//       <div className="w-full h-48 relative">
//         <img
//           src={formatImageSrc(imageData)}
//           alt={`${firstName} ${lastName}`}
//           className="w-full h-full object-cover"
//         />
//         {/* Overlay with Link */}
//         <motion.div
//           className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
//           whileHover={{ opacity: 1 }}
//         >
//           <Link
//             href={`/dashboard/profile/${type.toLowerCase()}/${userId}`}
//             className="text-white text-sm font-semibold px-4 py-2 bg-blue-600 bg-opacity-75 rounded"
//           >
//             View Profile
//           </Link>
//         </motion.div>
//       </div>

//       {/* User Details */}
//       <div className="p-4">
//         <h3 className="text-xl font-bold text-white">
//           {firstName} {lastName} ({type})
//         </h3>
//         <p className="text-gray-400 mt-1">{email}</p>
//       </div>
//     </motion.div>
//   );
// };

// export default HomeSearchResultCard;
