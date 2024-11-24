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

interface Interest {
  id: string;
  interest: string;
}

const FacultyRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [universityId, setUniversityId] = useState<string>('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [post, setPost] = useState<string>('');
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const router = useRouter();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesRes, interestsRes, emailsRes] = await Promise.all([
          fetch('https://localhost:7053/api/universities/get-all-universities'),
          fetch('https://localhost:7053/api/Interests/get-interests'),
          fetch('https://localhost:7053/api/register-user/get-all-emails'),
        ]);

        if (universitiesRes.ok) {
          setUniversities(await universitiesRes.json());
        } else {
          throw new Error('Failed to load universities.');
        }

        if (interestsRes.ok) {
          setAvailableInterests(await interestsRes.json());
        } else {
          throw new Error('Failed to load interests.');
        }

        if (emailsRes.ok) {
          setRegisteredEmails(await emailsRes.json());
        } else {
          throw new Error('Failed to load registered emails.');
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
      post &&
      interests.length > 0 &&
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
    post,
    interests,
    emailError,
  ]);

  // Handle email change and check for duplicates
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);

    // Check if email is already registered
    if (registeredEmails.includes(enteredEmail)) {
      setEmailError('This email is already registered.');
      setIsSubmitDisabled(true);
    } else {
      setEmailError(null);
    }
  };

  // Add interest to the list
  const addInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  // Remove interest from the list
  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) {
      toast.error('Please provide a unique email address.', {
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
      interests,
      role: "Faculty",
      post,
    };

    try {
      // Store registration data in sessionStorage (excluding password for security)
      sessionStorage.setItem("facultyRegistrationData", JSON.stringify(registrationData));

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

          // Redirect to OTP verification page with email and role in query params
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&role=faculty`);
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
      console.error('Error during OTP process:', error);
      toast.error('An error occurred during the OTP process.', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-extrabold text-center text-green-500 mb-6">Faculty Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md" autoComplete="off">
        <input autoComplete="false" name="hidden" type="text" style={{ display: 'none' }} />
        {/* Form Fields */}
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
            onChange={handleEmailChange}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          {emailError && (
            <p className="text-red-400 mt-2">{emailError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
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
            <option value="" disabled>Select your university</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name} ({university.estYear})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">Interests</label>
          <select
            value=""
            onChange={(e) => addInterest(e.target.value)}
            className="mt-1 block w-full p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>Select an interest</option>
            {availableInterests.map((interest) => (
              <option key={interest.id} value={interest.interest}>
                {interest.interest}
              </option>
            ))}
          </select>
          <div className="mt-4">
            {interests.map((interest) => (
              <span key={interest} className="inline-flex items-center m-1 px-3 py-1 bg-green-600 text-white rounded-full">
                {interest}
                <button type="button" onClick={() => removeInterest(interest)} className="ml-2 text-sm text-red-400 hover:text-red-600">
                  &times;
                </button>
              </span>
            ))}
          </div>
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
        <div className="flex justify-center">
          <button
            type="submit"
            className={`py-4 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white ${loading || isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading || isSubmitDisabled}
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default FacultyRegistration;
