"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface IndustryExpertProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  companyName: string
  address: string
  contact: string
  description: string
}

const EditIndustryExpertProfile: React.FC = () => {
  const [profile, setProfile] = useState<IndustryExpertProfile>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    address: "",
    contact: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/unauthorized")
        return
      }

      try {
        const response = await fetch("http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user info")
        }

        const { userId } = await response.json()

        const profileResponse = await fetch(
          `http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await profileResponse.json()

        setProfile({
          userId: data.userId,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          companyName: data.companyName || "",
          address: data.address || "",
          contact: data.contact || "",
          description: data.description || "",
        })
      } catch (error) {
        toast.error("An error occurred while fetching profile.")
        router.push("/unauthorized")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile({ ...profile, [name]: value })
  }

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("You must be logged in.")
      return
    }

    try {
      const response = await fetch(`http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/update-user-data/${profile.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Firstname: profile.firstName,
          Lastname: profile.lastName,
          description: profile.description,
        }),
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
        router.push("/industryexpert/profile")
      } else {
        toast.error("Failed to update profile.")
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-800">Edit Profile</h1>
          <p className="text-slate-600 mt-2">Update your professional information</p>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={profile.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
              <input
                type="text"
                name="contact"
                value={profile.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={profile.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                rows={4}
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSaveChanges}
                className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition duration-200 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default EditIndustryExpertProfile
