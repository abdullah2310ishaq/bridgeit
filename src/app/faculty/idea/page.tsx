"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateIdea: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [technology, setTechnology] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    const facultyId = localStorage.getItem("facultyId"); // Ensure this is set during login/profile fetch.

    if (!token || !facultyId) {
      router.push("/auth/login-user");
      return;
    }

    const ideaData = {
      title,
      technology,
      description,
    };

    try {
      const response = await fetch(
        `https://localhost:7053/api/ideas/add-idea/${facultyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ideaData),
        }
      );

      if (response.ok) {
        toast.success("Idea created successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/faculty/idea/viewidea"); // Redirect to the ideas page.
      } else {
        const errorText = await response.text();
        toast.error(`Failed to create idea: ${errorText}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating idea:", error);
      toast.error("An error occurred while creating the idea.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">Create New Idea</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">
            Technology
          </label>
          <input
            type="text"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg"
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-6 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600"
        >
          Submit Idea
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateIdea;
