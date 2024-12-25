"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUniversity, FaPhone, FaAddressCard, FaEdit, FaEye, FaSearch, FaSignOutAlt, FaGraduationCap, FaChalkboardTeacher, FaProjectDiagram } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  officeAddress: string;
  contact: string;
  university: string;
  profileImage: string;
}

interface SearchResult {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  imageData: string | null;
}

const UniAdminDashboard: React.FC = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentsCount, setStudentsCount] = useState(0);
  const [facultiesCount, setFacultiesCount] = useState(0);
  const [query, setQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('student');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      router.push('/auth/login-user');
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        const profileResponse = await fetch('https://localhost:7053/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch authorized user info');
        }

        const profileData = await profileResponse.json();
        const role = profileData.role;

        if (role !== 'UniversityAdmin') {
          toast.error("You are not authorized to access this page.");
          router.push('/unauthorized');
          return;
        }

        const userId = profileData.userId;

        const adminResponse = await fetch(`https://localhost:7053/api/get-uni-admins/admins-by-id/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!adminResponse.ok) throw new Error('Failed to fetch University Admin profile');

        const adminData = await adminResponse.json();
        setAdminProfile({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          officeAddress: adminData.officeAddress,
          contact: adminData.contact,
          university: adminData.university,
          profileImage: adminData.profileImage,
        });

        // Fetch university-specific data
        const studentsResponse = await fetch(`https://localhost:7053/api/get-student/student-by-university/${adminData.university}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const facultiesResponse = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-university/${adminData.university}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!studentsResponse.ok || !facultiesResponse.ok) {
          throw new Error('Failed to fetch university data');
        }

        const studentsData = await studentsResponse.json();
        const facultiesData = await facultiesResponse.json();

        setStudentsCount(studentsData.length);
        setFacultiesCount(facultiesData.length);
      } catch (error) {
        setError('Failed to load profile or university data');
        toast.error("An error occurred while fetching data.");
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/auth/login-user');
  };

  const handleSearch = async () => {
    if (!adminProfile) return;

    setSearchLoading(true);
    setSearchError('');

    try {
      let response;
      switch (searchType) {
        case 'student':
          response = await fetch(`https://localhost:7053/api/get-student/student-by-name/${query}?university=${adminProfile.university}`);
          break;
        case 'faculty':
          response = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-name/${query}?university=${adminProfile.university}`);
          break;
        default:
          throw new Error('Invalid search type');
      }

      if (!response.ok) {
        throw new Error('Not Found! Try Creating One');
      }

      const data = await response.json();
      if (data.length === 0) {
        setResults([]);
        setSearchError('No results found');
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setSearchError(err.message || 'An error occurred');
      setResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-gray-900"><div className="text-red-500 text-2xl">{error}</div></div>;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Admin Dashboard
          </h2>
        </div>
        <nav className="mt-6">
          <a
            onClick={() => router.push("uniadmin/profile")}
            className="flex items-center py-3 px-6 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white cursor-pointer"
          >
            <FaUser className="mr-3" />
            Profile
          </a>
          <a
            onClick={() => router.push("uniadmin/fyprequests")}
            className="flex items-center py-3 px-6 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white cursor-pointer"
          >
            <FaProjectDiagram className="mr-3" />
            FYP Requests
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-6 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600 hover:text-white"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Profile Card */}
<motion.div
  className="bg-gray-800 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3 border border-gradient-to-r from-blue-500 to-green-500"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Section: Profile Picture and Key Details */}
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <img
        src={`data:image/png;base64,${adminProfile?.profileImage}`}
        alt="Admin Profile"
        className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-4"
      />
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        {adminProfile?.firstName} {adminProfile?.lastName}
      </h2>
      <p className="text-gray-300">{adminProfile?.university}</p>
      <p className="text-gray-300">{adminProfile?.email}</p>
    </div>

    {/* Right Section: Office Information and Actions */}
    <div className="flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-gray-300 mb-2">Office Information</h3>
        <p className="text-gray-400 flex items-center">
          <FaAddressCard className="mr-2 text-blue-400" /> {adminProfile?.officeAddress}
        </p>
        <p className="text-gray-400 flex items-center mt-2">
          <FaPhone className="mr-2 text-green-400" /> {adminProfile?.contact}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={() => router.push("uniadmin/profile/edituniadmin")}
        className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 flex items-center justify-center space-x-2"
      >
        <FaEdit />
        <span>Edit Profile</span>
      </button>
    </div>
  </div>

  {/* Divider for additional spacing */}
  <div className="mt-6 border-t border-gray-700"></div>
</motion.div>
          {/* University Overview Cards */}
          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-4">
              Students
            </h3>
            <div className="flex items-center">
              <FaGraduationCap className="text-4xl text-blue-400 mr-4" />
              <div>
                <p className="text-3xl font-bold text-white">{studentsCount}</p>
                <p className="text-gray-400">Total Enrolled</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
              Faculties
            </h3>
            <div className="flex items-center">
              <FaChalkboardTeacher className="text-4xl text-green-400 mr-4" />
              <div>
                <p className="text-3xl font-bold text-white">{facultiesCount}</p>
                <p className="text-gray-400">Total Faculty Members</p>
              </div>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-6">
              Search {adminProfile?.university}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter name"
                className="p-3 w-full md:w-1/2 border border-gray-600 bg-gray-900 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="p-3 w-full md:w-auto border border-gray-600 bg-gray-900 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
              <button
                onClick={handleSearch}
                className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center w-full md:w-auto"
              >
                <FaSearch className="mr-2" />
                Search
              </button>
            </div>
             {/* Search Results */}
             <div className="mt-8">
              {searchLoading && <p className="text-gray-600 text-center">Loading...</p>}
              {searchError && <p className="text-red-500 text-center">{searchError}</p>}

              {!searchLoading && !searchError && results.length === 0 && (
                <p className="text-gray-600 text-center"></p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {results.map((result) => (
                  <div key={result.userId} className="bg-gray-900 p-6 rounded-lg shadow-sm">
                    <img
                      src={result.imageData ? `data:image/png;base64,${result.imageData}` : '/placeholder.png'}
                      alt={`${result.firstName} ${result.lastName}`}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-500 text-center mb-2">{result.firstName} {result.lastName}</h3>
                    <p className="text-gray-400 text-center mb-2">{result.email}</p>
                    <p className="text-gray-400 text-center text-sm">{searchType.charAt(0).toUpperCase() + searchType.slice(1)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default UniAdminDashboard;

