"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  X,
  Code,
  CheckCircle,
  UserCircle,
  Building,
  Send,
  DollarSign,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  Users,
  Target,
} from "lucide-react"
import { motion } from "framer-motion"
import ProposalModal from "../../stdcomps/ProposalModal"

interface ExpertProject {
  id: string
  title: string
  description: string
  stack?: string
  status?: string
  expertName?: string
  companyName?: string
  budget?: number
  startDate?: string
  endDate?: string
  isFeatured?: boolean
  matchScore?: number
  isRequested?: boolean
}

interface ProjectDetailsPanelProps {
  project: ExpertProject
  onClose: () => void
}

const ProjectDetailsPanel: React.FC<ProjectDetailsPanelProps> = ({ project, onClose }) => {
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false)
  const [studentId, setStudentId] = useState<string>("")

  // Optionally fetch the student ID if needed
  useEffect(() => {
    async function fetchStudentId() {
      const token = localStorage.getItem("jwtToken")
      if (!token) return

      try {
        const response = await fetch("https://localhost:7053/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) return

        const data = await response.json()
        const studentRes = await fetch(`https://localhost:7053/api/get-student/student-by-id/${data.userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!studentRes.ok) return

        const studentData = await studentRes.json()
        setStudentId(studentData.id)
      } catch (error) {
        console.error("Error fetching student data:", error)
      }
    }

    fetchStudentId()
  }, [])

  // Update the getProjectImage function to use more detailed CS/AI themed images
  const getProjectImage = (title: string) => {
    const seed = title.length % 3 // Use title length to create some variety
    const images = [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
      "https://images.unsplash.com/photo-1677442135136-760c813a6a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    ]
    return images[seed]
  }

  // Generate random project requirements
  const getProjectRequirements = () => {
    return [
      "Strong understanding of machine learning algorithms",
      "Experience with Python and data visualization",
      "Ability to work independently and meet deadlines",
      "Good communication skills for regular progress updates",
      "Passion for solving complex problems",
    ]
  }

  // Generate random benefits
  const getProjectBenefits = () => {
    return [
      "Work directly with industry experts",
      "Add a professional project to your portfolio",
      "Potential for publication or conference presentation",
      "Networking opportunities with industry professionals",
      "Flexible working hours",
    ]
  }

  return (
    <motion.div
      className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 rounded-xl shadow-2xl overflow-y-auto max-h-screen border border-purple-900/30"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 opacity-50 -z-10"></div>

      {/* Project Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getProjectImage(project.title) || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-90"></div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 bg-gray-900/50 text-gray-400 hover:text-white rounded-full backdrop-blur-sm transition-colors duration-300"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Expert Info */}
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
            <img
              src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt={project.expertName || "Expert"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{project.expertName || "Expert"}</p>
            <p className="text-xs text-purple-300">{project.companyName || "Company"}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Project Title */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-wide">
          {project.title}
        </h1>

        {/* Opportunity Banner */}
        <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 border border-purple-500/30 flex items-center">
          <Zap className="text-yellow-400 w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-yellow-300 text-sm font-medium">
            This is your chance to work on a real-world project and build your portfolio!
          </p>
        </div>

        {/* Project Info */}
        <div className="mb-8 space-y-6">
          <p className="text-lg text-gray-300 leading-relaxed">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tech Stack */}
            {project.stack && (
              <div className="flex items-start p-3 rounded-lg bg-gray-800/50 border border-purple-900/20">
                <Code className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-purple-300 block mb-1">Tech Stack</span>
                  <span className="text-gray-300">{project.stack}</span>
                </div>
              </div>
            )}

            {/* Status */}
            {project.status && (
              <div className="flex items-start p-3 rounded-lg bg-gray-800/50 border border-purple-900/20">
                <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-yellow-300 block mb-1">Status</span>
                  <span className="text-gray-300">{project.status}</span>
                </div>
              </div>
            )}

            {/* Expert */}
            {project.expertName && (
              <div className="flex items-start p-3 rounded-lg bg-gray-800/50 border border-purple-900/20">
                <UserCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-purple-300 block mb-1">Expert</span>
                  <span className="text-gray-300">{project.expertName}</span>
                </div>
              </div>
            )}

            {/* Company */}
            {project.companyName && (
              <div className="flex items-start p-3 rounded-lg bg-gray-800/50 border border-purple-900/20">
                <Building className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-blue-300 block mb-1">Company</span>
                  <span className="text-gray-300">{project.companyName}</span>
                </div>
              </div>
            )}

            {/* Budget */}
            {project.budget !== undefined && (
              <div className="flex items-start p-3 rounded-lg bg-gray-800/50 border border-purple-900/20">
                <DollarSign className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-green-300 block mb-1">Budget</span>
                  <span className="text-gray-300">${project.budget}</span>
                </div>
              </div>
            )}

            {/* Dates */}
            {(project.startDate || project.endDate) && (
              <div className="flex items-start p-3 rounded-lg bg-gray-800/50 border border-purple-900/20">
                <Calendar className="w-5 h-5 text-pink-400 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-pink-300 block mb-1">Timeline</span>
                  <div className="flex items-center text-gray-300">
                    {project.startDate && <span>{project.startDate}</span>}
                    {project.startDate && project.endDate && <ArrowRight className="w-3 h-3 mx-2" />}
                    {project.endDate && <span>{project.endDate}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Featured Badge */}
          {project.isFeatured && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
              <Award className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-300">Featured Project</span>
            </div>
          )}

          {/* Match Score */}
          {project.matchScore !== undefined && project.matchScore > 0 && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 ml-2">
              <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                {project.matchScore} skill{project.matchScore !== 1 ? "s" : ""} matched
              </span>
            </div>
          )}

          {/* Project Requirements */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-purple-300 flex items-center mb-3">
              <Target className="w-5 h-5 mr-2 text-purple-400" />
              Requirements
            </h3>
            <ul className="space-y-2 pl-6">
              {getProjectRequirements().map((req, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Project Benefits */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-green-300 flex items-center mb-3">
              <Award className="w-5 h-5 mr-2 text-green-400" />
              Benefits
            </h3>
            <ul className="space-y-2 pl-6">
              {getProjectBenefits().map((benefit, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submit Proposal Button */}
        <motion.button
          className="group w-full px-6 py-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 text-white font-medium rounded-xl shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 border border-purple-500/30"
          onClick={() => setShowProposalModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center">
            <Send className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            Submit Your Proposal
          </span>
        </motion.button>

        {/* Motivational Text */}
        <p className="text-center text-sm text-purple-300 mt-3 italic">
          "Showcase your unique skills and stand out from the crowd!"
        </p>

        {/* Timeline */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-medium text-purple-300">Project Timeline</h3>
          </div>

          <div className="relative pl-8 border-l-2 border-purple-900/30 space-y-6">
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-purple-500"></div>
              <h4 className="text-purple-300 font-medium">Application Phase</h4>
              <p className="text-sm text-gray-400 mt-1">
                Submit your proposal explaining why you're a good fit for this project
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-500"></div>
              <h4 className="text-blue-300 font-medium">Selection Process</h4>
              <p className="text-sm text-gray-400 mt-1">
                The expert will review all proposals and select the best candidate
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-500"></div>
              <h4 className="text-green-300 font-medium">Project Kickoff</h4>
              <p className="text-sm text-gray-400 mt-1">
                Once selected, you'll begin working with the expert on the project
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-yellow-500"></div>
              <h4 className="text-yellow-300 font-medium">Project Completion</h4>
              <p className="text-sm text-gray-400 mt-1">
                Deliver your final work and receive feedback from your expert
              </p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/30">
          <h3 className="text-lg font-medium text-blue-300 flex items-center mb-3">
            <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
            Additional Resources
          </h3>
          <ul className="space-y-2">
            <li className="text-blue-300 hover:text-blue-200 text-sm underline cursor-pointer">
              How to write a winning project proposal
            </li>
            <li className="text-blue-300 hover:text-blue-200 text-sm underline cursor-pointer">
              Tips from experts on standing out
            </li>
            <li className="text-blue-300 hover:text-blue-200 text-sm underline cursor-pointer">
              Sample projects and success stories
            </li>
          </ul>
        </div>

        {/* Similar Projects */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-purple-300 flex items-center mb-3">
            <Users className="w-5 h-5 mr-2 text-purple-400" />
            Similar Projects
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30 hover:border-purple-500/30 cursor-pointer transition-colors">
              <h4 className="text-sm font-medium text-white">Advanced ML Algorithm</h4>
              <p className="text-xs text-gray-400 mt-1">Similar tech stack and requirements</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30 hover:border-purple-500/30 cursor-pointer transition-colors">
              <h4 className="text-sm font-medium text-white">Data Visualization Project</h4>
              <p className="text-xs text-gray-400 mt-1">From the same expert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <ProposalModal projectId={project.id} studentId={studentId} onClose={() => setShowProposalModal(false)} />
      )}
    </motion.div>
  )
}

export default ProjectDetailsPanel
