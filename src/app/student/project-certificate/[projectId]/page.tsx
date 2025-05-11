"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Download, Printer } from 'lucide-react'
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ProjectDetails {
  id: string
  title: string
  description: string
  status: string
  endDate: string
  expertName: string
  studentName: string
}

const ProjectCertificate = () => {
  const { projectId } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const certificateRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    if (!certificateRef.current) return

    try {
      // Capture the certificate DOM element as a canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Increase resolution for better quality
        useCORS: true, // Handle cross-origin issues if any
      })

      // Convert canvas to an image
      const imgData = canvas.toDataURL("image/png")

      // Create a new PDF document (A4 size: 210mm x 297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Calculate dimensions to fit the canvas into the A4 page
      const imgWidth = 190 // Width of the PDF page content (leaving some margin)
      const imgHeight = (canvas.height * imgWidth) / canvas.width // Maintain aspect ratio
      const pageHeight = 297 // A4 height in mm
      const marginTop = 10

      // If the image height exceeds the page height, scale it down
      let heightToFit = imgHeight
      let widthToFit = imgWidth
      if (imgHeight > pageHeight - 20) {
        heightToFit = pageHeight - 20 // Leave 10mm margin on top and bottom
        widthToFit = (canvas.width * heightToFit) / canvas.height
      }

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", (210 - widthToFit) / 2, marginTop, widthToFit, heightToFit)

      // Download the PDF
      pdf.save(`Project_Certificate_${projectId}.pdf`)
    } catch (err) {
      console.error("Error generating PDF:", err)
      toast.error("Failed to download certificate")
    }
  }

  useEffect(() => {
    const fetchProjectData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const res = await fetch(
          `https://localhost:7053/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        if (!res.ok) {
          throw new Error("Failed to fetch project details")
        }
        
        const projectData = await res.json()
        
        if (projectData.status !== "Completed") {
          toast.error("Certificate is only available for completed projects")
          router.push(`/student/projects/milestone/${projectId}`)
          return
        }
        
        setProject(projectData)
      } catch (err) {
        console.error("Error fetching project data:", err)
        setError("Failed to load project data")
        toast.error("Failed to load project data")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId, router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Generating certificate...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-400 mb-6">Error</h1>
          <p>{error || "Project not found"}</p>
          <button
            onClick={() => router.push("/student")}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Project Completion Certificate</h1>
          <div className="space-x-4">
            <button
              onClick={handlePrint}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition flex items-center"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Certificate
            </button>
            <button
              onClick={() => router.push(`/student/projects/detail/${projectId}`)}
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              Back to Project
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-white text-gray-800 p-8 rounded-lg shadow-lg border border-gray-300"
        >
          <div className="border-8 border-double border-green-600 p-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-700 mb-2">Certificate of Completion</h2>
              <p className="text-xl text-gray-600 mb-8">BridgeIT Industry Project</p>

              <div className="my-12">
                <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
                <p className="text-3xl font-bold text-green-800 mb-4">{project.studentName}</p>
                <p className="text-lg text-gray-700 mb-8">has successfully completed the project</p>
                <p className="text-2xl font-bold text-green-800 mb-4">{project.title}</p>
                <p className="text-lg text-gray-700 mb-8">under the guidance of</p>
                <p className="text-xl font-semibold text-green-700 mb-8">{project.expertName}</p>
                <p className="text-lg text-gray-700">
                  Completed on <span className="font-semibold">{formatDate(project.endDate)}</span>
                </p>
              </div>

              <div className="mt-16 flex justify-between items-end">
                <div className="text-center">
                  <div className="w-40 border-t-2 border-gray-400 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Student Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-40 border-t-2 border-gray-400 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Industry Expert Signature</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-300">
                <p className="text-sm text-gray-500">
                  This certificate confirms the successful completion of an industry project through the BridgeIT
                  platform, connecting students with industry experts for real-world project experience.
                </p>
                <p className="text-sm text-gray-500 mt-2">Certificate ID: {project.id.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            You can download or print this certificate for your records. This certificate verifies your successful
            completion of an industry project and can be added to your portfolio.
          </p>
          <button
            onClick={handleDownload}
            className="mt-4 inline-flex items-center py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProjectCertificate