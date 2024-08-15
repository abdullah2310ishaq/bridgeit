"use client";
import React, { useState } from 'react';

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
  const [interest, setInterest] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [department, setDepartment] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<number | ''>('');
  const [imageData, setImageData] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
      imageData,
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
        setMessage('Registration successful!');
        setError('');
      } else {
        setError('Registration failed. Please try again.');
        setMessage('');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Select Role</label>
            <div className="flex space-x-4">
              <button type="button" onClick={() => setRole('Student')} className={`py-2 px-4 ${role === 'Student' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Student</button>
              <button type="button" onClick={() => setRole('Faculty')} className={`py-2 px-4 ${role === 'Faculty' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Faculty</button>
              <button type="button" onClick={() => setRole('IndustryExpert')} className={`py-2 px-4 ${role === 'IndustryExpert' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Industry Expert</button>
              <button type="button" onClick={() => setRole('UniversityAdmin')} className={`py-2 px-4 ${role === 'UniversityAdmin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>University Admin</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>


          {role === 'Student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills.join(', ')}
                  onChange={(e) => setSkills(e.target.value.split(',').map(i => i.trim()))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Roll Number</label>
                <input
                  type="number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(Number(e.target.value))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Image Data</label>
                <input
                  type="text"
                  value={imageData}
                  onChange={(e) => setImageData(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
                <div>
                <label className="block text-sm font-medium text-gray-600">University ID</label>
                <input
                  type="text"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              </div>
            </>
          )}

          {role === 'Faculty' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">Interest (comma separated)</label>
                <input
                  type="text"
                  value={interest.join(', ')}
                  onChange={(e) => setInterest(e.target.value.split(',').map(i => i.trim()))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Post</label>
                <input
                  type="text"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">University ID</label>
                <input
                  type="text"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}

          {role === 'IndustryExpert' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Post</label>
                <input
                  type="text"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Company ID</label>
                <input
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}

          {role === 'UniversityAdmin' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Office Address</label>
                <input
                  type="text"
                 value={post}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">University ID</label>
                <input
                  type="text"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
