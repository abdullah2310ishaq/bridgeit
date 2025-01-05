"use client";
import { useState } from "react";
import Image from "next/image";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import ContactInfo from "./ContactInfo";

export default function ContactSection() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("access_key", "cf10bcb0-9a81-4467-86fc-cde2595377ae"); // Replace with your actual access key

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        (event.target as HTMLFormElement).reset();
      } else {
        setResult("An error occurred while submitting the form.");
      }
    } catch (error) {
      setResult("An error occurred while submitting the form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 px-4 bg-gray-900">
    <div className="max-w-7xl mx-auto text-center mb-12">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 mb-4">
        Get in Touch
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Whether you have questions, feedback, or partnership inquiries.
      </p>
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
     

      {/* Contact Info */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <FaEnvelope className="text-green-400 text-xl" />
          <a href="mailto:contact@bridgeit.com" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
            contact@bridgeit.com
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <FaPhone className="text-green-400 text-xl" />
          <a href="tel:+92-346-2207429" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
            +92-346-2207429
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-green-400 text-xl" />
          <span className="text-gray-300">Air University, Islamabad</span>
        </div>
      </div>
     
      {/* Contact Form */}
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <input
          type-="email"
          name="email"
          placeholder="Your Email"
          className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          className="p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          rows={5}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
        >
          Send Message
        </button>
      </form>
       {/* Image */}
       <div className="hidden lg:block">
        <Image
          src="/getintouch.png"
          alt="Get in touch"
          width={300}
          height={300}
         // className="rounded-lg shadow-lg"
        />
      </div>

    </div>
  </section>

  );
}
