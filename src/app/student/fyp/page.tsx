"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StudentData {
  id: string;      
  userId: string;  
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
}


interface FypFormData {
  fyp_id: string;
  title: string;
  members: string;
  batch: string;
  technology: string;
  description: string;
}

const RegisterFypPage: React.FC = () => {
  const router = useRouter();


  const [student, setStudent] = useState<StudentData | null>(null);

 
  const [formData, setFormData] = useState<FypFormData>({
    fyp_id: "",
    title: "",
    members: "",
    batch: "",
    technology: "",
    description: "",
  });

  // UI feedback states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchStudentAndStoreId = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        // If no token, redirect to login
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch the userId from the auth endpoint
        const authResp = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!authResp.ok) {
          router.push("/unauthorized");
          return;
        }

        const authData = await authResp.json();
        const userId = authData.userId;


        const studentResp = await fetch(
          `https://localhost:7053/api/get-student/student-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!studentResp.ok) {
          setError("Failed to fetch student profile.");
          return;
        }

        const studentData = await studentResp.json();



        setStudent(studentData);


        localStorage.setItem("studentId", studentData.id);

      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndStoreId();
  }, [router]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("jwtToken");
    const studentId = localStorage.getItem("studentId"); 

    if (!token || !studentId) {
      setError("Authorization failed. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7053/api/fyp/register-fyp?studentId=${studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fyp_id: formData.fyp_id,
            Title: formData.title,
            Members: formData.members,
            Batch: formData.batch,
            Technology: formData.technology,
            Description: formData.description,
          }),
        }
      );

      if (response.ok) {
        setSuccess("FYP registered successfully and is awaiting approval.");

        setFormData({
          fyp_id: "",
          title: "",
          members: "",
          batch: "",
          technology: "",
          description: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to register FYP.");
      }
    } catch (err) {
      console.error("Error registering FYP:", err);
      setError("An error occurred while registering the FYP.");
    }
  };


  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-purple-300 mb-6">
          Register Your FYP
        </h1>

        {success && <p className="text-green-500 text-center mb-4">{success}</p>}


        {student && (
          <p className="text-center mb-6">
            Welcome, {student.firstName} {student.lastName} from{" "}
            {student.universityName}!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="fyp_id" className="block text-sm font-medium mb-1">
              FYP ID
            </label>
            <input
              id="fyp_id"
              name="fyp_id"
              placeholder="e.g. FYP-12345"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.fyp_id}
              onChange={handleInputChange}
              required
            />
          </div>


          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Project Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="e.g. AI in Healthcare"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>


          <div>
            <label htmlFor="members" className="block text-sm font-medium mb-1">
              Members (comma-separated)
            </label>
            <input
              id="members"
              name="members"
              placeholder="e.g. John Doe, Jane Smith"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.members}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Batch */}
          <div>
            <label htmlFor="batch" className="block text-sm font-medium mb-1">
              Batch
            </label>
            <input
              id="batch"
              name="batch"
              placeholder="e.g. 2024"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.batch}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Technology */}
          <div>
            <label htmlFor="technology" className="block text-sm font-medium mb-1">
              Technology
            </label>
            <input
              id="technology"
              name="technology"
              placeholder="e.g. Python, TensorFlow"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.technology}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Brief project description..."
              className="w-full p-2 h-24 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 rounded-md text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterFypPage;
