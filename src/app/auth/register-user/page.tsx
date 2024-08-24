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

const RegistrationPage: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [universityId, setUniversityId] = useState<string>('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [interest, setInterest] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [department, setDepartment] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<number | ''>('');
  const [post, setPost] = useState<string>('');
  const [officeAddress, setOfficeAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('https://localhost:7053/api/universities/get-all-universities');
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

    if (role === 'Student' || role === 'Faculty' || role === 'University Admin') {
      fetchUniversities();
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: any = {
      firstName,
      lastName,
      email,
      role,
      password,
      universityId,
      interest,
      skills,
      department,
      rollNumber,
      post,
      officeAddress,
    };

    const apiUrl = `https://localhost:7053/api/register-user/${role.toLowerCase()}`;

    try {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-extrabold text-center text-green-500 mb-6">Join Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
        {/* Role Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Select Your Role</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('Student')}
              className={`py-3 rounded-lg font-semibold ${role === 'Student' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('Faculty')}
              className={`py-3 rounded-lg font-semibold ${role === 'Faculty' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setRole('University Admin')}
              className={`py-3 rounded-lg font-semibold ${role === 'University Admin' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'} hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              University Admin
            </button>
          </div>
        </div>

        {/* Common Fields */}
        <div>
          <label className="block text-sm font-semibold text-gray-300">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* University Select */}
        {(role === 'Student' || role === 'Faculty' || role === 'University Admin') && (
          <div>
            <label className="block text-sm font-semibold text-gray-300">University</label>
            <select
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
        )}

        {/* Role-specific Fields */}
        {role === 'Student' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Skills (comma separated)</label>
              <input
                type="text"
                value={skills.join(', ')}
                onChange={(e) => setSkills(e.target.value.split(',').map(i => i.trim()))}
                className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Roll Number</label>
              <input
                type="number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value ? parseInt(e.target.value) : '')}
                className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </>
        )}

        {role === 'Faculty' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Interest Areas (comma separated)</label>
              <input
                type="text"
                value={interest.join(', ')}
                onChange={(e) => setInterest(e.target.value.split(',').map(i => i.trim()))}
                className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Post</label>
              <input
                type="text"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </>
        )}

        {role === 'University Admin' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Office Address</label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Post</label>
              <input
                type="text"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className={`py-4 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegistrationPage;
