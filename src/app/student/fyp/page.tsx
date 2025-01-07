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

interface FacultyData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  post: string;
  email: string
  // Add other properties you need from GetFacultyDTO...
}

interface FypFormData {
  fyp_id: string;
  title: string;
  members: number;
  batch: string;
  technology: string;
  description: string;
  facultyId: string; // <-- Add this
}

const RegisterFypPage: React.FC = () => {
  const router = useRouter();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [faculties, setFaculties] = useState<FacultyData[]>([]); // <-- Faculty list state

  const [formData, setFormData] = useState<FypFormData>({
    fyp_id: "",
    title: "",
    members: 0,
    batch: "",
    technology: "",
    description: "",
    facultyId: "",
   
    // Initialize as empty
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentAndFaculties = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // 1) Fetch the Auth Info (userId)
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

        // 2) Fetch the Student profile
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

        // Store student ID for use in handleSubmit
        localStorage.setItem("studentId", studentData.id);

        // 3) Fetch the Faculties list
        const facultiesResp = await fetch(`https://localhost:7053/api/get-faculty/faculties`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!facultiesResp.ok) {
          setError("Failed to fetch faculties list.");
          return;
        }

        const facultiesData = await facultiesResp.json();
        setFaculties(facultiesData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndFaculties();
  }, [router]);

  // Handle form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError(null);
    setSuccess(null);
  
    if (formData.members <= 0) {
      setError("Members must be greater than 0.");
      return;
    }
  
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
            FacultyId: formData.facultyId,
          }),
        }
      );
  
      if (response.ok) {
        setSuccess("FYP registered successfully and is awaiting approval.");
        setFormData({
          fyp_id: "",
          title: "",
          members: 0, // Reset members field
          batch: "",
          technology: "",
          description: "",
          facultyId: "",
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
          {/* FYP ID */}
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

          {/* Project Title */}
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

          {/* Members */}
          <div>
  <label htmlFor="members" className="block text-sm font-medium mb-1">
    Number of Members
  </label>
  <input
    id="members"
    name="members"
    type="number" // Ensure it's a numeric input
    min="1" // HTML5 validation ensures no values less than 1
    placeholder="e.g. 3"
    className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
    value={formData.members}
    onChange={(e) => {
      const value = parseInt(e.target.value, 10);
      setFormData((prev) => ({
        ...prev,
        members: isNaN(value) ? 0 : value, // Ensure members is a number
      }));
    }}
    required
  />
  {formData.members <= 0 && (
    <p className="text-red-500 text-sm mt-1">Members must be greater than 0.</p>
  )}
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

          {/* Faculty Selection */}
          <div>
            <label htmlFor="facultyId" className="block text-sm font-medium mb-1">
              Assign Faculty
            </label>
            <select
              id="facultyId"
              name="facultyId"
              className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.facultyId}
              onChange={handleInputChange}
              required
            >
           <option value="">-- Select a Faculty --</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                {faculty.firstName} {faculty.lastName} - {faculty.email}
              </option>
            ))}

            </select>
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
