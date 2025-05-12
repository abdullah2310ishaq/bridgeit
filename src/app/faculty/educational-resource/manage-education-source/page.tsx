"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface EducationalResource {
  id: string
  title: string
  content: string
  sourceLink: string
  facultyId: string
  facultyName: string
  facultyPost: string
  facultyDepartment: string
  universityId: string
  universityName: string
  universityLocation: string
}

const ManageEducationalResources = () => {
  const router = useRouter()
  const [resources, setResources] = useState<EducationalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [facultyId, setFacultyId] = useState<string | null>(null)

  // For editing
  const [editMode, setEditMode] = useState(false)
  const [editingResource, setEditingResource] = useState<EducationalResource | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    sourceLink: "",
  })

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("jwtToken")
        if (!token) {
          router.push("/auth/login-user")
          return
        }

        // First get the faculty ID
        const profileResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // Get faculty details
        const facultyResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!facultyResponse.ok) {
          throw new Error("Failed to fetch faculty details")
        }

        const facultyData = await facultyResponse.json()
        const facultyId = facultyData.id
        setFacultyId(facultyId)

        // Get resources by faculty ID
        const resourcesResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/get-by-id/${facultyId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!resourcesResponse.ok) {
          if (resourcesResponse.status === 404) {
            // No resources found is not an error
            setResources([])
            setLoading(false)
            return
          }
          throw new Error("Failed to fetch educational resources")
        }

        const resourcesData = await resourcesResponse.json()
        setResources(resourcesData)
      } catch (error) {
        console.error("Error fetching resources:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) {
      return
    }

    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to delete resource")
      }

      // Remove the deleted resource from state
      setResources((prev) => prev.filter((resource) => resource.id !== id))
      toast.success("Resource deleted successfully")
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast.error(`Failed to delete resource: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleEdit = (resource: EducationalResource) => {
    setEditingResource(resource)
    setEditForm({
      title: resource.title,
      content: resource.content,
      sourceLink: resource.sourceLink || "",
    })
    setEditMode(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingResource) return

    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/update/${editingResource.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update resource")
      }

      // Update the resource in state
      setResources((prev) =>
        prev.map((resource) =>
          resource.id === editingResource.id
            ? {
                ...resource,
                title: editForm.title,
                content: editForm.content,
                sourceLink: editForm.sourceLink,
              }
            : resource,
        ),
      )

      toast.success("Resource updated successfully")
      setEditMode(false)
      setEditingResource(null)
    } catch (error) {
      console.error("Error updating resource:", error)
      toast.error(`Failed to update resource: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditingResource(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-red-400">Error</h1>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Manage Educational Resources</h1>
          <button
            onClick={() => router.push("/faculty/add-educational-resource")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
          >
            Add New Resource
          </button>
        </div>

        {editMode && editingResource ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Resource</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={editForm.content}
                  onChange={handleEditChange}
                  required
                  rows={6}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <div>
                <label htmlFor="sourceLink" className="block text-sm font-medium text-gray-300 mb-1">
                  Source Link (Optional)
                </label>
                <input
                  type="url"
                  id="sourceLink"
                  name="sourceLink"
                  value={editForm.sourceLink}
                  onChange={handleEditChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {resources.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-center">
            <svg className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-300">No resources found</h2>
            <p className="mt-2 text-gray-400">You havenot added any educational resources yet.</p>
            <button
              onClick={() => router.push("/faculty/add-educational-resource")}
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors"
            >
              Add Your First Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-2">{resource.title}</h2>
                <p className="text-gray-300 mb-4">{resource.content}</p>
                {resource.sourceLink && (
                  <a
                    href={resource.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline mb-4 inline-block"
                  >
                    View Source
                  </a>
                )}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default ManageEducationalResources
