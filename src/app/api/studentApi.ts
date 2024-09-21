// // src/services/studentService.ts
// export async function fetchUserProfile(token: string) {
//     const response = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
  
//     if (!response.ok) {
//       throw new Error("Failed to fetch user profile.");
//     }
  
//     return await response.json();
//   }
  
//   export async function fetchStudentById(userId: string, token: string) {
//     const response = await fetch(`https://localhost:7053/api/get-student/student-by-id/${userId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
  
//     if (!response.ok) {
//       throw new Error("Failed to fetch student data.");
//     }
  
//     return await response.json();
//   }
  
//   export async function fetchStudentProjects(studentId: string, token: string) {
//     const response = await fetch(`https://localhost:7053/api/projects/get-student-projects-by-id/${studentId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
  
//     if (!response.ok) {
//       throw new Error("Failed to fetch projects.");
//     }
  
//     return await response.json();
//   }
  
//   export async function fetchEvents(token: string) {
//     const response = await fetch("https://localhost:7053/api/Events/get-events", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
  
//     if (!response.ok) {
//       throw new Error("Failed to fetch events.");
//     }
  
//     return await response.json();
//   }
  