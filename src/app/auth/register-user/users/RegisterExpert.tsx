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
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const router = useRouter();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, emailsRes] = await Promise.all([
          fetch('https://localhost:7053/api/companies/get-all-companies'),
          fetch('https://localhost:7053/api/register-user/get-all-emails'),
        ]);

        if (companiesRes.ok) {
          setCompanies(await companiesRes.json());
        } else {
          throw new Error('Failed to load companies.');
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
      contact &&
      post &&
      companyId &&
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
    contact,
    post,
    companyId,
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
      role: "IndustryExpert",
      password,
      contact,
      post,
      companyId,
    };

    try {
      // Store registration data in sessionStorage (excluding password for security)
      sessionStorage.setItem("industryExpertRegistrationData", JSON.stringify(registrationData));

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
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&role=industryExpert`);
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
      console.error(error);
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
      <h1 className="text-4xl font-extrabold text-center text-green-500 mb-6">Register as Industry Expert</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md" autoComplete="off">
        <input autoComplete="false" name="hidden" type="text" style={{ display: 'none' }} />
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

export default RegisterIndustryExpert;
