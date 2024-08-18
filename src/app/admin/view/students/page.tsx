"use client";
import React, { useEffect, useState } from 'react';

const ManageStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch('https://localhost:7053/api/get-student/students');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          console.error('Failed to fetch students:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching students:', error);
      }
    }

    fetchStudents();
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold">Students Overview</h1>
        <p className="mt-2 text-lg text-gray-400">View all student details in the system</p>
      </header>
      <table className="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4 text-left">First Name</th>
            <th className="p-4 text-left">Last Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">University</th>
            <th className="p-4 text-left">Roll Number</th>
            <th className="p-4 text-left">Skills</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-300">
              <td className="p-4">{student.firstName}</td>
              <td className="p-4">{student.lastName}</td>
              <td className="p-4">{student.email}</td>
              <td className="p-4">{student.universityName}</td>
              <td className="p-4">{student.rollNumber}</td>
              <td className="p-4">{student.skills ? student.skills.join(', ') : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ManageStudentsPage;
