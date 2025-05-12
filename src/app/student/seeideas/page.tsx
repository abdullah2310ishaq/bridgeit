"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Search, Lightbulb, Code, User, BookOpen, Filter, ChevronDown, Star, Bookmark, TrendingUp, Zap, Cpu, Database, Globe, Smartphone, Cloud, Shield, Server } from 'lucide-react'

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  universityName: string
  uniId: string
  stdId: string
}

interface Idea {
  id: string
  title: string
  technology: string
  description: string
  facultyName: string
  email: string
  uniName: string
}

// Technology categories with icons
const techCategories = [
  { name: "All", icon: <Code className="w-4 h-4" /> },
  { name: "AI/ML", icon: <Cpu className="w-4 h-4" /> },
  { name: "Web", icon: <Globe className="w-4 h-4" /> },
  { name: "Mobile", icon: <Smartphone className="w-4 h-4" /> },
  { name: "Cloud", icon: <Cloud className="w-4 h-4" /> },
  { name: "Security", icon: <Shield className="w-4 h-4" /> },
  { name: "Database", icon: <Database className="w-4 h-4" /> },
  { name: "Backend", icon: <Server className="w-4 h-4" /> },
]

const IdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<string[]>([])

  const router = useRouter()

  // Example: Local array of taken idea IDs
  // In a real app, you'd store/fetch this from localStorage or a global state.
  const [takenIds] = useState<string[]>(["idea123", "someOtherId"])

  useEffect(() => {
    // Load bookmarked ideas from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedIdeas")
    if (savedBookmarks) {
      setBookmarkedIdeas(JSON.parse(savedBookmarks))
    }

    const fetchIdeas = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        toast.error("Please log in to access this page.", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/auth/login-user")
        return
      }

      try {
        // 1) authorized-user-info => userId
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!profileResponse.ok) {
          throw new Error("Authorization failed. Please log in again.")
        }

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // 2) get-student => uniId
        const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!studentResponse.ok) {
          throw new Error("Failed to fetch student details.")
        }

        const studentData = await studentResponse.json()
        const uniId = studentData.universityId

        // Save user profile
        setUserProfile({
          userId: studentData.userId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          universityName: studentData.universityName,
          uniId: uniId,
          stdId: studentData.id,
        })

        // 3) fetch ideas => get-ideas-by-uni
        const ideasResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/get-ideas-by-uni/${uniId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!ideasResponse.ok) {
          throw new Error("Failed to fetch ideas.")
        }

        const ideasData = await ideasResponse.json()

        // Filter out ideas with IDs in takenIds
        const filtered = ideasData.filter((idea: Idea) => !takenIds.includes(idea.id))

        setIdeas(filtered)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unexpected error occurred.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [router, takenIds])

  // Toggle bookmark for an idea
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    
    const newBookmarkedIdeas = bookmarkedIdeas.includes(id)
      ? bookmarkedIdeas.filter(ideaId => ideaId !== id)
      : [...bookmarkedIdeas, id]
    
    setBookmarkedIdeas(newBookmarkedIdeas)
    localStorage.setItem("bookmarkedIdeas", JSON.stringify(newBookmarkedIdeas))
    
    toast.success(
      bookmarkedIdeas.includes(id) ? "Removed from bookmarks" : "Added to bookmarks", 
      { autoClose: 2000 }
    )
  }

  // Get image for idea based on technology
  const getIdeaImage = (technology: string) => {
    const techLower = technology.toLowerCase()
    
    if (techLower.includes("ai") || techLower.includes("machine") || techLower.includes("ml")) {
      return "https://images.unsplash.com/photo-1677442135136-760c813a6a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    } else if (techLower.includes("web") || techLower.includes("react") || techLower.includes("angular")) {
      return "https://images.unsplash.com/photo-1581092160607-ee22731b9b0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    } else if (techLower.includes("mobile") || techLower.includes("android") || techLower.includes("ios")) {
      return "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    } else if (techLower.includes("cloud") || techLower.includes("aws") || techLower.includes("azure")) {
      return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    } else if (techLower.includes("security") || techLower.includes("cyber")) {
      return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    } else if (techLower.includes("data") || techLower.includes("database")) {
      return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2034&q=80"
    } else if (techLower.includes("iot") || techLower.includes("embedded")) {
      return "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    } else {
      return "https://images.unsplash.com/photo-1573495612937-f02b92648e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading project ideas...</p>
          <p className="text-sm text-gray-500 mt-2">Discovering your next big project</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth/login-user")}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Filter ideas by searchTerm and category
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" ||
      idea.technology.toLowerCase().includes(selectedCategory.toLowerCase())

    return matchesSearch && matchesCategory
  })

  // Sort ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortBy === "newest") {
      // For demo purposes, sort by ID (in a real app, you'd use a date field)
      return b.id.localeCompare(a.id)
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "bookmarked") {
      const aBookmarked = bookmarkedIdeas.includes(a.id) ? 1 : 0
      const bBookmarked = bookmarkedIdeas.includes(b.id) ? 1 : 0
      return bBookmarked - aBookmarked
    }
    return 0
  })

  const handleIdeaClick = (id: string) => {
    router.push(`/student/seeideas/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Project Ideas Banner"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-2">Final Year Project Ideas</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Discover innovative project ideas from your university faculty members
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* University Profile Card */}
        {userProfile && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 -mt-16 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">{userProfile.universityName}</h2>
                <p className="text-gray-600">
                  Welcome, {userProfile.firstName} {userProfile.lastName}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-blue-500" />
                <span>{userProfile.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{ideas.length}</p>
                <p className="text-sm text-gray-600">Total Ideas</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(ideas.map((idea) => idea.facultyName)).size}
                </p>
                <p className="text-sm text-gray-600">Faculty Members</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-3">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(ideas.map((idea) => idea.technology)).size}
                </p>
                <p className="text-sm text-gray-600">Technologies</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-3">
                <Bookmark className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{bookmarkedIdeas.length}</p>
                <p className="text-sm text-gray-600">Bookmarked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ideas by title, technology or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {techCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Sort By */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="bookmarked">Bookmarked First</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Technology Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {techCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category.name
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {sortedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
                onClick={() => handleIdeaClick(idea.id)}
              >
                {/* Idea Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={getIdeaImage(idea.technology) || "/placeholder.svg"}
                    alt={idea.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                  
                  {/* Technology Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {idea.technology}
                    </span>
                  </div>
                  
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(idea.id, e)}
                    className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarkedIdeas.includes(idea.id) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
                      }`}
                    />
                  </button>
                  
                  {/* Title */}
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="text-lg font-bold text-white">{idea.title}</h3>
                  </div>
                </div>
                
                {/* Idea Content */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{idea.description}</p>
                  
                  {/* Faculty Info */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{idea.facultyName}</p>
                        <p className="text-xs text-gray-500">{idea.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-600">View Details</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="No ideas found"
              className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No ideas found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? `No ideas match your search "${searchTerm}". Try different keywords or filters.`
                : "No project ideas are available for your university at the moment."}
            </p>
          </div>
        )}

        {/* Trending Technologies Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Trending Technologies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-full mr-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-purple-800">AI & Machine Learning</h3>
              </div>
              <p className="text-sm text-purple-700">
                Explore cutting-edge AI technologies including deep learning, NLP, and computer vision.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-800">Web Development</h3>
              </div>
              <p className="text-sm text-blue-700">
                Build modern web applications using React, Angular, Vue, and other cutting-edge frameworks.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-full mr-2">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-green-800">Mobile Development</h3>
              </div>
              <p className="text-sm text-green-700">
                Create native and cross-platform mobile apps for iOS and Android platforms.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-2">
                <div className="bg-yellow-100 p-2 rounded-full mr-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="font-bold text-yellow-800">Cybersecurity</h3>
              </div>
              <p className="text-sm text-yellow-700">
                Develop solutions for network security, encryption, and vulnerability assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Faculty Spotlight */}
        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-blue-500" />
            Faculty Spotlight
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from(new Set(ideas.map(idea => idea.facultyName))).slice(0, 3).map((facultyName, index) => {
              const facultyIdea = ideas.find(idea => idea.facultyName === facultyName)
              if (!facultyIdea) return null
              
              return (
                <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-blue-200">
                    <img
                      src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 1}.jpg`}
                      alt={facultyName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 text-center">{facultyName}</h3>
                  <p className="text-sm text-gray-500 text-center mb-2">{facultyIdea.email}</p>
                  <p className="text-xs text-blue-600 text-center">
                    {ideas.filter(idea => idea.facultyName === facultyName).length} project ideas
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default IdeasPage

