"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"

const EditStudentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    description: "",
    profileImage: "",
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user") // Redirect to login if no token
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Failed to fetch profile")

        const data = await response.json()
        setProfile(data)
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          description: data.description || "",
          profileImage: data.profileImage || "",
        })
      } catch (err) {
        setError("Failed to load profile.")
        toast.error("An error occurred while loading your profile.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setForm({ ...form, profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      // Update description and other details
      await fetch(`https://localhost:7053/api/edit-user-profile/update-user-data/${profile.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Firstname: form.firstName,
          Lastname: form.lastName,
          description: form.description,
        }),
      })

      // Update profile image
      if (form.profileImage) {
        const base64Image = form.profileImage.split(",")[1] // Remove data:image/png;base64,
        await fetch(`https://localhost:7053/api/edit-user-profile/set-profile-image/${profile.userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(base64Image),
        })
      }

      toast.success("Profile updated successfully!")
      router.push("/student/profile") // Redirect to dashboard
    } catch (err) {
      console.error("Error updating profile:", err)
      toast.error("Failed to update profile.")
    }
  }

  if (loading) return <div className="text-center text-gray-400">Loading...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-8">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg relative">
        {/* Header Section */}
        <div className="flex items-center justify-center mb-8">
          {/* Logo Image */}
          <Image src="/logo.jpg" alt="Logo" width={60} height={60} className="mr-4 rounded-full shadow-md" />
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Edit Profile
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label className="block text-sm text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            ></textarea>
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm text-gray-700">Profile Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {form.profileImage && (
              <div className="mt-4 flex justify-center">
                <img
                  src={form.profileImage || "/placeholder.svg"}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full"
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save Changes
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default EditStudentProfilePage

