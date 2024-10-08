// "use client";
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// interface University {
//   id: string;
//   name: string;
//   address: string;
//   estYear: number;
// }

// const UniversityAdminRegistration: React.FC = () => {
//   const [firstName, setFirstName] = useState<string>('');
//   const [lastName, setLastName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [universityId, setUniversityId] = useState<string>('');
//   const [universities, setUniversities] = useState<University[]>([]);
//   const [post, setPost] = useState<string>('');
//   const [officeAddress, setOfficeAddress] = useState<string>('');
//   const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUniversities = async () => {
//       try {
//         const response = await fetch('https://localhost:7053/api/universities/get-all-universities');
//         if (response.ok) {
//           const data = await response.json();
//           setUniversities(data);
//         } else {
//           toast.error('Failed to load universities.', {
//             position: "top-center",
//             autoClose: 3000,
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching universities:', error);
//         toast.error('An error occurred while fetching universities.', {
//           position: "top-center",
//           autoClose: 3000,
//         });
//       }
//     };

//     const fetchEmails = async () => {
//       try {
//         const response = await fetch('https://localhost:7053/api/register-user/get-all-emails');
//         if (response.ok) {
//           const data = await response.json();
//           setRegisteredEmails(data);
//         } else {
//           toast.error('Failed to load registered emails.', {
//             position: "top-center",
//             autoClose: 3000,
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching registered emails:', error);
//         toast.error('An error occurred while fetching registered emails.', {
//           position: "top-center",
//           autoClose: 3000,
//         });
//       }
//     };

//     fetchUniversities();
//     fetchEmails();
//   }, []);

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const enteredEmail = e.target.value;
//     setEmail(enteredEmail);

//     // Check if email is already registered
//     if (registeredEmails.includes(enteredEmail)) {
//       setEmailError('This email is already registered.');
//       setIsSubmitDisabled(true);
//     } else {
//       setEmailError(null);
//       setIsSubmitDisabled(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Ensure that form submission is prevented if there is an email error
//     if (emailError) {
//       toast.error('Please provide a unique email address.', {
//         position: "top-center",
//         autoClose: 3000,
//       });
//       return;
//     }

//     setLoading(true);

//     const data: any = {
//       firstName,
//       lastName,
//       email,
//       password,
//       universityId,
//       post,
//       officeAddress,
//     };

//     const apiUrl = `https://localhost:7053/api/register-user/universityadmin`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         toast.success('Registration successful! Redirecting to login page...', {
//           position: "top-center",
//           autoClose: 2000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           onClose: () => router.push('/auth/login-user')
//         });
//       } else {
//         toast.error('Registration failed. Please try again.', {
//           position: "top-center",
//           autoClose: 3000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('An error occurred. Please try again later.', {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
//       <h1 className="text-4xl font-extrabold text-center text-green-500 mb-6">University Admin Registration</h1>
//       <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
//         <div>
//           <label className="block text-sm font-semibold text-gray-300">First Name</label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-300">Last Name</label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-300">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={handleEmailChange}
//             className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//           {emailError && (
//             <p className="text-red-400 mt-2">{emailError}</p>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-300">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-300">University</label>
//           <select
//             value={universityId}
//             onChange={(e) => setUniversityId(e.target.value)}
//             className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           >
//             <option value="" disabled>Select your university</option>
//             {universities.map((university) => (
//               <option key={university.id} value={university.id}>
//                 {university.name} ({university.estYear})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-300">Office Address</label>
//           <input
//             type="text"
//             value={officeAddress}
//             onChange={(e) => setOfficeAddress(e.target.value)}
//             className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-300">Post</label>
//           <input
//             type="text"
//             value={post}
//             onChange={(e) => setPost(e.target.value)}
//             className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>
//         <div className="flex justify-center">
//           <button
//             type="submit"
//             className={`py-4 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white ${loading || isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//             disabled={loading || isSubmitDisabled}
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </div>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default UniversityAdminRegistration;
