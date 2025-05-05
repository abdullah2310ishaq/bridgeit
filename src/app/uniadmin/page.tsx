"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Import components
import Sidebar from "./components/Sidebar"
import AdminProfileCard from "./components/AdminProfileCard"
import UniversityStats from "./components/UniversityStats"
import SearchSection from "./components/SearchSection"
import StudentProjects from "./components/StudentProjects"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorDisplay from "./components/ErrorDisplay"

// ------------ Interfaces ------------
interface AdminProfile {
  firstName: string
  lastName: string
  email: string
  officeAddress: string
  contact: string
  university: string
  profileImage: string
}

interface SearchResult {
  userId: string
  firstName: string
  lastName: string
  email: string
  description: string
  imageData: string | null
}

// For your student projects
interface StudentProject {
  id: string
  title: string
  status: string // "Ongoing", "Completed", etc.
  studentName: string
  expertName: string
  endDate: string
  universityName: string
  // ...anything else returned by the API
}

interface Event {
  id: string
  title: string
  speakerName: string
  eventDate: string
  venue: string
}

const UniAdminDashboard: React.FC = () => {
  const router = useRouter()

  // ------------------- Admin-related States -------------------
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true) // for the overall page
  const [error, setError] = useState<string | null>(null)

  // ------------------- University Stats -------------------
  const [studentsCount, setStudentsCount] = useState(0)
  const [facultiesCount, setFacultiesCount] = useState(0)

  // ------------------- Searching -------------------
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")

  // ------------------- Projects States -------------------
  const [studentProjects, setStudentProjects] = useState<StudentProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    const fetchAdminData = async () => {
      try {
        // Step A: Validate user & role
        const profileRes = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (!profileRes.ok) throw new Error("Failed to fetch authorized user info")
        const profileData = await profileRes.json()

        if (profileData.role !== "UniversityAdmin") {
          toast.error("You are not authorized to access this page.")
          router.push("/unauthorized")
          return
        }

        // Step B: Fetch this Admin's profile
        const adminResponse = await fetch(
          `https://localhost:7053/api/get-uni-admins/admins-by-id/${profileData.userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (!adminResponse.ok) throw new Error("Failed to fetch University Admin profile")

        const adminData = await adminResponse.json()
        setAdminProfile({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          officeAddress: adminData.officeAddress,
          contact: adminData.contact,
          university: adminData.university,
          profileImage: adminData.profileImage,
        })

        // Step C: Fetch university-wide stats
        const [studentsRes, facultyRes] = await Promise.all([
          fetch(
            `https://localhost:7053/api/get-student/student-by-university/${adminData.university}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
          fetch(
            `https://localhost:7053/api/get-faculty/faculty-by-university/${adminData.university}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ])
        if (!studentsRes.ok || !facultyRes.ok) throw new Error("Failed to fetch university data")

        const [studentsData, facultiesData] = await Promise.all([studentsRes.json(), facultyRes.json()])
        setStudentsCount(studentsData.length)
        setFacultiesCount(facultiesData.length)

        // Step D: Also fetch the Ongoing Student Projects
        await fetchStudentProjects(token, adminData.university)
      } catch (err) {
        console.error("Error in fetchAdminData:", err)
        setError("Failed to load profile or university data")
        toast.error("An error occurred while fetching data.")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [router])

  const fetchStudentProjects = async (token: string, uniName: string) => {
    setLoadingProjects(true)
    setProjectsError(null)

    try {
      // GET /api/projects/get-student-projects
      const projectsRes = await fetch(
        "https://localhost:7053/api/projects/get-student-projects",
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!projectsRes.ok) {
        throw new Error("Failed to fetch student projects")
      }

      const projects = (await projectsRes.json()) as StudentProject[]

      // Filter only ongoing (adjust the condition if your status string is different)
      const ongoingProjects = projects.filter((proj) => proj.status === "Pending")

      // If you need to filter by this admin's university, make sure each project
      // has a `university` field.
      const ongoingForThisUni = ongoingProjects.filter((p) => p.universityName === uniName)

      setStudentProjects(ongoingProjects)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setProjectsError("An error occurred while fetching projects")
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    router.push("/auth/login-user")
  }

  const handleSearch = async (query: string, searchType: string) => {
    if (!adminProfile) return
    setSearchLoading(true)
    setSearchError("")

    try {
      let res: Response
      if (searchType === "student") {
        res = await fetch(
          `https://localhost:7053/api/get-student/student-by-name/${query}?university=${adminProfile.university}`,
        )
      } else {
        // faculty
        res = await fetch(
          `https://localhost:7053/api/get-faculty/faculty-by-name/${query}?university=${adminProfile.university}`,
        )
      }
      if (!res.ok) {
        throw new Error("Not Found! Try Creating One")
      }
      const data = await res.json()
      if (data.length === 0) {
        setResults([])
        setSearchError("No results found")
      } else {
        setResults(data)
      }
    } catch (err: any) {
      setSearchError(err.message || "An error occurred")
      setResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-700">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Profile Card */}
          <AdminProfileCard adminProfile={adminProfile} />

          {/* University Stats */}
          <UniversityStats studentsCount={studentsCount} facultiesCount={facultiesCount} />

          {/* Search Section */}
          <SearchSection
            universityName={adminProfile?.university}
            onSearch={handleSearch}
            searchLoading={searchLoading}
            searchError={searchError}
            results={results}
          />

          {/* Student Projects Section */}
          <StudentProjects
            loadingProjects={loadingProjects}
            projectsError={projectsError}
            studentProjects={studentProjects}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default UniAdminDashboard
