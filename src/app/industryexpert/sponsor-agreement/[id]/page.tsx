"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft, Loader2, Download, Upload, FileText, Check, X, Calendar, User, Users, BookOpen } from "lucide-react"

interface FYP {
  id: string
  title: string
  description: string
  fypId: string
  members: number
  facultyName?: string
  technology?: string
  yearOfCompletion?: number
  batch?: string
  status?: string
  faculty?: {
    name: string
    department?: string
  }
  students?: {
    name: string
    department?: string
  }[]
}

export default function SponsorAgreementPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fyp, setFyp] = useState<FYP | null>(null)
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [industryExpertName, setIndustryExpertName] = useState<string>("")

  const [agreementFile, setAgreementFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [agreementText, setAgreementText] = useState<string>("")

  const router = useRouter()
  const params = useParams()
  const fypId = params.id as string

  useEffect(() => {
    const fetchFypDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Get user info
        const userResponse = await fetch(
          "http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Step 2: Get industry expert details
        const expertResponse = await fetch(
          `http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) {
          throw new Error("Failed to fetch industry expert details")
        }

        const expertData = await expertResponse.json()
        setIndustryExpertId(expertData.indExptId)
        setIndustryExpertName(`${expertData.firstName} ${expertData.lastName}`)

        // Step 3: Fetch FYP details
        const fypResponse = await fetch(
          `http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${fypId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!fypResponse.ok) throw new Error("Failed to fetch FYP details")

        const fypData = await fypResponse.json()
        setFyp(fypData)

        // Generate agreement text
        generateAgreementText(fypData, `${expertData.firstName} ${expertData.lastName}`)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchFypDetails()
  }, [fypId, router])

  const generateAgreementText = (fypData: FYP, expertName: string) => {
    const currentDate = new Date().toLocaleDateString()
    const text = `
SPONSORSHIP AGREEMENT

This Sponsorship Agreement ("Agreement") is entered into on ${currentDate} by and between:

INDUSTRY EXPERT:
${expertName} ("Sponsor")

AND

UNIVERSITY:
${fypData.faculty?.department || "University Department"} ("University")

AND

STUDENTS:
${fypData.students?.map((s) => s.name).join(", ") || "Student Team"} ("Students")

REGARDING THE FINAL YEAR PROJECT:
"${fypData.title}" (Project ID: ${fypData.fypId})

1. PURPOSE
The purpose of this Agreement is to establish the terms and conditions under which the Sponsor will provide financial and/or technical support for the Students' Final Year Project.

2. SPONSORSHIP DETAILS
The Sponsor agrees to provide the following support:
- Technical guidance and mentorship
- Access to relevant industry resources
- Financial support as separately agreed upon

3. PROJECT TIMELINE
- Project Start Date: ${currentDate}
- Expected Completion Date: ${fypData.yearOfCompletion}

4. INTELLECTUAL PROPERTY
The intellectual property rights will be shared as follows:
- Students retain the right to include the project in their portfolio
- University retains the right to showcase the project for educational purposes
- Sponsor receives a non-exclusive license to use the project outcomes

5. CONFIDENTIALITY
All parties agree to maintain the confidentiality of proprietary information shared during the collaboration.

6. TERMINATION
This Agreement may be terminated by mutual consent or if any party fails to meet their obligations.

7. GOVERNING LAW
This Agreement shall be governed by the laws of the jurisdiction where the University is located.

By proceeding with this sponsorship, all parties acknowledge their agreement to these terms and conditions.
`
    setAgreementText(text)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAgreementFile(file)

      // Create a preview URL for PDF files
      if (file.type === "application/pdf") {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
        toast.error("Please upload a PDF file")
      }
    }
  }

  const handleGenerateAgreement = () => {
    // Create a Blob from the agreement text
    const blob = new Blob([agreementText], { type: "text/plain" })

    // Create a link element and trigger download
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${fyp?.title}-sponsorship-agreement.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Update the convertFileToBase64 function to ensure proper base64 conversion
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        if (reader.result) {
          const bytes = new Uint8Array(reader.result as ArrayBuffer)
          let binary = ""
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          const base64 = window.btoa(binary)
          resolve(base64)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  // Update the handleSubmit function to properly handle the base64 conversion
  const handleSubmit = async () => {
    if (!agreementFile || !industryExpertId || !fyp) {
      toast.error("Please upload a signed agreement document")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("jwtToken")

    try {
      // Convert file to base64
      const base64 = await convertFileToBase64(agreementFile)

      console.log("Uploading sponsor agreement for FYP:", fyp.id)

      const response = await fetch(
        `http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/http://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/sponsor-fyp/${fyp.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            expertId: industryExpertId,
            agreementBase64: base64,
          }),
        },
      )

      if (response.ok) {
        toast.success("Sponsorship agreement submitted successfully!")
        setTimeout(() => {
          router.push("/industry-expert/my-projects")
        }, 2000)
      } else {
        const errorText = await response.text()
        console.error("Sponsor agreement error:", errorText)
        toast.error(`Failed to submit agreement: ${errorText}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while submitting the agreement"
      toast.error(errorMessage)
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !fyp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 p-6 rounded-lg border border-red-700 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error || "Failed to load project details"}</p>
          <button
            onClick={() => router.push("/industry-expert/approved-requests")}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
          >
            Return to Approved Requests
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/industry-expert/approved-requests")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Approved Requests
          </button>

          <h1 className="text-3xl font-bold text-blue-400">Sponsor Agreement</h1>
          <p className="text-gray-400 mt-2">Review and submit the sponsorship agreement for {fyp.title}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{fyp.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-md">{fyp.fypId}</div>
                    {fyp.status && (
                      <div className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-md">
                        Status: {fyp.status}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300">{fyp.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fyp.faculty?.name && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      <span>Faculty: {fyp.faculty.name}</span>
                    </div>
                  )}

                  {fyp.members && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{fyp.members} Members</span>
                    </div>
                  )}

                  {fyp.technology && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>Technology: {fyp.technology}</span>
                    </div>
                  )}

                  {fyp.yearOfCompletion && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Expected completion: {fyp.yearOfCompletion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Agreement Text */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Sponsorship Agreement</h2>
                <button
                  onClick={handleGenerateAgreement}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download Agreement
                </button>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                {agreementText}
              </div>
            </div>

            {/* Upload Agreement */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Upload Signed Agreement</h2>

              <div className="space-y-4">
                <p className="text-gray-400">Please download the agreement, sign it, and upload the signed document.</p>

                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="agreement-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!agreementFile ? (
                    <label
                      htmlFor="agreement-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-gray-500 mb-2" />
                      <p className="text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm">PDF (max. 10MB)</p>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-400" />
                        <div className="text-left">
                          <p className="text-white font-medium">{agreementFile.name}</p>
                          <p className="text-gray-400 text-sm">{(agreementFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAgreementFile(null)
                          setPreviewUrl(null)
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Document Preview</h3>
                    <iframe
                      src={previewUrl}
                      className="w-full h-96 border border-gray-700 rounded-lg"
                      title="Agreement Preview"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Complete Sponsorship</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      agreementText ? "bg-green-500 text-white" : "bg-gray-600"
                    }`}
                  >
                    {agreementText && <Check className="h-3 w-3" />}
                  </div>
                  <span className={agreementText ? "text-white" : "text-gray-400"}>Agreement generated</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      agreementFile ? "bg-green-500 text-white" : "bg-gray-600"
                    }`}
                  >
                    {agreementFile && <Check className="h-3 w-3" />}
                  </div>
                  <span className={agreementFile ? "text-white" : "text-gray-400"}>Signed agreement uploaded</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !agreementFile}
                className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center justify-center gap-2 disabled:bg-blue-800 disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Sponsorship Agreement
              </button>

              <p className="text-xs text-gray-400 mt-3 text-center">
                By submitting, you agree to the terms outlined in the sponsorship agreement.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}
