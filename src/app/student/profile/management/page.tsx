"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "../../../contexts/UserContext"

const ProfileManagement: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [imageData, setImageData] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("password")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [originalFileSize, setOriginalFileSize] = useState<number | null>(null)
  const [compressedFileSize, setCompressedFileSize] = useState<number | null>(null)
  const router = useRouter()
  const { updateProfileImage } = useUser()

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    async function fetchUserProfile() {
      try {
        const profileResponse = await fetch("https://localhost:7053//api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setUserId(profileData.userId)
        } else {
          toast.error("Failed to fetch user profile.", {
            position: "top-center",
            autoClose: 3000,
          })
          router.push("/auth/login-user")
        }
      } catch (error) {
        toast.error("An error occurred while fetching the user profile.", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/auth/login-user")
      }
    }

    fetchUserProfile()
  }, [router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const confirmResponse = await fetch(
        `https://localhost:7053//api/edit-user-profile/confirm-current-password/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentPassword),
        },
      )

      if (!confirmResponse.ok) {
        toast.error("Current password is incorrect.")
        return
      }

      const response = await fetch(`https://localhost:7053//api/edit-user-profile/change-password/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPassword),
      })

      if (response.ok) {
        toast.success("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error("Failed to change password.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.")
    }
  }

  // Function to compress image
  const compressImage = (imageDataUrl: string, maxSizeKB = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsCompressing(true)
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        // If image is very large, scale it down
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width
          width = MAX_WIDTH
        }

        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height
          height = MAX_HEIGHT
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setIsCompressing(false)
          reject("Could not get canvas context")
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Try different quality levels until file size is under maxSizeKB
        const tryCompression = (quality: number) => {
          const dataUrl = canvas.toDataURL("image/jpeg", quality)

          // Calculate size in KB
          const base64 = dataUrl.split(",")[1]
          const sizeKB = Math.round((base64.length * 3) / 4 / 1024)

          if (sizeKB <= maxSizeKB || quality <= 0.1) {
            setIsCompressing(false)
            resolve(dataUrl)
          } else {
            // Try with lower quality
            setTimeout(() => {
              tryCompression(quality - 0.1)
            }, 0)
          }
        }

        // Start with quality 0.7
        tryCompression(0.7)
      }

      img.onerror = () => {
        setIsCompressing(false)
        reject("Error loading image")
      }

      img.src = imageDataUrl
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Read the file as data URL
    const reader = new FileReader()
    reader.onloadend = async () => {
      const imageDataUrl = reader.result as string

      // Calculate original file size in KB
      const originalSize = Math.round(file.size / 1024)
      setOriginalFileSize(originalSize)

      // If file is already small enough, use it directly
      if (originalSize <= 200) {
        setImageData(imageDataUrl)
        setCompressedFileSize(originalSize)
        return
      }

      // Otherwise compress the image
      try {
        toast.info("Compressing image to under 200KB...")
        const compressedImage = await compressImage(imageDataUrl)
        setImageData(compressedImage)

        // Calculate compressed size
        const base64 = compressedImage.split(",")[1]
        const compressedSize = Math.round((base64.length * 3) / 4 / 1024)
        setCompressedFileSize(compressedSize)
        toast.success(`Image compressed from ${originalSize}KB to ${compressedSize}KB`)
      } catch (error) {
        toast.error("Error compressing image. Please try another image.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !imageData) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const base64Image = imageData.split(",")[1] // Ensure we send only the base64 part
      const response = await fetch(`https://localhost:7053//api/edit-user-profile/set-profile-image/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(base64Image),
      })

      if (response.ok) {
        toast.success("Profile image updated successfully!")
        // Update the image in context so it reflects across the app
        updateProfileImage(base64Image)
        // Reset state
        setImageData("")
        setOriginalFileSize(null)
        setCompressedFileSize(null)
      } else {
        toast.error("Failed to update profile image.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-200 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-semibold text-white">Account Settings</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("password")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "password"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "image" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Update Profile Image
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "password" && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}

            {activeTab === "image" && (
              <form onSubmit={handleImageUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Image</label>
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
                            disabled={isCompressing}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB (will be compressed to under 200KB)
                      </p>
                    </div>
                  </div>
                </div>

                {isCompressing && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-600">Compressing image...</p>
                  </div>
                )}

                {imageData && !isCompressing && (
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      <img
                        src={imageData || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {originalFileSize && compressedFileSize && (
                      <div className="mt-2 text-sm text-gray-600 text-center">
                        {originalFileSize > 200 ? (
                          <p>
                            Compressed from {originalFileSize}KB to {compressedFileSize}KB
                            <br />
                            <span className="text-green-600 font-medium">
                              {Math.round((1 - compressedFileSize / originalFileSize) * 100)}% reduction
                            </span>
                          </p>
                        ) : (
                          <p>Image size: {compressedFileSize}KB (no compression needed)</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!imageData || isCompressing}
                    className={`w-full py-2 px-4 font-medium rounded-md transition duration-200 ${
                      !imageData || isCompressing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Upload Image
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProfileManagement

