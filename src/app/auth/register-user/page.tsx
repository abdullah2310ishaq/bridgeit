"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface University {
  id: string;
  name: string;
  address: string;
  estYear: number;
}

interface Company {
  
  id: string;
  name: string;
}

const RegistrationPage: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [post, setPost] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [universityId, setUniversityId] = useState<string>('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [interest, setInterest] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [department, setDepartment] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('https://localhost:7053/api/get-university/all-universities');
        if (response.ok) {
          const data = await response.json();
          setUniversities(data);
        } else {
          toast.error('Failed to load universities.', {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast.error('An error occurred while fetching universities.', {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await fetch('https://localhost:7053/api/get-companies/all-companies');
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          toast.error('Failed to load companies.', {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('An error occurred while fetching companies.', {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    fetchUniversities();
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: any = {
      firstName,
      lastName,
      email,
      role,
      password,
      contact,
      post,
      companyId,
      universityId,
      interest,
      skills,
      department,
      rollNumber,
    };

    try {
      const apiUrl = `https://localhost:7053/api/register-user/${role.toLowerCase()}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Registration successful! Redirecting to login page...', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => router.push('/auth/login-user')
        });
      } else {
        toast.error('Registration failed. Please try again.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again later.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full bg-gray-100">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-full md:w-1/2 h-full">
        <img 
          src="/signin.png" 
          alt="Registration Background" 
          className="w-full h-full object-cover rounded-l-xl"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Join Us</h1>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Role Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('Student')}
                className={`py-3 rounded-lg font-semibold ${role === 'Student' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('Faculty')}
                className={`py-3 rounded-lg font-semibold ${role === 'Faculty' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setRole('IndustryExpert')}
                className={`py-3 rounded-lg font-semibold ${role === 'IndustryExpert' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                Industry Expert
              </button>
              <button
                type="button"
                onClick={() => setRole('UniversityAdmin')}
                className={`py-3 rounded-lg font-semibold ${role === 'UniversityAdmin' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                University Admin
              </button>
            </div>
          </div>

          {/* Common Fields */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* University or Company Select */}
          {role === 'Student' || role === 'Faculty' || role === 'UniversityAdmin' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-600">University</label>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select your university</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name} ({university.estYear})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {role === 'IndustryExpert' && (
            <div>
              <label className="block text-sm font-semibold text-gray-600">Company</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select your company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Role-specific Fields */}
          {role === 'Student' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills.join(', ')}
                  onChange={(e) => setSkills(e.target.value.split(',').map(i => i.trim()))}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Roll Number</label>
                <input
                  type="number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(Number(e.target.value))}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {role === 'Faculty' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Interest (comma separated)</label>
                <input
                  type="text"
                  value={interest.join(', ')}
                  onChange={(e) => setInterest(e.target.value.split(',').map(i => i.trim()))}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Post</label>
                <input
                  type="text"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {role === 'IndustryExpert' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills.join(', ')}
                  onChange={(e) => setSkills(e.target.value.split(',').map(i => i.trim()))}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {role === 'UniversityAdmin' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">Post</label>
                <input
                  type="text"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegistrationPage;
