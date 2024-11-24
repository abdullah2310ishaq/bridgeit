"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface University {
  id: string;
  name: string;
  address: string;
  estYear: number;
}

interface Skill {
  id: string;
  skill: string;
}

interface Department {
  id: string;
  department: string;
}

const StudentRegistration: React.FC = () => {
  // State variables
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [universityId, setUniversityId] = useState<string>("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [rollNumber, setRollNumber] = useState<number | "">("");
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const router = useRouter();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesRes, skillsRes, departmentsRes, emailsRes] = await Promise.all([
          fetch("https://localhost:7053/api/universities/get-all-universities"),
          fetch("https://localhost:7053/api/skills/get-skills"),
          fetch("https://localhost:7053/api/Department/get-departments"),
          fetch("https://localhost:7053/api/register-user/get-all-emails"),
        ]);

        if (universitiesRes.ok) {
          setUniversities(await universitiesRes.json());
        } else {
          throw new Error("Failed to load universities.");
        }

        if (skillsRes.ok) {
          setAvailableSkills(await skillsRes.json());
        } else {
          throw new Error("Failed to load skills.");
        }

        if (departmentsRes.ok) {
          setDepartments(await departmentsRes.json());
        } else {
          throw new Error("Failed to load departments.");
        }

        if (emailsRes.ok) {
          setRegisteredEmails(await emailsRes.json());
        } else {
          throw new Error("Failed to load registered emails.");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, []);

  // Form validation
  useEffect(() => {
    if (
      firstName &&
      lastName &&
      email &&
      password.length >= 8 &&
      /[!@#$%^&*(),.?":{}|<>]/g.test(password) &&
      universityId &&
      departmentId &&
      rollNumber &&
      skills.length > 0 &&
      !emailError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [
    firstName,
    lastName,
    email,
    password,
    universityId,
    departmentId,
    rollNumber,
    skills,
    emailError,
  ]);

  // Handle email change and check for duplicates
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    // Check if email is already registered
    if (registeredEmails.includes(enteredEmail)) {
      setEmailError("This email is already registered.");
      setIsSubmitDisabled(true);
    } else {
      setEmailError(null);
    }
  };

  // Add skill to the list
  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  // Remove skill from the list
  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) {
      toast.error("Please provide a unique email address.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    // Prepare registration data
    const registrationData = {
      firstName,
      lastName,
      email,
      password,
      universityId,
      skills,
      departmentId,
      rollNumber,
      role: "Student",
    };

    try {
      // Store registration data in sessionStorage (excluding password for security)
      sessionStorage.setItem("registrationData", JSON.stringify(registrationData));

      // Generate OTP
      const generateOtpResponse = await fetch("https://localhost:7053/api/otp/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email), // Send email as a raw string
      });

      if (generateOtpResponse.ok) {
        // Send OTP to user's email
        const sendOtpResponse = await fetch("https://localhost:7053/api/otp/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email), // Send email as a raw string
        });

        if (sendOtpResponse.ok) {
          toast.success("OTP sent to your email. Please check your inbox.", {
            position: "top-center",
            autoClose: 3000,
          });

          // Redirect to OTP verification page with email in query params
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        } else {
          const errorText = await sendOtpResponse.text();
          toast.error(`Failed to send OTP email: ${errorText}`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } else {
        const errorText = await generateOtpResponse.text();
        toast.error(`Failed to generate OTP: ${errorText}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error during OTP process:", error);
      toast.error("An error occurred during the OTP process.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-extrabold text-center text-green-500 mb-6">
        Student Registration
      </h1>
      <form
        autoComplete="off"
        method="post"
        action=""
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-md"
      >
        <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
        <div>
          <label className="block text-sm font-semibold text-gray-300">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="off"
          />
          {emailError && <p className="text-red-400 mt-2">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="off"
            placeholder="At least 8 characters and a special character"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">University</label>
          <select
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="" disabled>
              Select your university
            </option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name} ({university.estYear})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Skills</label>
          <select
            value=""
            onChange={(e) => addSkill(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>
              Select a skill
            </option>
            {availableSkills.map((skill) => (
              <option key={skill.id} value={skill.skill}>
                {skill.skill}
              </option>
            ))}
          </select>
          <div className="mt-4">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center m-1 px-3 py-1 bg-green-600 text-white rounded-full"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-sm text-red-400 hover:text-red-600"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="" disabled>
              Select your department
            </option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Roll Number</label>
          <input
            type="number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value ? parseInt(e.target.value) : "")}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="off"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className={`py-4 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white ${
              loading || isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || isSubmitDisabled}
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default StudentRegistration;
