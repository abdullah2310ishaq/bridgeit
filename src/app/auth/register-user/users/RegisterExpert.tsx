"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Company {
  id: string;
  name: string;
}

const RegisterIndustryExpert: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [post, setPost] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('https://localhost:7053/api/companies/get-all-companies');
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

    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      firstName,
      lastName,
      email,
      role: "IndustryExpert", 
      password,
      contact,
      post,
      companyId,
    };

    const apiUrl = `https://localhost:7053/api/register-user/industry-expert`;

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
      <h1 className="text-4xl font-extrabold text-center text-green-500 mb-6">Register as Industry Expert</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
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
        <div>
          <label className="block text-sm font-semibold text-gray-300">Contact Number</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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
        <div>
          <label className="block text-sm font-semibold text-gray-300">Company</label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

export default RegisterIndustryExpert;
