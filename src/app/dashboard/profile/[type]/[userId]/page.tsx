"use client"
import { notFound } from "next/navigation"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  imageData: string | null
  description: string
  department?: string
  universityName?: string
  universityId?: string
  address?: string
  companyName?: string
  contact?: string
  rollNumber?: string
  skills?: string[]
  post?: string
  uniImage?: string | null
}

interface UniversityDTO {
  id: string
  name: string
  address: string
  estYear: number
  uniImage: string | null
}

async function fetchProfile(type: string, userId: string): Promise<UserProfile | null> {
  try {
    let url = ""

    switch (type) {
      case "student":
        url = `https://localhost:7053/api/get-student/student-by-id/${userId}`
        break
      case "faculty":
        url = `https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`
        break
      case "industry":
        url = `https://localhost:7053/api/get-industry-expert/industry-expert-by-id/${userId}`
        break
      default:
        throw new Error("Invalid type")
    }

    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    return (await response.json()) as UserProfile
  } catch (err) {
    console.error(err)
    return null
  }
}

async function fetchUniversityById(universityId: string): Promise<UniversityDTO | null> {
  try {
    const response = await fetch(`https://localhost:7053/api/universities/get-university-by-id/${universityId}`)
    if (!response.ok) {
      return null
    }

    return (await response.json()) as UniversityDTO
  } catch (err) {
    console.error(err)
    return null
  }
}

const ProfilePage = async ({ params }: { params: { type: string; userId: string } }) => {
  const { type, userId } = params

  const profile = await fetchProfile(type, userId)
  if (!profile) {
    notFound()
    return null
  }

  let university: UniversityDTO | null = null
  if (profile.universityId) {
    university = await fetchUniversityById(profile.universityId)
  }

  const formatImageSrc = (imageData: string | null) => {
    if (imageData) {
      return imageData.startsWith("data:image") ? imageData : `data:image/jpeg;base64,${imageData}`
    }
    return "/default-profile.jpg"
  }

  const notAvailable = (value: string | undefined) => {
    return value ? value : "Not Available"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <img
                src={formatImageSrc(profile.imageData) || "/placeholder.svg"}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm text-gray-500">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-gray-500">{notAvailable(profile.email)}</p>
            </div>

            {profile.description && (
              <div>
                <p className="text-sm font-medium">About</p>
                <p className="text-sm text-gray-500">{profile.description}</p>
              </div>
            )}

            {profile.address && (
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-gray-500">{profile.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Profile Details</h2>

          <div className="space-y-6">
            {/* Type-specific details */}
            {type === "student" && (
              <div>
                <h3 className="text-md font-medium">Student Information</h3>
                <hr className="my-2 border-gray-200" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium">Roll Number</p>
                    <p className="text-sm text-gray-500">{notAvailable(profile.rollNumber)}</p>
                  </div>
                </div>
              </div>
            )}

            {type === "faculty" && (
              <div>
                <h3 className="text-md font-medium">Faculty Information</h3>
                <hr className="my-2 border-gray-200" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-gray-500">{notAvailable(profile.department)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Position</p>
                    <p className="text-sm text-gray-500">{notAvailable(profile.post)}</p>
                  </div>
                </div>
              </div>
            )}

            {type === "industry" && (
              <div>
                <h3 className="text-md font-medium">Industry Expert Information</h3>
                <hr className="my-2 border-gray-200" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p className="text-sm text-gray-500">{notAvailable(profile.companyName)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-gray-500">{notAvailable(profile.contact)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* University Information */}
            {university && (
              <div>
                <h3 className="text-md font-medium">University Information</h3>
                <hr className="my-2 border-gray-200" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-gray-500">{university.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-gray-500">{university.address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Established</p>
                    <p className="text-sm text-gray-500">{university.estYear || "N/A"}</p>
                  </div>
                  {university.uniImage && (
                    <div>
                      <p className="text-sm font-medium">University Logo</p>
                      <div className="mt-2">
                        <img
                          src={formatImageSrc(university.uniImage) || "/placeholder.svg"}
                          alt={`${university.name} Logo`}
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="text-md font-medium">Skills</h3>
                <hr className="my-2 border-gray-200" />
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

