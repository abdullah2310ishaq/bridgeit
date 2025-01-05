"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileSection from "./facultycomponents/FacultyProfile";
import ResearchSection from "./facultycomponents/FacultyResearch";
import UpcomingEventsSection from "./facultycomponents/FacultyEvents";

interface FacultyProfileData {
  id: string;
  userId: string;
  uniId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string; // Base64 string
  description: string;
  department: string;
  interest: string[];
  post: string;
  universityName: string;
  address: string;
  uniImage: string; // Base64 string
  role: string;
}

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface ResearchPaper {
  id: string;
  paperName: string;
  category: string;
  publishChannel: string;
  link: string;
  otherResearchers: string;
  yearOfPublish: number;
}

const FacultyPage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfileData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndData() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch user info to get role and userId
        const profileResponse = await fetch(
          "https://localhost:7053/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          // Fetch faculty data using userId
          const facultyResponse = await fetch(
            `https://localhost:7053/api/get-faculty/faculty-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();

            // If imageData and uniImage are byte arrays, we need to convert them
            // Assuming your backend returns image data as Base64 strings

            setFacultyProfile({
              id: facultyData.id,
              userId: facultyData.userId,
              uniId: facultyData.uniId,
              firstName: facultyData.firstName,
              lastName: facultyData.lastName,
              email: facultyData.email,
              imageData: facultyData.imageData, // Base64 string
              description: facultyData.description,
              department: facultyData.department,
              interest: facultyData.interest,
              post: facultyData.post,
              universityName: facultyData.universityName,
              address: facultyData.address,
              uniImage: facultyData.uniImage, // Base64 string
              role: profileData.role,
            });

            const facultyId = facultyData.id;

            // Fetch research papers using the faculty ID
            const researchResponse = await fetch(
              `https://localhost:7053/api/ResearchWork/get-researchwork-by-id/${facultyId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (researchResponse.ok) {
              const researchData = await researchResponse.json();
              setResearchPapers(researchData.slice(0, 3));
            }

            // Fetch all events
            const eventsResponse = await fetch(
              "https://localhost:7053/api/Events/get-events",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              setEvents(eventsData);
            }
          } else {
            router.push("/unauthorized");
          }
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Failed to fetch profile or data:", error);
        router.push("/unauthorized");
      }
    }

    fetchProfileAndData();
  }, [router]);

  // Handler functions
  const onViewProfile = () => {
    router.push("/faculty/profile");
  };

  const onEditProfile = () => {
    router.push("/faculty/profile/editfaculty");
  };

  const onSeeMoreResearch = () => {
    router.push("/faculty/research");
  };

  const onCreateResearchPaper = () => {
    router.push("/faculty/research/create");
  };

  const onSeeMoreEvents = () => {
    router.push("/faculty/events");
  };

  const onCreateEvent = () => {
    router.push("/faculty/events/create");
  };

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Profile Section */}
      <ProfileSection
        facultyProfile={facultyProfile}
        onViewProfile={onViewProfile}
        onEditProfile={onEditProfile}
      />
 <div className="space-y-4 mt-8">
  <button
    onClick={() => router.push("/faculty/idea")}
    className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
  >
    Create New Idea
  </button>
  <button
    onClick={() => router.push("/faculty/idea/viewidea")}
    className="w-full py-3 px-6 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600"
  >
    View My Ideas
  </button>
</div>



      {/* Research Section */}
      <ResearchSection
        researchPapers={researchPapers}
        onSeeMoreResearch={onSeeMoreResearch}
        onCreateResearchPaper={onCreateResearchPaper}
      />

      {/* Upcoming Events Section */}
      <UpcomingEventsSection
        events={events}
        onSeeMoreEvents={onCreateEvent}
        onCreateEvent={onSeeMoreEvents}
      />
    </div>
  );
};

export default FacultyPage;
